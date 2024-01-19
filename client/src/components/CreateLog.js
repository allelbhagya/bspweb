import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import Select from "react-select"; 

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
  const [createdAtTimestamp, setCreatedAtTimestamp] = useState('');
  const [initialCobbleTime, setInitialCobbleTime] = useState('');

  const handleEndTimeChange = (ev) => {
    const endTime = new Date(ev.target.value);
    const currentTime = new Date();
    const timeDifferenceInMinutes = Math.floor((endTime - currentTime) / (1000 * 60));

    setDuration(timeDifferenceInMinutes >= 0 ? timeDifferenceInMinutes : '');
    setTimes(ev.target.value);
  };

  useEffect(() => {
    const fetchSensorOptions = async () => {
      try {
        const response = await fetch('/sensor.csv');
        const csvData = await response.text();
  
        const lines = csvData.split('\n');
        const options = lines.slice(1).map(line => {
          const [sensorID, tagName] = line.split(',');
          const trimmedSensorID = sensorID ? sensorID.trim() : '';
          const trimmedTagName = tagName ? tagName.trim() : '';
  
          return { value: trimmedSensorID, label: trimmedTagName };
        });
  
        setSensorOptions(options);
        const currentTimeStamp = new Date();
        setCreatedAtTimestamp(currentTimeStamp.toISOString());
        setInitialCobbleTime(currentTimeStamp.toISOString());
      } catch (error) {
        console.error('Error fetching or parsing CSV file:', error);
      }
    };
  
    fetchSensorOptions();
  }, []);
  
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

  const profileOptions = ["2x10MM", "2x8MM", "2x16MM", "2x12MM", "2x20MM"]

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

  const handleProfileChange = (selectedProfile) => {
    setProf(selectedProfile.value);
  };

  async function createNewLog(ev) {
    const data = new FormData();
    data.set('createdAt', initialCobbleTime); // Set createdAt to initialCobbleTime
    data.set('time', times);
    data.set('duration', duration);
    data.set('region', JSON.stringify(selectedRegions));
    data.set('sensorID', JSON.stringify(selectedSensors.map(sensor => sensor.value)));
    data.set('stoppage', JSON.stringify(selectedStoppages));
    data.set('profile', prof);
    data.set('comment', comms);
    data.set('measure', mea);
    ev.preventDefault();
    
    try {
      const response = await fetch('https://bspweb-api.vercel.app/log', {
        method: 'POST',
        body: data,
        credentials: 'include',
      });
  
      if (response.ok) {
        setRedirect(true);
      } else {
        console.error('Error creating log:', response.status);
      }
    } catch (error) {
      console.error('Error creating log:', error);
    }
  }

  if (redirect) {
    return <Navigate to={'/'} />;
  }

  const formatTimestamp = (timestamp) => {
    try {
      const date = new Date(timestamp);
      if (!isNaN(date.getTime())) {
        return date.toLocaleString();
      } else {
        return "Invalid timestamp";
      }
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return "Invalid timestamp";
    }
  };

  return (
    <>
      <div>
        <h1>Report cobble</h1>
      </div>
      <form className="logform" onSubmit={createNewLog}>
        <div>
          <label>Cobble Report time</label>
          {formatTimestamp(initialCobbleTime)}
        </div>

        <label>End time</label>
        <input
          type="datetime-local"
          value={times}
          onChange={handleEndTimeChange} 
        />
        <label>Duration (in minutes)</label>
        <input
          type="number"
          value={duration}
          onChange={(ev) => setDuration(ev.target.value)}
        />

        <div className="table-options">
          <div className="table-option">
            <div className="options-table">
              <div className="options-table-column">
                <label>Affected Region</label>
                <table className="region-table">
                  <tbody>
                    {regionOptions.map((region, index) => (
                      index % 4 === 0 && (
                        <tr key={index}>
                          {regionOptions.slice(index, index + 4).map((option) => (
                            <td key={option} className="region-option">
                              <input
                                type="checkbox"
                                id={option}
                                value={option}
                                checked={selectedRegions.includes(option)}
                                onChange={() => handleRegionChange(option)}
                              />
                              <label htmlFor={option}>{option}</label>
                            </td>
                          ))}
                        </tr>
                      )
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="options-table">
              <div className="options-table-column">
                <label>Stoppage</label>
                <table className="stoppage-table">
                  <tbody>
                    {stoppageOptions.map((stoppage, index) => (
                      index % 4 === 0 && (
                        <tr key={index}>
                          {stoppageOptions.slice(index, index + 4).map((option) => (
                            <td key={option} className="stoppage-option">
                              <input
                                type="checkbox"
                                id={option}
                                value={option}
                                checked={selectedStoppages.includes(option)}
                                onChange={() => handleStoppageChange(option)}
                              />
                              <label htmlFor={option}>{option}</label>
                            </td>
                          ))}
                        </tr>
                      )
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <label>
          SensorID and Tag name
        </label>
        <Select
          isMulti // enable multi-select
          value={selectedSensors}
          options={sensorOptions.map(option => ({ value: option, label: option }))}
          onChange={selectedOptions => setSelectedSensors(selectedOptions)}
          placeholder="Select Sensor ID"
        />
        <label>
          Profile
        </label>
        <Select
          value={{ value: prof, label: prof }}
          options={profileOptions.map((profileOption) => ({
            value: profileOption,
            label: profileOption,
          }))}
          onChange={handleProfileChange}
          placeholder="Select Profile"
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
    </>
  )
}
