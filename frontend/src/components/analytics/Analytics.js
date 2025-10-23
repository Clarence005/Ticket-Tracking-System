import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import './Analytics.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/tickets/stats/analytics', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/tickets/export/report/pdf', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        responseType: 'blob'
      });
      
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `tickets-report-${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting report:', error);
      alert('Failed to export report');
    }
  };

  if (loading) {
    return (
      <div className="analytics-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-container">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={fetchAnalytics} className="btn btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Chart configurations
  const statusChartData = {
    labels: Object.keys(analytics.statusStats),
    datasets: [
      {
        label: 'Number of Tickets',
        data: Object.values(analytics.statusStats),
        backgroundColor: [
          '#ffc107', // Pending
          '#007bff', // In Progress
          '#28a745', // Resolved
          '#6c757d', // Closed
        ],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const priorityChartData = {
    labels: Object.keys(analytics.priorityStats),
    datasets: [
      {
        label: 'Number of Tickets',
        data: Object.values(analytics.priorityStats),
        backgroundColor: [
          '#17a2b8', // Low
          '#ffc107', // Medium
          '#fd7e14', // High
          '#dc3545', // Critical
        ],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const categoryChartData = {
    labels: Object.keys(analytics.categoryStats),
    datasets: [
      {
        label: 'Number of Tickets',
        data: Object.values(analytics.categoryStats),
        backgroundColor: [
          '#007bff',
          '#28a745',
          '#ffc107',
          '#dc3545',
          '#6f42c1',
          '#fd7e14',
        ],
        borderWidth: 1,
      },
    ],
  };

  const monthlyChartData = {
    labels: Object.keys(analytics.monthlyStats),
    datasets: [
      {
        label: 'Tickets Created',
        data: Object.values(analytics.monthlyStats),
        backgroundColor: 'rgba(102, 126, 234, 0.8)',
        borderColor: 'rgba(102, 126, 234, 1)',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
    },
  };

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h1>📊 Analytics Dashboard</h1>
        <button onClick={handleExportReport} className="btn btn-primary">
          📄 Export Report
        </button>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-icon">🎫</div>
          <div className="card-content">
            <h3>{analytics.total}</h3>
            <p>Total Tickets</p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="card-icon">✅</div>
          <div className="card-content">
            <h3>{analytics.resolvedCount}</h3>
            <p>Resolved Tickets</p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="card-icon">⏱️</div>
          <div className="card-content">
            <h3>{analytics.avgResolutionTime}</h3>
            <p>Avg Resolution (Days)</p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="card-icon">📈</div>
          <div className="card-content">
            <h3>{analytics.total > 0 ? Math.round((analytics.resolvedCount / analytics.total) * 100) : 0}%</h3>
            <p>Resolution Rate</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Tickets by Status</h3>
          <div className="chart-container">
            <Pie data={statusChartData} options={pieChartOptions} />
          </div>
        </div>

        <div className="chart-card">
          <h3>Tickets by Priority</h3>
          <div className="chart-container">
            <Pie data={priorityChartData} options={pieChartOptions} />
          </div>
        </div>

        <div className="chart-card full-width">
          <h3>Tickets by Category</h3>
          <div className="chart-container">
            <Bar data={categoryChartData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-card full-width">
          <h3>Monthly Ticket Trend</h3>
          <div className="chart-container">
            <Bar data={monthlyChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Detailed Statistics */}
      <div className="detailed-stats">
        <div className="stats-section">
          <h3>Status Breakdown</h3>
          <div className="stats-list">
            {Object.entries(analytics.statusStats).map(([status, count]) => (
              <div key={status} className="stat-item">
                <span className="stat-label">{status}</span>
                <span className="stat-value">{count}</span>
                <div className="stat-bar">
                  <div 
                    className="stat-fill" 
                    style={{ 
                      width: `${(count / analytics.total) * 100}%`,
                      backgroundColor: statusChartData.datasets[0].backgroundColor[Object.keys(analytics.statusStats).indexOf(status)]
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="stats-section">
          <h3>Priority Breakdown</h3>
          <div className="stats-list">
            {Object.entries(analytics.priorityStats).map(([priority, count]) => (
              <div key={priority} className="stat-item">
                <span className="stat-label">{priority}</span>
                <span className="stat-value">{count}</span>
                <div className="stat-bar">
                  <div 
                    className="stat-fill" 
                    style={{ 
                      width: `${(count / analytics.total) * 100}%`,
                      backgroundColor: priorityChartData.datasets[0].backgroundColor[Object.keys(analytics.priorityStats).indexOf(priority)]
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="stats-section">
          <h3>Category Breakdown</h3>
          <div className="stats-list">
            {Object.entries(analytics.categoryStats).map(([category, count]) => (
              <div key={category} className="stat-item">
                <span className="stat-label">{category}</span>
                <span className="stat-value">{count}</span>
                <div className="stat-bar">
                  <div 
                    className="stat-fill" 
                    style={{ 
                      width: `${(count / analytics.total) * 100}%`,
                      backgroundColor: categoryChartData.datasets[0].backgroundColor[Object.keys(analytics.categoryStats).indexOf(category) % categoryChartData.datasets[0].backgroundColor.length]
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;