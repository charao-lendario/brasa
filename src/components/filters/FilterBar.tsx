import { useFilterContext } from '../../context/FilterContext';
import { useFilteredData } from '../../hooks/useFilteredData';
import { YearFilter } from './YearFilter';
import { MultiSelectFilter } from './MultiSelectFilter';
import { RotateCcw } from 'lucide-react';

export function FilterBar() {
  const { state, dispatch } = useFilterContext();
  const { allYears, allEmpreendimentos, allBrokers } = useFilteredData();

  const hasFilters = state.years.length > 0 ||
    state.empreendimentos.length > 0 ||
    state.brokers.length > 0;

  return (
    <div className="bg-navy-800/50 border-b border-navy-600 px-4 lg:px-6 py-3">
      <div className="flex flex-wrap items-center gap-3">
        <YearFilter years={allYears} selected={state.years} />
        <MultiSelectFilter
          label="Empreendimento"
          options={allEmpreendimentos}
          selected={state.empreendimentos}
          onToggle={(v) => dispatch({ type: 'TOGGLE_EMPREENDIMENTO', empreendimento: v })}
          onClear={() => dispatch({ type: 'SET_EMPREENDIMENTOS', empreendimentos: [] })}
        />
        <MultiSelectFilter
          label="Corretor"
          options={allBrokers}
          selected={state.brokers}
          onToggle={(v) => dispatch({ type: 'TOGGLE_BROKER', broker: v })}
          onClear={() => dispatch({ type: 'SET_BROKERS', brokers: [] })}
        />
        {hasFilters && (
          <button
            onClick={() => dispatch({ type: 'RESET' })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-navy-700 text-gray-400 hover:text-white transition-colors"
          >
            <RotateCcw size={14} />
            Limpar
          </button>
        )}
      </div>
    </div>
  );
}
