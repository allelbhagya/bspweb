// IndexPage.js
import React, { useEffect, useState } from 'react';
import Log from './Log';
import { useNavigate } from 'react-router-dom';

export default function IndexPage() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('http://localhost:4000/log')
      .then(response => response.json())
      .then(logs => {
        setLogs(logs);
      })
      .catch(error => {
        console.error('Error fetching logs:', error);
      });
  }, []);

const handleDelete = async (logId) => {
  const confirmed = window.confirm('Are you sure you want to delete this log?');

  if (confirmed) {
    try {
      const response = await fetch(`http://localhost:4000/log/${logId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setLogs(prevLogs => prevLogs.filter(log => log._id !== logId));
      } else {
        console.error('Error deleting log:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting log:', error);
    }
  }
};

const handleEdit = (logId) => {
  // Redirect to the edit page with the logId
  navigate(`/edit/${logId}`);
};

  const filteredLogs = logs.filter(log =>
    Object.values(log || {}).some(value =>
      value ? value.toString().toLowerCase().includes(searchTerm.toLowerCase()) : false
    )
  );

  return (
    <div className="log">
      <div>
        <div className="search-box">
          <h1>Search for a log</h1>
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Report time</th>
            <th>Cobble time</th>
            <th>Duration</th>
            <th className="region-head">Region</th>
            <th>Sensor ID</th>
            <th>Profile</th>
            <th>Stoppage</th>
            <th>Measure</th>
            <th>Comment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredLogs.length > 0 ? (
            filteredLogs.map(log => (
              <Log
                key={log?._id}
                {...log}
                onDelete={() => handleDelete(log._id)} 
                onEdit={handleEdit}

              />
            ))
          ) : (
            <tr>
              <td colSpan="8">No matching logs found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
