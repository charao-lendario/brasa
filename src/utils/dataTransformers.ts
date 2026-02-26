import type { Contract, BrokerRanking } from '../types';

export function groupByYear(contracts: Contract[]): Record<number, Contract[]> {
  return contracts.reduce((acc, c) => {
    (acc[c.year] ??= []).push(c);
    return acc;
  }, {} as Record<number, Contract[]>);
}

function brokersByYear(contracts: Contract[]): Record<number, Set<string>> {
  const byYear = groupByYear(contracts);
  const result: Record<number, Set<string>> = {};
  for (const [year, cs] of Object.entries(byYear)) {
    result[Number(year)] = new Set(cs.map(c => c.broker.toUpperCase().trim()));
  }
  return result;
}

export function brokersInANotB(contracts: Contract[], yearA: number, yearB: number): Contract[] {
  const byYear = brokersByYear(contracts);
  const brokersA = byYear[yearA] ?? new Set();
  const brokersB = byYear[yearB] ?? new Set();
  const notReturned = new Set([...brokersA].filter(b => !brokersB.has(b)));

  return contracts.filter(c => c.year === yearA && notReturned.has(c.broker.toUpperCase().trim()));
}

export function brokerRanking(contracts: Contract[]): BrokerRanking[] {
  const brokerMap = new Map<string, { count: number; value: number }>();

  for (const c of contracts) {
    const name = c.broker || 'Sem Corretor';
    const entry = brokerMap.get(name) ?? { count: 0, value: 0 };
    entry.count++;
    entry.value += c.valor;
    brokerMap.set(name, entry);
  }

  return Array.from(brokerMap.entries())
    .map(([broker, { count, value }]) => ({
      broker,
      contractCount: count,
      totalValue: value,
      avgValue: value / count,
    }))
    .sort((a, b) => b.totalValue - a.totalValue);
}

export function monthlyTrend(contracts: Contract[]) {
  const map = new Map<string, { month: number; year: number; count: number; value: number }>();

  for (const c of contracts) {
    const key = `${c.year}-${String(c.month).padStart(2, '0')}`;
    const entry = map.get(key) ?? { month: c.month, year: c.year, count: 0, value: 0 };
    entry.count++;
    entry.value += c.valor;
    map.set(key, entry);
  }

  return Array.from(map.values()).sort((a, b) =>
    a.year !== b.year ? a.year - b.year : a.month - b.month
  );
}

export function productsSold(contracts: Contract[]) {
  const map = new Map<string, { tipo: string; empreendimento: string; count: number; value: number }>();

  for (const c of contracts) {
    const key = `${c.empreendimento}|${c.tipo || 'Apartamentos'}`;
    const entry = map.get(key) ?? { tipo: c.tipo || 'Apartamentos', empreendimento: c.empreendimento, count: 0, value: 0 };
    entry.count++;
    entry.value += c.valor;
    map.set(key, entry);
  }

  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}
