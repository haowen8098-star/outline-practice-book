import Link from "next/link";

import { navItems, cn } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--border-soft)] bg-[color:var(--background)]/92 backdrop-blur-xl">
      <div className="page-shell flex items-center justify-between gap-4 py-4">
        <Link href="/" className="group button-pop flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-2xl border border-[color:var(--border-soft)] bg-white text-lg shadow-[0_12px_30px_rgba(105,142,125,0.08)] transition-transform duration-300 group-hover:-translate-y-0.5">
            〇
          </span>
          <div>
            <p className="text-sm font-semibold tracking-[0.18em] text-[color:var(--primary-strong)]">空心字练习本</p>
            <p className="text-xs text-[color:var(--muted-foreground)] sm:text-sm">把普通字变成能照着写的空心字参考</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "button-pop rounded-full px-4 py-2 text-sm font-medium text-[color:var(--muted-foreground)] transition-colors duration-200",
                "hover:bg-white hover:text-[color:var(--foreground)]",
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/#workbench"
            className="button-pop rounded-full bg-[color:var(--primary-strong)] px-4 py-2 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(98,137,120,0.22)] transition-transform duration-300 hover:-translate-y-0.5"
          >
            立即试写
          </Link>
        </nav>

        <Link
          href="/#workbench"
          className="button-pop rounded-full bg-white px-4 py-2 text-sm font-semibold text-[color:var(--foreground)] shadow-[0_18px_38px_rgba(129,157,142,0.12)] md:hidden"
        >
          试写
        </Link>
      </div>
    </header>
  );
}
