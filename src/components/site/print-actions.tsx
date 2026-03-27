"use client";

export function PrintActions() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-full bg-[color:var(--primary-strong)] px-4 py-2 text-sm font-semibold text-white shadow-[0_18px_32px_rgba(98,137,120,0.22)] transition hover:-translate-y-0.5"
    >
      直接打印
    </button>
  );
}
