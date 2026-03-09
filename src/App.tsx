import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FilterProvider } from './context/FilterContext';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { OverviewView } from './components/views/OverviewView';
import { ClientAnalysisView } from './components/views/ClientAnalysisView';
import { ClientsNotReturningView } from './components/views/ClientsNotReturningView';
import { AgencyRankingView } from './components/views/AgencyRankingView';
import { AllContractsView } from './components/views/AllContractsView';

export default function App() {
  return (
    <BrowserRouter>
      <FilterProvider>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<OverviewView />} />
            <Route path="/clientes" element={<ClientAnalysisView />} />
            <Route path="/nao-retornaram" element={<ClientsNotReturningView />} />
            <Route path="/imobiliarias" element={<AgencyRankingView />} />
            <Route path="/contratos" element={<AllContractsView />} />
          </Route>
        </Routes>
      </FilterProvider>
    </BrowserRouter>
  );
}
