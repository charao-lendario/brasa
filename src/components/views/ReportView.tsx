import { useMemo } from 'react';
import { useFilteredData } from '../../hooks/useFilteredData';
import { brokerRanking, productsSold } from '../../utils/dataTransformers';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { Trophy, TrendingUp, ShoppingBag, BarChart3 } from 'lucide-react';
import { StatCard } from '../cards/StatCard';
import { EMPREENDIMENTO_COLORS, CHART_COLORS } from '../../utils/colors';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

export function ReportView() {
  const { contracts } = useFilteredData();

  const ranking = useMemo(() => brokerRanking(contracts), [contracts]);
  const products = useMemo(() => productsSold(contracts), [contracts]);

  const totalValue = contracts.reduce((s, c) => s + c.valor, 0);
  const avgTicket = contracts.length > 0 ? totalValue / contracts.length : 0;
  const totalContracts = contracts.length;

  const ticketByYear = useMemo(() => {
    const byYear: Record<number, { count: number; value: number }> = {};
    for (const c of contracts) {
      if (!byYear[c.year]) byYear[c.year] = { count: 0, value: 0 };
      byYear[c.year].count++;
      byYear[c.year].value += c.valor;
    }
    return Object.entries(byYear)
      .map(([year, data]) => ({
        year: Number(year),
        ticket: data.count > 0 ? data.value / data.count : 0,
        count: data.count,
      }))
      .sort((a, b) => a.year - b.year);
  }, [contracts]);

  const top10 = ranking.slice(0, 10);
  const totalProducts = products.reduce((s, p) => s + p.count, 0);

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold text-white">Relatorio de Vendas</h2>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total de Vendas"
          value={formatCurrency(totalValue)}
          subtitle={`${totalContracts} contratos`}
          icon={BarChart3}
          color="text-emerald"
        />
        <StatCard
          title="Ticket Medio"
          value={formatCurrency(avgTicket)}
          subtitle="Valor medio por contrato"
          icon={TrendingUp}
          color="text-teal"
        />
        <StatCard
          title="Top Corretor"
          value={top10[0]?.broker ?? '-'}
          subtitle={top10[0] ? formatCurrency(top10[0].totalValue) : ''}
          icon={Trophy}
          color="text-gold-400"
        />
        <StatCard
          title="Produtos Vendidos"
          value={String(totalProducts)}
          subtitle={`${products.length} categorias`}
          icon={ShoppingBag}
          color="text-amber"
        />
      </div>

      {/* RANKING */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Trophy size={20} className="text-gold-400" />
          Ranking de Corretores
        </h3>
        <div className="bg-navy-800 rounded-xl border border-navy-600 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase border-b border-navy-600">
                  <th className="px-5 py-3">#</th>
                  <th className="px-5 py-3">Corretor</th>
                  <th className="px-5 py-3 text-center">Contratos</th>
                  <th className="px-5 py-3 text-right">Valor Total</th>
                  <th className="px-5 py-3 text-right">Ticket Medio</th>
                  <th className="px-5 py-3 text-right">% do Total</th>
                </tr>
              </thead>
              <tbody>
                {ranking.map((r, i) => (
                  <tr key={r.broker} className="border-t border-navy-700 hover:bg-navy-700/50 transition-colors">
                    <td className="px-5 py-2.5">
                      {i < 3 ? (
                        <Trophy size={14} className={i === 0 ? 'text-gold-400' : i === 1 ? 'text-gray-300' : 'text-amber'} />
                      ) : (
                        <span className="text-gray-500">{i + 1}</span>
                      )}
                    </td>
                    <td className="px-5 py-2.5 text-white font-medium">{r.broker}</td>
                    <td className="px-5 py-2.5 text-center text-gray-400">{r.contractCount}</td>
                    <td className="px-5 py-2.5 text-right text-gold-400">{formatCurrency(r.totalValue)}</td>
                    <td className="px-5 py-2.5 text-right text-gray-400">{formatCurrency(r.avgValue)}</td>
                    <td className="px-5 py-2.5 text-right text-gray-400">
                      {totalValue > 0 ? ((r.totalValue / totalValue) * 100).toFixed(1) : 0}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* TICKET MEDIO */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-teal" />
          Ticket Medio por Ano
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-navy-800 rounded-xl border border-navy-600 p-5">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ticketByYear} barSize={40}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1d3a66" />
                  <XAxis dataKey="year" stroke="#64748b" fontSize={12} />
                  <YAxis
                    stroke="#64748b"
                    fontSize={10}
                    tickFormatter={(v: number) => `R$${(v / 1_000_000).toFixed(1)}M`}
                  />
                  <Tooltip
                    contentStyle={{ background: '#101e36', border: '1px solid #1d3a66', borderRadius: 8 }}
                    labelStyle={{ color: '#e2e8f0' }}
                    itemStyle={{ color: '#e2e8f0' }}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={(value: any) => [formatCurrency(value), 'Ticket Medio']}
                  />
                  <Bar dataKey="ticket" radius={[4, 4, 0, 0]}>
                    {ticketByYear.map((entry, i) => (
                      <Cell key={entry.year} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-navy-800 rounded-xl border border-navy-600 p-5">
            <div className="space-y-4">
              {ticketByYear.map((item, i) => (
                <div key={item.year} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                    <span className="text-white font-medium">{item.year}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-gold-400 font-bold">{formatCurrency(item.ticket)}</p>
                    <p className="text-xs text-gray-500">{item.count} contratos</p>
                  </div>
                </div>
              ))}
              <div className="border-t border-navy-600 pt-4 flex items-center justify-between">
                <span className="text-white font-semibold">Media Geral</span>
                <span className="text-teal font-bold text-lg">{formatCurrency(avgTicket)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PRODUTOS VENDIDOS */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <ShoppingBag size={20} className="text-amber" />
          Produtos Vendidos (por Empreendimento)
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-navy-800 rounded-xl border border-navy-600 p-5">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={products}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="count"
                    nameKey="empreendimento"
                    strokeWidth={0}
                  >
                    {products.map((entry, i) => (
                      <Cell key={entry.empreendimento + entry.tipo} fill={EMPREENDIMENTO_COLORS[entry.empreendimento] ?? CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#101e36', border: '1px solid #1d3a66', borderRadius: 8 }}
                    itemStyle={{ color: '#e2e8f0' }}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={(value: any, _name: any, props: any) =>
                      [value, props.payload.empreendimento]
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-2">
              {products.map((p, i) => (
                <div key={p.empreendimento + p.tipo} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: EMPREENDIMENTO_COLORS[p.empreendimento] ?? CHART_COLORS[i % CHART_COLORS.length] }} />
                  <span className="text-xs text-gray-400">{p.empreendimento}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-navy-800 rounded-xl border border-navy-600 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-500 uppercase border-b border-navy-600">
                    <th className="px-5 py-3">Empreendimento</th>
                    <th className="px-5 py-3">Tipo</th>
                    <th className="px-5 py-3 text-center">Qtd</th>
                    <th className="px-5 py-3 text-right">Valor Total</th>
                    <th className="px-5 py-3 text-right">% Qtd</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.empreendimento + p.tipo} className="border-t border-navy-700 hover:bg-navy-700/50 transition-colors">
                      <td className="px-5 py-2.5 text-white font-medium">{p.empreendimento}</td>
                      <td className="px-5 py-2.5 text-gray-400">{p.tipo}</td>
                      <td className="px-5 py-2.5 text-center text-gray-400">{p.count}</td>
                      <td className="px-5 py-2.5 text-right text-gold-400">{formatCurrency(p.value)}</td>
                      <td className="px-5 py-2.5 text-right text-gray-400">
                        {formatPercent(totalProducts > 0 ? (p.count / totalProducts) * 100 : 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
