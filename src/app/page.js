import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'


export default async function home() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: todos } = await supabase.from('todos').select()

  return (
    <>
    <h1>Home</h1>
    <ul>
      {todos?.map((todo) => (
        <li key={todo.id}>{todo.name}</li>
      ))}
    </ul>
    </>
  )
}
