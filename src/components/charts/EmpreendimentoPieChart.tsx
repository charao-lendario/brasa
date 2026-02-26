import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { EMPREENDIMENTO_COLORS, CHART_COLORS } from '../../utils/colors';

interface Props {
  data: { empreendimento: string; count: number; value: number }[];
}

export function EmpreendimentoPieChart({ data }: Props) {
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="bg-navy-800 rounded-xl border border-navy-600 p-5">
      <h3 className="text-sm font-semibold text-white mb-4">Vendas por Empreendimento</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
              nameKey="empreendimento"
              strokeWidth={0}
            >
              {data.map((entry, i) => (
                <Cell key={entry.empreendimento} fill={EMPREENDIMENTO_COLORS[entry.empreendimento] ?? CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: '#101e36', border: '1px solid #1d3a66', borderRadius: 8 }}
              itemStyle={{ color: '#e2e8f0' }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => [formatCurrency(value), 'Valor']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        {data.map((d, i) => (
          <div key={d.empreendimento} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: EMPREENDIMENTO_COLORS[d.empreendimento] ?? CHART_COLORS[i % CHART_COLORS.length] }} />
            <span className="text-xs text-gray-400">
              {d.empreendimento}: {formatPercent(total > 0 ? (d.value / total) * 100 : 0)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
