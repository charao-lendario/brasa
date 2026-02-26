export interface Contract {
  id: string;
  date: string;
  clientName: string;
  broker: string;
  imobiliaria: string;
  brokerEmail: string;
  brokerPhone: string;
  imovel: string;
  tipo: string;
  valor: number;
  empreendimento: string;
  year: number;
  month: number;
  fileYear: number;
}

export interface FilterState {
  years: number[];
  empreendimentos: string[];
  brokers: string[];
}

export type FilterAction =
  | { type: 'TOGGLE_YEAR'; year: number }
  | { type: 'SET_YEARS'; years: number[] }
  | { type: 'TOGGLE_EMPREENDIMENTO'; empreendimento: string }
  | { type: 'SET_EMPREENDIMENTOS'; empreendimentos: string[] }
  | { type: 'TOGGLE_BROKER'; broker: string }
  | { type: 'SET_BROKERS'; brokers: string[] }
  | { type: 'RESET' };

export interface DashboardStats {
  totalContracts: number;
  totalValue: number;
  avgTicket: number;
  contractsByYear: Record<number, number>;
  valueByYear: Record<number, number>;
  salesByBroker: { broker: string; count: number; value: number }[];
  monthlyTrend: { month: number; year: number; count: number; value: number }[];
  byEmpreendimento: { empreendimento: string; count: number; value: number }[];
}

export interface BrokerRanking {
  broker: string;
  contractCount: number;
  totalValue: number;
  avgValue: number;
}
