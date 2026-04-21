export function Footer() {
  return (
    <footer className="border-t border-[var(--border)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 text-sm text-[var(--text-muted)] md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} ABC Pay. All rights reserved.</p>
        <div className="flex gap-6">
          <span>邮箱：hello@abcpay.com</span>
          <span>电话：+86 123 4567 8910</span>
        </div>
      </div>
    </footer>
  );
}
