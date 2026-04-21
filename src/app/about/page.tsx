const milestones = [
  "专注跨境商户支付与风控场景",
  "服务覆盖电商、游戏、数字服务行业",
  "以合规、安全与稳定为平台核心基线"
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <h1 className="text-4xl font-semibold">关于我们</h1>
      <p className="mt-4 max-w-3xl text-[var(--text-muted)]">
        ABC Pay 是一家服务全球化商户的金融科技平台。我们致力于通过专业的支付与风控能力，帮助中国企业高效拓展海外市场。
      </p>

      <section className="mt-10 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8">
        <h2 className="text-2xl font-medium">我们的使命</h2>
        <p className="mt-4 text-[var(--text-muted)]">
          让跨境交易更简单、更安全、更具确定性，让每一家增长型企业都能获得世界级支付基础设施。
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-medium">发展亮点</h2>
        <ul className="mt-5 space-y-3 text-[var(--text-muted)]">
          {milestones.map((item) => (
            <li key={item} className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-5 py-4">
              {item}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
