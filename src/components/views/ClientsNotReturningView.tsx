import { useMemo } from 'react';
import { useFilteredData } from '../../hooks/useFilteredData';
import { brokersInANotB } from '../../utils/dataTransformers';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { UserX } from 'lucide-react';
import type { Contract } from '../../types';

export function ClientsNotReturningView() {
  const { allContracts } = useFilteredData();

  const in2023Not2024 = useMemo(() => brokersInANotB(allContracts, 2023, 2024), [allContracts]);
  const in2024Not2025 = useMemo(() => brokersInANotB(allContracts, 2024, 2025), [allContracts]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Corretores que Nao Retornaram</h2>

      <Section
        title="Venderam em 2023, nao retornaram em 2024"
        contracts={in2023Not2024}
      />
      <Section
        title="Venderam em 2024, nao retornaram em 2025"
        contracts={in2024Not2025}
      />
    </div>
  );
}

function Section({ title, contracts }: { title: string; contracts: Contract[] }) {
  const uniqueBrokers = [...new Set(contracts.map(c => c.broker.toUpperCase().trim()))].length;

  return (
    <div className="bg-navy-800 rounded-xl border border-navy-600 overflow-hidden">
      <div className="px-5 py-3 border-b border-navy-600 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserX size={16} className="text-coral" />
          <h3 className="text-sm font-semibold text-white">{title}</h3>
        </div>
        <span className="text-xs text-gray-400">
          {uniqueBrokers} corretor{uniqueBrokers !== 1 ? 'es' : ''}
          {' | '}
          {contracts.length} contrato{contracts.length !== 1 ? 's' : ''}
        </span>
      </div>
      {contracts.length === 0 ? (
        <p className="text-gray-500 text-sm p-5">Todos os corretores retornaram!</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase">
                <th className="px-5 py-2">Corretor</th>
                <th className="px-5 py-2">Cliente</th>
                <th className="px-5 py-2">Data</th>
                <th className="px-5 py-2">Empreendimento</th>
                <th className="px-5 py-2 text-right">Valor</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map(c => (
                <tr key={c.id} className="border-t border-navy-700 hover:bg-navy-700/50 transition-colors">
                  <td className="px-5 py-2.5 text-white">{c.broker}</td>
                  <td className="px-5 py-2.5 text-gray-400">{c.clientName}</td>
                  <td className="px-5 py-2.5 text-gray-400">{formatDate(c.date)}</td>
                  <td className="px-5 py-2.5 text-gray-400">{c.empreendimento}</td>
                  <td className="px-5 py-2.5 text-right text-coral">{formatCurrency(c.valor)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
