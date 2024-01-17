// Log.js
import React from 'react';

const Log = ({ _id, time, duration, region, sensorID, profile, stoppage, measure, comment, onDelete, onEdit, createdAt }) => {
  const removeUnwantedCharacters = (value) => value.replace(/[\\\"\'\`]/g, '');

  const formatData = (data) => {
    if (Array.isArray(data)) {
      return data.map(item => {
        if (Array.isArray(item)) {
          return item.map(subItem => removeUnwantedCharacters(subItem).replace(/^\[|\]$/g, '')).join(', ');
        } else if (typeof item === 'string') {
          return removeUnwantedCharacters(item).replace(/^\[|\]$/g, '');
        }
        return item;
      }).join(', ');
    } else if (typeof data === 'string') {
      return removeUnwantedCharacters(data).replace(/^\[|\]$/g, '');
    }
    return data;
  };

  let formattedTime;
  try {
    formattedTime = new Date(time).toLocaleString();
  } catch (error) {
    console.error('Invalid date:', time);
    formattedTime = time;
  }

  let formattedCreatedAt;
  try {
    formattedCreatedAt = new Date(createdAt).toLocaleString();
  } catch (error) {
    console.error('Invalid date:', createdAt);
    formattedCreatedAt = createdAt;
  }

  const formatRegion = formatData(region);
  const formatSensorID = formatData(sensorID);
  const formatStoppage = formatData(stoppage);

  return (
    <tr>
      <td>{formattedCreatedAt}</td>
      <td>{formattedTime}</td>
      <td>{duration}</td>
      <td className="region-head">{formatRegion}</td>
      <td>{formatSensorID}</td>
      <td>{profile}</td>
      <td>{formatStoppage}</td>
      <td>{measure}</td>
      <td>{comment}</td>
      <td>
        <div className='log-buttons'>
          <button onClick={() => onEdit(_id)}>Edit</button>
          <button onClick={() => onDelete(_id)}>Delete</button>
        </div>
      </td>
    </tr>
  );
};

export default Log;
