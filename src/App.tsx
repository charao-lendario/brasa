import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FilterProvider } from './context/FilterContext';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { OverviewView } from './components/views/OverviewView';
import { BrokersByYearView } from './components/views/BrokersByYearView';
import { NotReturningView } from './components/views/NotReturningView';
import { RankingView } from './components/views/RankingView';
import { AllContractsView } from './components/views/AllContractsView';
import { ReportView } from './components/views/ReportView';

export default function App() {
  return (
    <BrowserRouter>
      <FilterProvider>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<OverviewView />} />
            <Route path="/corretores" element={<BrokersByYearView />} />
            <Route path="/nao-retornaram" element={<NotReturningView />} />
            <Route path="/ranking" element={<RankingView />} />
            <Route path="/contratos" element={<AllContractsView />} />
            <Route path="/relatorio" element={<ReportView />} />
          </Route>
        </Routes>
      </FilterProvider>
    </BrowserRouter>
  );
}
