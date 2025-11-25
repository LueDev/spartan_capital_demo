import { useState, useEffect } from 'react';
import { PortfolioMetrics, PerformanceResponse, SystemMetrics } from './types';
import PortfolioDashboard from './components/PortfolioDashboard';
import SystemMetricsPanel from './components/SystemMetricsPanel';
import DevOpsPanel from './components/DevOpsPanel';
import Header from './components/Header';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

function App() {
  const [portfolioMetrics, setPortfolioMetrics] = useState<PortfolioMetrics | null>(null);
  const [performanceData, setPerformanceData] = useState<PerformanceResponse | null>(null);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [metricsRes, performanceRes, systemRes] = await Promise.all([
        fetch(`${API_URL}/api/portfolio/metrics`),
        fetch(`${API_URL}/api/portfolio/performance?days=30`),
        fetch(`${API_URL}/api/system/metrics`)
      ]);

      if (!metricsRes.ok || !performanceRes.ok || !systemRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const [metrics, performance, system] = await Promise.all([
        metricsRes.json(),
        performanceRes.json(),
        systemRes.json()
      ]);

      setPortfolioMetrics(metrics);
      setPerformanceData(performance);
      setSystemMetrics(system);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="app">
        <Header />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <Header />
        <div className="error-container">
          <h2>Error loading data</h2>
          <p>{error}</p>
          <button onClick={fetchData} className="retry-button">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        {portfolioMetrics && performanceData && (
          <PortfolioDashboard 
            metrics={portfolioMetrics} 
            performance={performanceData}
          />
        )}
        {systemMetrics && (
          <SystemMetricsPanel metrics={systemMetrics} />
        )}
        <DevOpsPanel />
      </main>
      <footer className="footer">
        <p>
          <strong>Spartan Capital</strong> — Production-Grade Full-Stack on GCP
        </p>
        <p>
          Deployed by <strong>Luis Jorge</strong> • Full-Stack AI/ML + DevOps Engineer
        </p>
        <p className="footer-note">
          Cloud Run • Cloud SQL • Load Balancer • Cloud Armor • Terraform • Zero Trust
        </p>
      </footer>
    </div>
  );
}

export default App;
