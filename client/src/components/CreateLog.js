import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import Select from "react-select"; // Import react-select

export default function CreateLog() {
  const [times, setTimes] = useState('');
  const [duration, setDuration] = useState('');
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedSensors, setSelectedSensors] = useState([]);
  const [sensorID, setSensorID] = useState('');
  const [selectedStoppages, setSelectedStoppages] = useState([]);
  const [prof, setProf] = useState('');
  const [mea, setMea] = useState('');
  const [comms, setComms] = useState('');
  const [sensorOptions, setSensorOptions] = useState([]);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const fetchSensorOptions = async () => {
      try {
        const response = await fetch('/sensor.csv');
        const csvData = await response.text();
  
        console.log('CSV Data:', csvData); // Log CSV data to the console
  
        const lines = csvData.split('\n');
        const options = lines.slice(1).map(line => {
          const [sensorID, tagName] = line.split(',');
  
          // Log sensorID and tagName to identify any issues
          console.log('Raw sensorID:', sensorID);
          console.log('Raw tagName:', tagName);
  
          // Trim and handle cases where sensorID or tagName might be undefined
          const trimmedSensorID = sensorID ? sensorID.trim() : '';
          const trimmedTagName = tagName ? tagName.trim() : '';
  
          // Log trimmed values
          console.log('Trimmed sensorID:', trimmedSensorID);
          console.log('Trimmed tagName:', trimmedTagName);
  
          return `${trimmedSensorID}: ${trimmedTagName}`;
        });
  
        setSensorOptions(options);
      } catch (error) {
        console.error('Error fetching or parsing CSV file:', error);
      }
    };
  
    fetchSensorOptions();
  }, []); // Empty dependency array to run the effect only once on component mount
  

  const regionOptions = [
    "CVR_L1", "CVR_L2", "CVAH_L1", "CVAH_L2", "Pinch_Roll_L1",
    "Pinch_Roll_L2", "HMD", "SH1", "SH2", "SH3", "Stand_01-06",
    "Stand_07-12", "Stand_13-18", "FURNANCE_EXIT"
  ];

  const stoppageOptions = [
    "Cobble", "Overshoot L1", "Overshoot L2", "Planned Job", "Mill Check",
    "Equipment Breakdown", "Cooling bed fill", "Furnace discharge delay",
    "Auto / manual chopping", "Dog house long tail check L1", "Dog house long tail check L2"
  ];

  const handleRegionChange = (selectedRegion) => {
    const updatedRegions = selectedRegions.includes(selectedRegion)
      ? selectedRegions.filter(region => region !== selectedRegion)
      : [...selectedRegions, selectedRegion];
    setSelectedRegions(updatedRegions);
  };

  const handleStoppageChange = (selectedStoppage) => {
    const updatedStoppages = selectedStoppages.includes(selectedStoppage)
      ? selectedStoppages.filter(stoppage => stoppage !== selectedStoppage)
      : [...selectedStoppages, selectedStoppage];
    setSelectedStoppages(updatedStoppages);
  };

  async function createNewLog(ev) {
    const data = new FormData();
    data.set('time', times);
    data.set('duration', duration);
    data.set('region', JSON.stringify(selectedRegions));
    data.set('sensorID', JSON.stringify(selectedSensors.map(sensor => sensor.value)));
    data.set('stoppage', JSON.stringify(selectedStoppages));
    data.set('profile', prof);
    data.set('comment', comms);
    data.set('measure', mea);
    ev.preventDefault();
    const response = await fetch('http://localhost:4000/log', {
      method: 'POST',
      body: data,
    });

    if (response.ok) {
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={'/'} />;
  }

  return (
    <form className="logform" onSubmit={createNewLog}>
      <h1>Report a cobble</h1>
      <label>Report time</label>
      <input
        type="datetime-local"
        value={times}
        onChange={(ev) => setTimes(ev.target.value)}
      />
      <label>
        Duration (in minutes)
      </label>
      <input
        type="number"
        value={duration}
        onChange={ev => setDuration(ev.target.value)}
      />
      <label>Affected Region</label>
      <div className="region-options">
        {regionOptions.map((region) => (
          <div key={region} className="region-option">
            <input
              type="checkbox"
              id={region}
              value={region}
              checked={selectedRegions.includes(region)}
              onChange={() => handleRegionChange(region)}
            />
            <label htmlFor={region}>{region}</label>
          </div>
        ))}
      </div>
      <label>Stoppage</label>
      <div className="stoppage-options">
  {stoppageOptions.map((stoppage) => (
    <div key={stoppage} className="stoppage-option">
      <input
        type="checkbox"
        id={stoppage}
        value={stoppage}
        checked={selectedStoppages.includes(stoppage)}
        onChange={() => handleStoppageChange(stoppage)}
      />
      <label htmlFor={stoppage}>{stoppage}</label>
    </div>
  ))}
</div>
<label>
        SensorID and Tag name
      </label>
      <Select
        isMulti // Enable multi-select
        value={selectedSensors}
        options={sensorOptions.map(option => ({ value: option, label: option }))}
        onChange={selectedOptions => setSelectedSensors(selectedOptions)}
        placeholder="Select Sensor ID"
      />
      <label>
        Profile
      </label>
      <input
        type="text"
        placeholder="profile"
        value={prof}
        onChange={ev => setProf(ev.target.value)}
      />
      <label>
        Correctness Measure
      </label>
      <textarea
        name=""
        id=""
        rows="3"
        value={mea}
        onChange={ev => setMea(ev.target.value)}
      ></textarea>
      <label>
        Comments
      </label>
      <input
        type="text"
        placeholder="comment"
        value={comms}
        onChange={ev => setComms(ev.target.value)}
      />
      <button>Submit log</button>
    </form>
  )
}
