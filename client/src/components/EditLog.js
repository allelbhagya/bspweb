// EditLog.js
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditLog() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [times, setTimes] = useState("");
  const [duration, setDuration] = useState("");
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [sensorID, setSensorID] = useState("");
  const [selectedStoppages, setSelectedStoppages] = useState([]);
  const [prof, setProf] = useState("");
  const [mea, setMea] = useState("");
  const [comms, setComms] = useState("");
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const fetchLogData = async () => {
      try {
        const response = await fetch(`http://localhost:4000/log/${id}`);
        if (response.ok) {
          const logData = await response.json();
          setTimes(new Date(logData.time).toISOString().slice(0, 16));
          setDuration(logData.duration);
          setSelectedRegions(logData.region);
          setSensorID(logData.sensorID);
          setSelectedStoppages(logData.stoppage);
          setProf(logData.profile);
          setMea(logData.measure);
          setComms(logData.comment);
        } else {
          console.error('Error fetching log data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching log data:', error);
      }
    };

    fetchLogData();
  }, [id]);

  const updateLog = async (ev) => {
    ev.preventDefault();

    try {
      const response = await fetch(`http://localhost:4000/log/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          time: times,
          duration: duration,
          region: Array.isArray(selectedRegions) ? selectedRegions.join(', ') : selectedRegions, // Updated region field
          sensorID: sensorID,
          stoppage: Array.isArray(selectedStoppages) ? selectedStoppages.join(', ') : selectedStoppages, // Updated stoppage field
          profile: prof,
          measure: mea,
          comment: comms,
        }),
      });

      if (response.ok) {
        setRedirect(true);
      } else {
        console.error('Error updating log:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating log:', error);
    }
  };
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
        const updatedRegions = Array.isArray(selectedRegions)
          ? (selectedRegions.includes(selectedRegion)
            ? selectedRegions.filter(region => region !== selectedRegion)
            : [...selectedRegions, selectedRegion])
          : [selectedRegion];
      
        setSelectedRegions(updatedRegions);
      };
      
    
      const handleStoppageChange = (selectedStoppage) => {
        const updatedStoppages = Array.isArray(selectedStoppages)
          ? (selectedStoppages.includes(selectedStoppage)
            ? selectedStoppages.filter(stoppage => stoppage !== selectedStoppage)
            : [...selectedStoppages, selectedStoppage])
          : [selectedStoppage];
      
        setSelectedStoppages(updatedStoppages);
      };
      useEffect(() => {
        if (redirect) {
          navigate('/'); // Navigate after the component has rendered
        }
      }, [redirect, navigate]);
    
      
    
      return (
        <form className="logform" onSubmit={updateLog}>
          <h1 style={{ fontSize: '1.5em' }}>Edit a log</h1>
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
          <input
            type="text"
            placeholder="sensorID"
            value={sensorID}
            onChange={ev => setSensorID(ev.target.value)}
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
    