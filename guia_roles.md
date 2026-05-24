# 🔐 Guía: Sistema de Roles en Licenzia

## ✅ Error Arreglado

El crash venía de estas 2 líneas que alguien dejó sueltas **fuera de cualquier función** en `AuthContext.js`:

```js
// ❌ INCORRECTO - `user` no existe aquí, solo existe dentro de AuthProvider
const role = user?.user_metadata?.role
console.log(role)
```

Las eliminé. `user` es un estado de React (`useState`) que **solo existe dentro del componente `AuthProvider`**.

---

## 🏗️ Arquitectura del Sistema de Roles

Tu proyecto ya tiene la base. El sistema de roles necesita **3 capas**:

```
1. Supabase (base de datos) → guarda el rol
2. AuthContext.js         → expone el rol al frontend  
3. Middleware / Layouts   → protege las rutas
```

---

## Paso 1 — Guardar el Rol en Supabase

Tienes dos opciones. **La más sencilla para tu nivel** es guardar el rol en `user_metadata` de Supabase Auth:

### Opción A: `user_metadata` (recomendada para empezar)
Cuando el usuario se registra, asignas el rol por defecto:

```js
// En login/page.js → handleSubmit → registro
const { error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      full_name: nombre,
      role: 'usuario',  // 👈 rol por defecto al registrarse
    },
  },
})
```

Para cambiar el rol de un usuario a `admin`, lo haces desde el **Dashboard de Supabase**:
- Ve a **Authentication → Users**
- Click en el usuario
- Edita `user_metadata` y cambia `"role": "admin"`

### Opción B: Tabla `usuarios` en Supabase (más flexible)
Tu página `/admin/usuarios/page.js` ya espera una tabla `usuarios` con columnas `id`, `email`, `nombre`, `rol`. Créala así en Supabase SQL Editor:

```sql
CREATE TABLE public.usuarios (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  nombre TEXT,
  rol TEXT DEFAULT 'usuario' CHECK (rol IN ('admin', 'usuario')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activar RLS
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- Los admins pueden ver todo
CREATE POLICY "Admins pueden ver todos los usuarios"
  ON public.usuarios FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.usuarios u
      WHERE u.id = auth.uid() AND u.rol = 'admin'
    )
  );

-- Cada usuario puede ver su propio registro
CREATE POLICY "Usuario puede ver su propio perfil"
  ON public.usuarios FOR SELECT
  USING (id = auth.uid());

-- Insertar usuario al registrarse (via trigger)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.usuarios (id, email, nombre, rol)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    'usuario'  -- rol por defecto
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## Paso 2 — Exponer el Rol en AuthContext

Modifica `AuthContext.js` para que el rol esté disponible en toda la app:

```js
"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"

const AuthContext = createContext({
  user: null,
  role: null,       // 👈 agrega esto
  loading: true,
  signOut: async () => {},
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)   // 👈 nuevo estado
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const currentUser = session?.user ?? null
      setUser(currentUser)

      // Obtener el rol desde user_metadata (Opción A)
      setRole(currentUser?.user_metadata?.role ?? 'usuario')

      setLoading(false)
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const currentUser = session?.user ?? null
        setUser(currentUser)
        setRole(currentUser?.user_metadata?.role ?? 'usuario')
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setRole(null)
  }

  return (
    <AuthContext.Provider value={{ user, role, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
```

---

## Paso 3 — Usar el Rol en Componentes

En cualquier componente puedes saber el rol del usuario así:

```js
"use client"
import { useAuth } from "@/context/AuthContext"

export default function MiComponente() {
  const { user, role, loading } = useAuth()

  if (loading) return <p>Cargando...</p>

  if (!user) return <p>No has iniciado sesión</p>

  return (
    <div>
      <p>Hola {user.email}</p>
      <p>Tu rol es: {role}</p>

      {role === 'admin' && (
        <p>🔑 Ves esto porque eres administrador</p>
      )}
    </div>
  )
}
```

---

## Paso 4 — Proteger el Layout de Admin

Modifica `admin/layout.js` para que solo los admins puedan acceder:

```js
"use client"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AdminLayout({ children }) {
  const { user, role, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login')  // No autenticado → login
      } else if (role !== 'admin') {
        router.push('/')       // Autenticado pero no admin → home
      }
    }
  }, [user, role, loading])

  if (loading || !user || role !== 'admin') {
    return <div>Verificando permisos...</div>
  }

  return (
    // ... tu JSX del layout admin actual ...
    <div>{children}</div>
  )
}
```

---

## Paso 5 — Proteger Rutas en el Middleware (nivel servidor)

Actualiza `middleware.js` para redirigir en el servidor:

```js
import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"

export async function middleware(request) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Proteger rutas /admin/*
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Verificar rol admin en user_metadata
    const role = user.user_metadata?.role
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
```

---

## 📋 Resumen de Pasos

| Paso | Qué hacer | Archivo |
|------|-----------|---------|
| 1 | Asignar `role: 'usuario'` al registrarse | `login/page.js` |
| 2 | Exponer `role` desde el contexto | `AuthContext.js` |
| 3 | Usar `role` en componentes con `useAuth()` | Cualquier componente |
| 4 | Proteger el layout admin con redirect | `admin/layout.js` |
| 5 | Proteger rutas a nivel servidor | `middleware.js` |

> [!TIP]
> Para hacer admin a tu primer usuario, ve al Dashboard de Supabase → Authentication → Users → click en el usuario → edita el campo `user_metadata` y agrega `"role": "admin"`.

> [!IMPORTANT]
> El middleware protege a nivel servidor (más seguro). El layout protege la UI. Usa **ambos** para máxima seguridad.
