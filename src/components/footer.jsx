import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-black/5 py-12 px-8 text-sm">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-gray-500">© 2026 Licenzia. Todos los derechos reservados.</p>
        <div className="flex gap-6 font-medium">
          <Link href="#" className="hover:text-black text-gray-500 transition-colors">Instagram</Link>
          <Link href="#" className="hover:text-black text-gray-500 transition-colors">Twitter</Link>
          <Link href="#" className="hover:text-black text-gray-500 transition-colors">Términos</Link>
        </div>
      </div>
    </footer>
  )
}