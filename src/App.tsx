/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LanguageContext, useLanguageState } from './hooks/useLanguage';
import { useDamData } from './hooks/useDamData';
import { useLocation } from './hooks/useLocation';
import { INITIAL_ALERTS } from './data/alerts';
import { INITIAL_SHELTERS } from './data/shelters';
import { INITIAL_FLOOD_ZONES } from './data/floodZones';
import { EvacuationRoute, GeoCoordinates, UserProfile } from './types';

// Layout & Reusable Components
import { Navbar } from './components/Navbar';
import { Sidebar, NavigationPage } from './components/Sidebar';
import { AIChatbot } from './components/AIChatbot';
import { EmergencyModal } from './components/EmergencyModal';
import { SplashScreen } from './components/SplashScreen';
import { LoginForm } from './components/LoginForm';

// Page Components
import { DashboardPage } from './pages/DashboardPage';
import { LiveMapPage } from './pages/LiveMapPage';
import { DamMonitoringPage } from './pages/DamMonitoringPage';
import { FloodPredictionPage } from './pages/FloodPredictionPage';
import { AlertsPage } from './pages/AlertsPage';
import { SafeRoutesPage } from './pages/SafeRoutesPage';
import { SheltersPage } from './pages/SheltersPage';
import { AnalyticsPage } from './pages/AnalyticsPage';

export default function App() {
  const languageState = useLanguageState();
  const damState = useDamData();
  const locationState = useLocation();

  // Navigation and Modal States
  const [activePage, setActivePage] = useState<NavigationPage>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSOSModalOpen, setIsSOSModalOpen] = useState(false);
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>({
    id: 'usr-default',
    name: 'Er. Rajesh Varma',
    email: 'rajesh.varma@cwc.gov.in',
    role: 'officer',
    assignedDamId: 'dam-002',
  });

  // Active Evacuation Route (highlighted in BLUE on map)
  const [activeRoute, setActiveRoute] = useState<EvacuationRoute | null>(null);

  // Handle chatbot asking to navigate to live map with highlighted route
  const handleChatbotNavigateToMap = (routeId?: string, focusCoords?: GeoCoordinates) => {
    setActivePage('live-map');
    if (focusCoords && locationState.setManualLocation) {
      // Focus map coordinates if needed
    }
  };

  const handleNavigateToSafeRoutes = () => {
    setActivePage('safe-routes');
  };

  return (
    <LanguageContext.Provider value={languageState}>
      {/* 1. Optional Splash Screen on first launch */}
      {showSplashScreen && (
        <SplashScreen onEnter={() => setShowSplashScreen(false)} />
      )}

      {/* 2. Login Modal if explicitly requested */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLoginModal(false)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-sm font-bold border border-slate-700 cursor-pointer"
            >
              ✕
            </button>
            <LoginForm
              onLoginSuccess={(user) => {
                setCurrentUser(user);
                setShowLoginModal(false);
              }}
            />
          </div>
        </div>
      )}

      {/* 3. Emergency SOS Modal */}
      <EmergencyModal
        isOpen={isSOSModalOpen}
        onClose={() => setIsSOSModalOpen(false)}
        onNavigateSafeRoute={handleNavigateToSafeRoutes}
      />

      {/* 4. Main Application Shell */}
      <div className="min-h-screen bg-[#050c17] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-sky-950">
        {/* Top Navbar */}
        <Navbar
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
          onOpenEmergencySOS={() => setIsSOSModalOpen(true)}
          onSearchChange={(q) => {
            damState.setSearchQuery(q);
            if (activePage !== 'dam-monitoring' && q.trim().length > 0) {
              setActivePage('dam-monitoring');
            }
          }}
          activeSearchTerm={damState.searchQuery}
          user={currentUser}
          onLogout={() => setShowLoginModal(true)}
          unreadAlertCount={INITIAL_ALERTS.filter((a) => a.severity === 'critical').length}
        />

        {/* Body Workspace with Left Sidebar & Main Page Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Navigation Sidebar */}
          <Sidebar
            activePage={activePage}
            onNavigate={(page) => setActivePage(page)}
            isOpen={isSidebarOpen}
            onCloseMobile={() => setIsSidebarOpen(false)}
            criticalCount={damState.stats.critical}
          />

          {/* Main Scrollable Viewport */}
          <main className="flex-1 overflow-y-auto lg:pl-64 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {activePage === 'dashboard' && (
                <DashboardPage
                  dams={damState.dams}
                  alerts={INITIAL_ALERTS}
                  shelters={INITIAL_SHELTERS}
                  selectedDam={damState.selectedDam}
                  onSelectDam={(d) => damState.setSelectedDamId(d.id)}
                  onNavigateToPage={(p) => setActivePage(p)}
                  onOpenSOSModal={() => setIsSOSModalOpen(true)}
                />
              )}

              {activePage === 'live-map' && (
                <LiveMapPage
                  dams={damState.dams}
                  floodZones={INITIAL_FLOOD_ZONES}
                  shelters={INITIAL_SHELTERS}
                  userLocation={locationState.coordinates}
                  activeRoute={activeRoute}
                  onClearActiveRoute={() => setActiveRoute(null)}
                  onSetActiveRoute={(r) => setActiveRoute(r)}
                  selectedDam={damState.selectedDam}
                  onSelectDam={(d) => damState.setSelectedDamId(d.id)}
                  onUpdateUserLocation={locationState.setManualLocation}
                />
              )}

              {activePage === 'dam-monitoring' && (
                <DamMonitoringPage
                  dams={damState.dams}
                  filteredDams={damState.filteredDams}
                  selectedDam={damState.selectedDam}
                  onSelectDam={(d) => damState.setSelectedDamId(d.id)}
                  searchQuery={damState.searchQuery}
                  onSearchChange={damState.setSearchQuery}
                  selectedState={damState.selectedState}
                  onStateChange={damState.setSelectedState}
                  selectedBasin={damState.selectedBasin}
                  onBasinChange={damState.setSelectedBasin}
                  selectedRisk={damState.selectedRisk}
                  onRiskChange={damState.setSelectedRisk}
                  onRefreshTelemetry={damState.refreshTelemetry}
                  onNavigateToMap={() => setActivePage('live-map')}
                />
              )}

              {activePage === 'flood-prediction' && (
                <FloodPredictionPage
                  dams={damState.dams}
                  selectedDam={damState.selectedDam}
                  onSelectDam={(d) => damState.setSelectedDamId(d.id)}
                />
              )}

              {activePage === 'alerts' && (
                <AlertsPage
                  alerts={INITIAL_ALERTS}
                  onSelectDam={(damId) => {
                    damState.setSelectedDamId(damId);
                    setActivePage('dam-monitoring');
                  }}
                  onOpenSOSModal={() => setIsSOSModalOpen(true)}
                />
              )}

              {activePage === 'safe-routes' && (
                <SafeRoutesPage
                  shelters={INITIAL_SHELTERS}
                  userLocation={locationState.coordinates}
                  activeRoute={activeRoute}
                  onSetActiveRoute={(r) => setActiveRoute(r)}
                  onNavigateToLiveMap={() => setActivePage('live-map')}
                />
              )}

              {activePage === 'shelters' && (
                <SheltersPage
                  shelters={INITIAL_SHELTERS}
                  userLocation={locationState.coordinates}
                  onNavigateToShelter={(shelter) => {
                    const r = {
                      id: `route-${shelter.id}`,
                      startPoint: locationState.coordinates,
                      destinationShelterId: shelter.id,
                      destinationName: shelter.name,
                      totalDistanceKm: 12.4,
                      estimatedTravelTimeMinutes: 22,
                      safetyScore: 97,
                      waypoints: [locationState.coordinates, shelter.coordinates],
                      steps: [
                        {
                          instruction: `Direct evacuation to ${shelter.name}`,
                          distanceKm: 12.4,
                          estimatedMinutes: 22,
                          isSafe: true,
                        },
                      ],
                      isActiveRecommendation: true,
                    };
                    setActiveRoute(r);
                    setActivePage('live-map');
                  }}
                />
              )}

              {activePage === 'analytics' && (
                <AnalyticsPage
                  dams={damState.dams}
                  selectedDam={damState.selectedDam}
                  onSelectDam={(d) => damState.setSelectedDamId(d.id)}
                />
              )}
            </div>
          </main>
        </div>

        {/* 5. Live Connected AI Disaster Chatbot */}
        <AIChatbot
          userLocation={locationState.coordinates}
          onNavigateToMapWithRoute={handleChatbotNavigateToMap}
        />
      </div>
    </LanguageContext.Provider>
  );
}
