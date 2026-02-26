import { FileText, DollarSign, TrendingUp, Building, Users } from 'lucide-react';
import { StatCard } from './StatCard';
import { formatCurrency } from '../../utils/formatters';
import type { DashboardStats } from '../../types';

interface StatCardGridProps {
  stats: DashboardStats;
}

export function StatCardGrid({ stats }: StatCardGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <StatCard
        title="Total de Contratos"
        value={String(stats.totalContracts)}
        icon={FileText}
        color="text-gold-400"
      />
      <StatCard
        title="Valor Total"
        value={formatCurrency(stats.totalValue)}
        icon={DollarSign}
        color="text-emerald"
      />
      <StatCard
        title="Ticket Medio"
        value={formatCurrency(stats.avgTicket)}
        icon={TrendingUp}
        color="text-teal"
      />
      <StatCard
        title="Empreendimentos"
        value={String(stats.byEmpreendimento.length)}
        icon={Building}
        color="text-amber"
      />
      <StatCard
        title="Corretores"
        value={String(stats.salesByBroker.length)}
        icon={Users}
        color="text-blue-400"
      />
    </div>
  );
}
