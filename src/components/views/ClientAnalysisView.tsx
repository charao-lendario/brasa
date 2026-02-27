import { useMemo } from 'react';
import { useFilteredData } from '../../hooks/useFilteredData';
import { groupByYear } from '../../utils/dataTransformers';
import { formatCurrency, formatDate } from '../../utils/formatters';
import type { Contract } from '../../types';

export function ClientAnalysisView() {
  const { contracts, allYears } = useFilteredData();

  const byYear = useMemo(() => {
    const grouped = groupByYear(contracts);
    return allYears.map(year => ({
      year,
      contracts: grouped[year] ?? [],
    }));
  }, [contracts, allYears]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Imobiliarias por Ano</h2>
      {byYear.map(({ year, contracts: yearContracts }) => (
        <div key={year} className="bg-navy-800 rounded-xl border border-navy-600 overflow-hidden">
          <div className="px-5 py-3 border-b border-navy-600 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">{year}</h3>
            <span className="text-xs text-gray-400">
              {yearContracts.length} contrato{yearContracts.length !== 1 ? 's' : ''}
              {' | '}
              {formatCurrency(yearContracts.reduce((s, c) => s + c.valor, 0))}
            </span>
          </div>
          {yearContracts.length === 0 ? (
            <p className="text-gray-500 text-sm p-5">Nenhum contrato neste periodo</p>
          ) : (
            <div className="overflow-x-auto">
              <ContractTable contracts={yearContracts} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ContractTable({ contracts }: { contracts: Contract[] }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-xs text-gray-500 uppercase">
          <th className="px-5 py-2">Corretor</th>
          <th className="px-5 py-2">Cliente</th>
          <th className="px-5 py-2">Data</th>
          <th className="px-5 py-2">Empreendimento</th>
          <th className="px-5 py-2">Imovel</th>
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
            <td className="px-5 py-2.5 text-gray-400 max-w-[200px] truncate">{c.imovel}</td>
            <td className="px-5 py-2.5 text-right text-gold-400">{formatCurrency(c.valor)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
