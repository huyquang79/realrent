import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './lib/auth-context';
import { Navigation } from './components/layout/Navigation';
import { MarketplacePage } from './pages/MarketplacePage';
import { RoomDetailPage } from './pages/RoomDetailPage';
import { SaleDashboard } from './pages/sale/SaleDashboard';
import { LeadsPage } from './pages/sale/LeadsPage';
import { AppointmentsPage } from './pages/sale/AppointmentsPage';
import { CommissionsPage } from './pages/sale/CommissionsPage';
import { RankingPage } from './pages/sale/RankingPage';
import { OwnerDashboard } from './pages/owner/OwnerDashboard';
import { BuildingsPage } from './pages/owner/BuildingsPage';
import { RoomsGridPage } from './pages/owner/RoomsGridPage';
import { SalesManagementPage } from './pages/owner/SalesManagementPage';
import { DepositApprovalPage } from './pages/owner/DepositApprovalPage';
import { ActivityLogPage } from './pages/owner/ActivityLogPage';
import { AuthPage } from './pages/AuthPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Auth Route - Full page without navigation */}
            <Route path="/auth" element={<AuthPage />} />

            {/* All other routes with navigation */}
            <Route
              path="*"
              element={
                <>
                  <Navigation />
                  <main>
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<MarketplacePage />} />
                      <Route path="/marketplace" element={<MarketplacePage />} />
                      <Route path="/room/:id" element={<RoomDetailPage />} />

                      {/* Sale Portal Routes */}
                      <Route path="/dashboard" element={<SaleDashboard />} />
                      <Route path="/leads" element={<LeadsPage />} />
                      <Route path="/appointments" element={<AppointmentsPage />} />
                      <Route path="/commissions" element={<CommissionsPage />} />
                      <Route path="/ranking" element={<RankingPage />} />

                      {/* Owner Portal Routes */}
                      <Route path="/buildings" element={<BuildingsPage />} />
                      <Route path="/rooms" element={<RoomsGridPage />} />
                      <Route path="/sales" element={<SalesManagementPage />} />
                      <Route path="/deposits" element={<DepositApprovalPage />} />
                      <Route path="/activity" element={<ActivityLogPage />} />
                    </Routes>
                  </main>
                </>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
