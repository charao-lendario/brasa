import { useMemo } from 'react';
import type { Contract, DashboardStats } from '../types';
import { monthlyTrend } from '../utils/dataTransformers';

export function useDashboardStats(contracts: Contract[]): DashboardStats {
  return useMemo(() => {
    const totalValue = contracts.reduce((s, c) => s + c.valor, 0);
    const avgTicket = contracts.length > 0 ? totalValue / contracts.length : 0;

    const contractsByYear: Record<number, number> = {};
    const valueByYear: Record<number, number> = {};
    for (const c of contracts) {
      contractsByYear[c.year] = (contractsByYear[c.year] ?? 0) + 1;
      valueByYear[c.year] = (valueByYear[c.year] ?? 0) + c.valor;
    }

    const brokerMap: Record<string, { count: number; value: number }> = {};
    for (const c of contracts) {
      const name = c.broker || 'Sem Corretor';
      if (!brokerMap[name]) brokerMap[name] = { count: 0, value: 0 };
      brokerMap[name].count += 1;
      brokerMap[name].value += c.valor;
    }
    const salesByBroker = Object.entries(brokerMap)
      .map(([broker, data]) => ({ broker, ...data }))
      .sort((a, b) => b.value - a.value);

    const empreendMap: Record<string, { count: number; value: number }> = {};
    for (const c of contracts) {
      const name = c.empreendimento || 'Outro';
      if (!empreendMap[name]) empreendMap[name] = { count: 0, value: 0 };
      empreendMap[name].count += 1;
      empreendMap[name].value += c.valor;
    }
    const byEmpreendimento = Object.entries(empreendMap)
      .map(([empreendimento, data]) => ({ empreendimento, ...data }))
      .sort((a, b) => b.value - a.value);

    return {
      totalContracts: contracts.length,
      totalValue,
      avgTicket,
      contractsByYear,
      valueByYear,
      salesByBroker,
      monthlyTrend: monthlyTrend(contracts),
      byEmpreendimento,
    };
  }, [contracts]);
}
