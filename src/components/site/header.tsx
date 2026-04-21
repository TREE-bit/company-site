import Link from "next/link";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/products", label: "产品" },
  { href: "/about", label: "关于我们" },
  { href: "/contact", label: "联系我们" },
  { href: "/admin", label: "管理后台" }
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[rgba(6,11,26,0.82)] backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-wide">
          <span className="text-[var(--primary)]">ABC</span> Pay
        </Link>
        <nav className="flex items-center gap-6 text-sm text-[var(--text-muted)]">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
