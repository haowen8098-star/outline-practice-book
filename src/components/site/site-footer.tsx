import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/60 bg-white/48">
      <div className="page-shell grid gap-8 py-12 md:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-3">
          <p className="text-sm font-semibold tracking-[0.2em] text-[color:var(--primary-strong)]">空心字练习本</p>
          <h2 className="max-w-xl text-2xl font-semibold tracking-tight text-[color:var(--foreground)]">
            先把字写稳，再把轮廓写好，标题会更清楚，也更有呼吸感。
          </h2>
          <p className="max-w-xl text-sm leading-7 text-[color:var(--muted-foreground)]">
            适合手账、课堂标题、工整笔记和手抄报。挑好一款风格，照着练几次，慢慢就会写出更顺手的空心字。
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {["5 套中文风格", "4 步教学图示", "A4 打印参考页"].map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/80 bg-white/78 px-3 py-1 text-xs font-medium text-[color:var(--pill-text)]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="soft-panel p-5">
          <p className="text-sm font-semibold tracking-[0.18em] text-[color:var(--primary-strong)]">站内入口</p>
          <div className="mt-4 grid gap-3 text-sm text-[color:var(--muted-foreground)]">
            <Link href="/" className="transition-colors hover:text-[color:var(--foreground)]">
              首页工具
            </Link>
            <Link href="/guides" className="transition-colors hover:text-[color:var(--foreground)]">
              写法指南
            </Link>
            <Link href="/print" className="transition-colors hover:text-[color:var(--foreground)]">
              打印参考页
            </Link>
            <a href="#faq" className="transition-colors hover:text-[color:var(--foreground)]">
              常见问题
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
