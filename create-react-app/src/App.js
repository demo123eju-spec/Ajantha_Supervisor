import React, { useState, useMemo } from 'react';
import './App.css';
import excavatorIcon from './Excavator Image Ajantha1.png';
import TipperIcon from './Tipper Image Ajantha.jpg';

function App() {
  const [stats, setStats] = useState({
    drivers: 0,
    vehicles: 0,
    excavators: 0,
    activeTrips: 0,
    revenue: 0
  });

  const [trips, setTrips] = useState([]);
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'completed' | 'excavators'
  const [activeShift, setActiveShift] = useState('All'); // 'All' | 'Shift 1' | 'Shift 2' | 'Shift 3'

  // Direct Catalyst API Fetch
  React.useEffect(() => {
    // Project ID: 24341000000095323
    // Table (Datastore) ID: 24341000000102109
    
    // Using relative path via proxy
    const API_URL = `/baas/v1/project/24341000000095323/table/24341000000102109/row`;

    const MOCK_TRIPS = [
        { id: 'm1', driver: 'Kumar', vehicle: 'EX-01 (Hitachi)', vehicleType: 'Excavator', startKm: 1000, endKm: 1200, totalTrips: 10, status: 'Active', shift: 'Shift 1' },
        { id: 'm2', driver: 'Raja', vehicle: 'TN-02 8888', vehicleType: 'Truck', startKm: 5000, endKm: 5050, totalTrips: 5, status: 'Completed', shift: 'Shift 2' },
        { id: 'm3', driver: 'Mani', vehicle: 'TN-03 7777', vehicleType: 'Truck', startKm: 3000, endKm: 3200, totalTrips: 8, status: 'Active', shift: 'Shift 3' },
        { id: 'm4', driver: 'Senthil', vehicle: 'TN-04 6666', vehicleType: 'Truck', startKm: 4000, endKm: 4100, totalTrips: 6, status: 'Completed', shift: 'Shift 1' },
        { id: 'm5', driver: 'Ravi', vehicle: 'EX-02 (JCB)', vehicleType: 'Excavator', startKm: 2000, endKm: 2050, totalTrips: 3, status: 'Active', shift: 'Shift 2' },
        { id: 'm6', driver: 'Arun', vehicle: 'TN-06 4444', vehicleType: 'Truck', startKm: 6000, endKm: 6050, totalTrips: 4, status: 'Active', shift: 'Shift 1' },
        { id: 'm7', driver: 'Suresh', vehicle: 'TN-07 3333', vehicleType: 'Truck', startKm: 7000, endKm: 7100, totalTrips: 12, status: 'Active', shift: 'Shift 1' },
        { id: 'm8', driver: 'Moorthy', vehicle: 'TN-08 2222', vehicleType: 'Truck', startKm: 8000, endKm: 8020, totalTrips: 2, status: 'Active', shift: 'Shift 2' },
        { id: 'm9', driver: 'John', vehicle: 'EX-03 (CAT)', vehicleType: 'Excavator', startKm: 1500, endKm: 1550, totalTrips: 7, status: 'Active', shift: 'Shift 3' },
        { id: 'm10', driver: 'Peter', vehicle: 'TN-09 1111', vehicleType: 'Truck', startKm: 9000, endKm: 9050, totalTrips: 5, status: 'Completed', shift: 'Shift 3' },
        { id: 'm11', driver: 'Karthik', vehicle: 'TN-10 0000', vehicleType: 'Truck', startKm: 10000, endKm: 10100, totalTrips: 9, status: 'Active', shift: 'Shift 1' },
        { id: 'm12', driver: 'Bala', vehicle: 'TN-11 1212', vehicleType: 'Truck', startKm: 11000, endKm: 11050, totalTrips: 4, status: 'Completed', shift: 'Shift 3' },
        { id: 'm13', driver: 'Ganesh', vehicle: 'TN-12 3434', vehicleType: 'Truck', startKm: 12000, endKm: 12200, totalTrips: 15, status: 'Active', shift: 'Shift 2' },
        { id: 'm14', driver: 'Murugan', vehicle: 'TN-13 5656', vehicleType: 'Truck', startKm: 13000, endKm: 13010, totalTrips: 1, status: 'Active', shift: 'Shift 1' },
        { id: 'm15', driver: 'Vikram', vehicle: 'EX-04 (Volvo)', vehicleType: 'Excavator', startKm: 500, endKm: 600, totalTrips: 20, status: 'Completed', shift: 'Shift 1' },
    ];

    const fetchStats = async () => {
      try {
        console.log("Fetching from:", API_URL);
        const response = await fetch(API_URL, {
          method: 'GET',
          headers: {
            'Authorization': 'Zoho-oauthtoken 1000.f7d06767dd3678299865a2dd36646997.574c0139f1b3af35e1128dde3c819282',
            'Accept':'application/json',
            'Environment':'Development'
          }
        });

        if (response.ok) {
          const result = await response.json();
          console.log("Catalyst Data:", result);
          
          if (result.data && result.data.length > 0) {
             const rows = result.data;
             const mappedTrips = rows.map((row, index) => ({
                 id: row.ROWID || index,
                 driver: row.Driver_Name || row.Driver || `Driver ${index + 1}`,
                 vehicle: row.Vehicle_Number || row.Vehicle || `TN-0${index} ${1234 + index}`,
                 vehicleType: (row.Vehicle_Type) ? row.Vehicle_Type : (index % 3 === 0 ? 'Excavator' : 'Truck'), 
                 startKm: row.Start_Km || 1000 + (index * 100),
                 endKm: row.End_Km || 1000 + (index * 100) + 50,
                 totalTrips: 5 + index,
                 status: 'Active', // Default to active for live data if status missing
                 shift: row.Shift || `Shift ${ (index % 3) + 1 }`
             }));
             setTrips(mappedTrips);
          } else {
             // API OK but no data -> Use Mock
             console.log("API returned no data, using mock.");
             setTrips(MOCK_TRIPS);
          }
        } else {
           console.error("Fetch failed:", response.status, response.statusText);
           // API Failed -> Use Mock
           setTrips(MOCK_TRIPS);
        }
      } catch (error) {
         console.error("Error fetching data:", error);
         // Network Error -> Use Mock
         setTrips(MOCK_TRIPS);
      }
    };

    fetchStats();
  }, []);

  // 1. First, filter all data by the active SHIFT
  const tripsInShift = useMemo(() => {
    if (activeShift === 'All') return trips;
    return trips.filter(t => t.shift === activeShift);
  }, [trips, activeShift]);

  // 2. Calculate dynamic stats based on the Shift-filtered data
  const dynamicStats = useMemo(() => {
    return {
      drivers: new Set(tripsInShift.map(t => t.driver)).size || 0,
      vehicles: new Set(tripsInShift.map(t => t.vehicle)).size || 0,
      excavators: tripsInShift.filter(t => t.vehicleType === 'Excavator').length || 0,
      activeTrips: tripsInShift.filter(t => t.status === 'Active').length || 0,
    };
  }, [tripsInShift]);

  // 3. Filter for the TABLE view based on the active TAB (applied on top of shift filter)
  const filteredTrips = useMemo(() => {
      let data = tripsInShift;

      if (activeTab === 'excavators') {
          data = data.filter(t => t.vehicleType === 'Excavator');
      } else if (activeTab === 'active') {
          data = data.filter(t => t.status === 'Active');
      } else {
          data = data.filter(t => t.status === 'Completed');
      }
      return data.slice(0, 4); 
  }, [tripsInShift, activeTab]);

  // 4. Group data for FLEET MAP view
  const fleetMapData = useMemo(() => {
      const excavators = tripsInShift.filter(t => t.vehicleType === 'Excavator');
      const trucks = tripsInShift.filter(t => t.vehicleType === 'Truck');

      // Map each excavator to its assigned trucks (simulated logic)
      return excavators.map((exc, index) => {
          // simple distribution logic for demo: assign trucks based on index modulo
          const assignedTrucks = trucks.filter((_, i) => i % excavators.length === index);
          return {
              excavator: exc,
              trucks: assignedTrucks
          };
      });
  }, [tripsInShift]);

  return (
    <div className="App">
      <header className="dashboard-header">
        <h1>Supervisor Dashboard</h1>
      </header>
      
      <main className="dashboard-main">
        {/* Shift Filter Section */}
        <div className="shift-filter-container" style={{justifyContent: 'center', marginBottom: '30px'}}>
            <span className="shift-label">Filter by Shift:</span>
            {['All', 'Shift 1', 'Shift 2', 'Shift 3'].map(shift => (
                <button
                    key={shift}
                    className={`shift-btn ${activeShift === shift ? 'active' : ''}`}
                    onClick={() => setActiveShift(shift)}
                >
                    {shift}
                </button>
            ))}
        </div>

        {/* Top Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-title">Total Drivers</div>
            <div className="stat-value">{dynamicStats.drivers}</div>
            <div className="stat-icon">🦺</div>
          </div>

          <div className="stat-card">
            <div className="stat-title">Total Vehicles</div>
            <div className="stat-value">{dynamicStats.vehicles}</div>
            <div className="stat-icon">
              <img src={TipperIcon} alt="Tipper" style={{width:'40px', height:'40px', objectFit:'contain'}} />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-title">Total Excavators</div>
            <div className="stat-value">{dynamicStats.excavators}</div>
            <div className="stat-icon">
                <img src={excavatorIcon} alt="Excavator" style={{width:'60px', height:'60px', objectFit:'contain'}} />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-title">Active Trips</div>
            <div className="stat-value">{dynamicStats.activeTrips}</div>
            <div className="stat-icon">📍</div>
          </div>
        </div>

        {/* Tabs & Table Section */}
        <div className="tabs-container">
            <div className="tabs">
                <button 
                    className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`}
                    onClick={() => setActiveTab('active')}
                >
                    Active Trips
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
                    onClick={() => setActiveTab('completed')}
                >
                    Completed Trips
                </button>
                 <button 
                    className={`tab-btn ${activeTab === 'excavators' ? 'active' : ''}`}
                    onClick={() => setActiveTab('excavators')}
                >
                    Excavators View
                </button>
            </div>

            <div className="data-table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Driver</th>
                            <th>Vehicle</th>
                            <th>Shift</th>
                            <th>Start KM</th>
                            <th>End KM</th>
                            <th>Total Trips</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTrips.length > 0 ? (
                            filteredTrips.map((trip) => (
                                <tr key={trip.id}>
                                    <td>{trip.driver}</td>
                                    <td>{trip.vehicle} <span style={{fontSize:'0.8em', color:'#888'}}>({trip.vehicleType})</span></td>
                                    <td>
                                        <span style={{padding:'3px 8px', borderRadius:'10px', backgroundColor:'#f0f0f0', fontSize:'0.85em'}}>
                                            {trip.shift}
                                        </span>
                                    </td>
                                    <td>{trip.startKm}</td>
                                    <td>{trip.endKm}</td>
                                     <td>{trip.totalTrips}</td>
                                    <td>
                                        <span className={`status-badge status-${trip.status.toLowerCase()}`}>
                                            {trip.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            trips.length === 0 ? null : (
                                <tr>
                                    <td colSpan="7" style={{textAlign:'center', padding:'30px'}}>
                                        No records found.
                                    </td>
                                </tr>
                            )
                        )}
                        
                        {/* FALLBACK DEMO ROWS (visible only if trips is empty for demo purposes) */}
                         {trips.length === 0 && [
                             { id: 'm1', driver: 'Kumar', vehicle: 'TN-01 9999', vehicleType: 'Excavator', start: 1000, end: 1200, trips: 10, status: 'Active', shift: 'Shift 1' },
                             { id: 'm2', driver: 'Raja', vehicle: 'TN-02 8888', vehicleType: 'Truck', start: 5000, end: 5050, trips: 5, status: 'Completed', shift: 'Shift 2' },
                             { id: 'm3', driver: 'Mani', vehicle: 'TN-03 7777', vehicleType: 'Truck', start: 3000, end: 3200, trips: 8, status: 'Active', shift: 'Shift 3' },
                             { id: 'm4', driver: 'Senthil', vehicle: 'TN-04 6666', vehicleType: 'Truck', start: 4000, end: 4100, trips: 6, status: 'Completed', shift: 'Shift 1' },
                             { id: 'm5', driver: 'Ravi', vehicle: 'TN-05 5555', vehicleType: 'Excavator', start: 2000, end: 2050, trips: 3, status: 'Active', shift: 'Shift 2' },
                             { id: 'm6', driver: 'Arun', vehicle: 'TN-06 4444', vehicleType: 'Truck', start: 6000, end: 6050, trips: 4, status: 'Active', shift: 'Shift 1' }, 
                         ].filter(t => 
                            ((activeTab === 'active' && t.status === 'Active') ||
                            (activeTab === 'completed' && t.status === 'Completed') ||
                            (activeTab === 'excavators' && t.vehicleType === 'Excavator')) && 
                            (activeShift === 'All' || t.shift === activeShift)
                         ).map((t, i) => (
                             <tr key={`mock-${i}`}>
                                 <td>{t.driver}</td>
                                 <td>{t.vehicle}</td>
                                 <td><span style={{padding:'3px 8px', borderRadius:'10px', backgroundColor:'#f0f0f0', fontSize:'0.85em'}}>{t.shift}</span></td>
                                 <td>{t.start}</td>
                                 <td>{t.end}</td>
                                 <td>{t.trips}</td>
                                 <td><span className={`status-badge status-${t.status.toLowerCase()}`}>{t.status}</span></td>
                             </tr>
                         ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Fleet Map Section (Separate) */}
        <div className="fleet-map-section" style={{marginTop:'50px'}}>
             <h2 style={{color:'#444', marginBottom:'20px', borderBottom:'2px solid #ddd', paddingBottom:'10px'}}>Excavator Tipper Mapping</h2>
             <p style={{color:'#666', marginBottom:'20px'}}>Visualization of Excavators and assigned Tippers.</p>
             
             <div className="fleet-map-container">
                    {fleetMapData.length > 0 ? (
                        fleetMapData.map((group, idx) => (
                            <div key={group.excavator.id} className="fleet-group">
                                {/* Excavator Node */}
                                <div className="excavator-node">
                                    <div className="node-icon">
                                         <img src={excavatorIcon} alt="Excavator" />
                                    </div>
                                    <div className="node-info">
                                        <div className="node-title">{group.excavator.vehicle}</div>
                                        <div className="node-sub">{group.excavator.driver}</div>
                                    </div>
                                </div>

                                {/* Flow Line */}
                                <div className="flow-line-vertical"></div>

                                {/* Tippers Container */}
                                <div className="tippers-row">
                                    {group.trucks.map(truck => (
                                        <div key={truck.id} className="tipper-node">
                                            <div className="node-icon-small">
                                                <img src={TipperIcon} alt="Tipper" />
                                            </div>
                                            <div className="node-info-small">
                                                <div className="node-title-small">{truck.vehicle}</div>
                                                <div className="node-sub-small">{truck.driver}</div>
                                                <div className={`status-dot ${truck.status.toLowerCase()}`}></div>
                                            </div>
                                        </div>
                                    ))}
                                    {group.trucks.length === 0 && (
                                        <div className="no-trucks-node">No Tippers Assigned</div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{padding:'40px', textAlign:'center', color:'#888'}}>
                            No Excavators found in this Shift to map.
                            {(trips.length === 0 && activeShift === 'All') && (
                                <div style={{fontSize:'0.9em', marginTop:'10px'}}>
                                    (If no data appears, check API or Fallback logic)
                                </div>
                            )}
                        </div>
                    )}
            </div>
        </div>
      </main>
    </div>
  );
}

export default App;
