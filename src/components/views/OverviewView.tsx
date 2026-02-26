import { useFilteredData } from '../../hooks/useFilteredData';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { StatCardGrid } from '../cards/StatCardGrid';
import { SalesByYearChart } from '../charts/SalesByYearChart';
import { ValueByYearChart } from '../charts/ValueByYearChart';
import { MonthlyTrendChart } from '../charts/MonthlyTrendChart';
import { EmpreendimentoPieChart } from '../charts/EmpreendimentoPieChart';

export function OverviewView() {
  const { contracts } = useFilteredData();
  const stats = useDashboardStats(contracts);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Visao Geral</h2>
      <StatCardGrid stats={stats} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesByYearChart stats={stats} />
        <ValueByYearChart stats={stats} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlyTrendChart stats={stats} />
        <EmpreendimentoPieChart data={stats.byEmpreendimento} />
      </div>
    </div>
  );
}
