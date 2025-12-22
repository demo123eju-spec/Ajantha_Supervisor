import React, { useState } from 'react';
import './App.css';

function App() {
  // Reverted to static initial state as per user request to remove API logic
  const [stats] = useState({
    drivers: 24,
    vehicles: 18,
    activeTrips: 12,
    revenue: 15400
  });
  // API fetch logic moved inside useEffect
  React.useEffect(() => {
    fetch('/server/getEmployees') 
      .then(res => res.json())
      .then(data => {
        console.log("Fetched Data:", data.data);
      })
      .catch(err => console.error("Fetch Error:", err));
  }, []);


  return (
    <div className="App">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
      </header>
      
      <main className="dashboard-main">
        <div className="stats-grid">
          {/* Drivers Card */}
          <div className="stat-card">
            <div className="stat-title">Total Drivers</div>
            <div className="stat-value">{stats.drivers}</div>
            <div className="stat-icon">👨‍✈️</div>
          </div>

          {/* Vehicles Card */}
          <div className="stat-card">
            <div className="stat-title">Total Vehicles</div>
            <div className="stat-value">{stats.vehicles}</div>
            <div className="stat-icon">🚛</div>
          </div>

          {/* Active Trips Card */}
          <div className="stat-card">
            <div className="stat-title">Active Trips</div>
            <div className="stat-value">{stats.activeTrips}</div>
            <div className="stat-icon">📍</div>
          </div>

           {/* Revenue Card */}
           <div className="stat-card">
            <div className="stat-title">Total Revenue</div>
            <div className="stat-value">${stats.revenue.toLocaleString()}</div>
            <div className="stat-icon">💰</div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
