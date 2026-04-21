const productModules = [
  {
    title: "Global Payments",
    detail: "聚合信用卡、本地钱包、银行转账等方式，按地区智能编排路由。"
  },
  {
    title: "Risk Orchestration",
    detail: "基于规则+模型的双层策略，覆盖盗刷、薅羊毛、账号滥用等风险场景。"
  },
  {
    title: "Revenue Intelligence",
    detail: "统一交易数据视图，支持成功率、拒付率、风控拦截率等核心指标追踪。"
  }
];

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <h1 className="text-4xl font-semibold">产品能力</h1>
      <p className="mt-4 max-w-3xl text-[var(--text-muted)]">
        ABC Pay 提供从支付接入、风险控制到数据运营的全链路产品能力，帮助企业建立可持续的全球化交易体系。
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {productModules.map((item) => (
          <article key={item.title} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-7">
            <h2 className="text-xl font-medium text-cyan-200">{item.title}</h2>
            <p className="mt-4 text-sm text-[var(--text-muted)]">{item.detail}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
