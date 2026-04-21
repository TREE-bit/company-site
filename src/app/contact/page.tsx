export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <h1 className="text-4xl font-semibold">联系我们</h1>
      <p className="mt-4 text-[var(--text-muted)]">
        欢迎联系 ABC Pay 获取产品演示、接入建议和行业解决方案。
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-7">
          <h2 className="text-xl font-medium">商务咨询</h2>
          <p className="mt-4 text-sm text-[var(--text-muted)]">邮箱：hello@abcpay.com</p>
          <p className="mt-2 text-sm text-[var(--text-muted)]">电话：+86 123 4567 8910</p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-7">
          <h2 className="text-xl font-medium">合作与生态</h2>
          <p className="mt-4 text-sm text-[var(--text-muted)]">我们欢迎支付、风控与数据生态合作伙伴。</p>
          <p className="mt-2 text-sm text-[var(--text-muted)]">请邮件注明：公司名称 + 合作方向。</p>
        </div>
      </div>
    </div>
  );
}
