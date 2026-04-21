const sellingPoints = [
  {
    title: "全球本地化收单",
    desc: "覆盖多地区支付方式，提升本地支付成功率，降低跨境交易摩擦。"
  },
  {
    title: "实时智能风控",
    desc: "基于设备、行为、交易链路的多维风控模型，秒级识别高风险订单。"
  },
  {
    title: "统一资金与对账",
    desc: "多渠道交易统一看板，自动化对账与财务报表，提升运营效率。"
  }
];

const capabilities = [
  "支付编排：智能路由与自动重试，保障交易稳定性",
  "风控策略引擎：灵活配置规则，支持灰度与AB实验",
  "企业级数据平台：多维报表、告警与可视化分析",
  "开发者友好：标准 API、Webhooks 与完整接入文档"
];

const trustSignals = ["服务 300+ 出海商户", "99.99% 平台可用性", "7x24 全球技术支持", "通过多项安全与合规实践"];

const faq = [
  {
    q: "ABC Pay 适合哪些企业？",
    a: "适合出海电商、游戏、SaaS 与数字内容平台，尤其是希望统一支付与风控能力的团队。"
  },
  {
    q: "上线周期需要多久？",
    a: "标准场景通常 1-2 周可完成接入上线，复杂场景可由解决方案团队提供迁移支持。"
  },
  {
    q: "是否支持后续国际化？",
    a: "支持。平台与官网架构均可平滑扩展为多语言和多区域运营模式。"
  }
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-20 pt-10">
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-10 md:p-14">
        <p className="mb-4 inline-block rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-xs text-cyan-200">
          跨境支付与风控一体化平台
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight md:text-5xl">
          为全球增长型企业打造
          <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent"> 稳定、合规、可扩展 </span>
          的支付基础设施
        </h1>
        <p className="mt-6 max-w-2xl text-[var(--text-muted)]">
          ABC Pay 聚焦跨境商户核心挑战：支付成功率、欺诈控制与资金管理效率，帮助团队在增长中保持稳健。
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="/contact"
            className="rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 font-medium text-slate-950"
          >
            预约产品演示
          </a>
          <a href="/products" className="rounded-xl border border-[var(--border)] px-6 py-3 font-medium text-white">
            查看产品能力
          </a>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-semibold">核心卖点</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {sellingPoints.map((item) => (
            <article key={item.title} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
              <h3 className="text-lg font-medium">{item.title}</h3>
              <p className="mt-3 text-sm text-[var(--text-muted)]">{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-semibold">产品能力介绍</h2>
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {capabilities.map((item) => (
            <li key={item} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 text-[var(--text-muted)]">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-semibold">信任背书</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {trustSignals.map((item) => (
            <div key={item} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 text-center text-sm">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-semibold">FAQ</h2>
        <div className="mt-6 space-y-4">
          {faq.map((item) => (
            <article key={item.q} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
              <h3 className="font-medium">{item.q}</h3>
              <p className="mt-3 text-sm text-[var(--text-muted)]">{item.a}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-3xl border border-cyan-400/30 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 p-10 text-center">
        <h2 className="text-3xl font-semibold">准备加速你的全球业务增长？</h2>
        <p className="mx-auto mt-4 max-w-2xl text-[var(--text-muted)]">
          与 ABC Pay 团队联系，获取面向你业务模型的支付与风控方案建议。
        </p>
        <a
          href="/contact"
          className="mt-8 inline-block rounded-xl bg-white px-6 py-3 font-medium text-slate-900 transition hover:bg-slate-200"
        >
          立即咨询
        </a>
      </section>
    </div>
  );
}
