import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import type { Contract } from '../../types';

const COLORS = ['#2dd4bf', '#d4af37'];

interface Props {
  contracts: Contract[];
}

export function DirectSalesPieChart({ contracts }: Props) {
  const data = useMemo(() => {
    const map = new Map<string, { empreendimento: string; count: number; value: number }>();
    for (const c of contracts) {
      const name = c.empreendimento || 'Outro';
      const entry = map.get(name) ?? { empreendimento: name, count: 0, value: 0 };
      entry.count++;
      entry.value += c.valor;
      map.set(name, entry);
    }
    return Array.from(map.values()).sort((a, b) => b.value - a.value);
  }, [contracts]);

  const total = data.reduce((s, d) => s + d.value, 0);

  if (data.length === 0) {
    return (
      <div className="bg-navy-800 rounded-xl border border-navy-600 p-5 flex items-center justify-center h-80">
        <p className="text-gray-500 text-sm">Nenhuma venda direta para exibir</p>
      </div>
    );
  }

  return (
    <div className="bg-navy-800 rounded-xl border border-navy-600 p-5">
      <h3 className="text-sm font-semibold text-white mb-4">Distribuicao por Empreendimento</h3>
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
                <Cell key={entry.empreendimento} fill={COLORS[i % COLORS.length]} />
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
      <div className="flex flex-wrap justify-center gap-6 mt-3">
        {data.map((d, i) => (
          <div key={d.empreendimento} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
            <span className="text-xs text-gray-400">
              {d.empreendimento}: {formatPercent(total > 0 ? (d.value / total) * 100 : 0)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
