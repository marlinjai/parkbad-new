import Link from 'next/link'

export function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="inline-block rounded-lg px-2 py-1 text-1sc text-black hover:bg-slate-100 hover:text-slate-900"
    >
      {children}
    </Link>
  )
}
