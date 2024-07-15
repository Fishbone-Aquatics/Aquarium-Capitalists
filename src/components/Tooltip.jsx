import React from 'react';

const Tooltip = ({ data }) => {
  if (!data) {
    console.log('No tooltip data to display');
    return null;
  }

  //console.log('Displaying tooltip data:', data);
  return (
    <div className="tooltip">
      <h3>Name: {data.name} | Type: {data.type} | ID: {data.id}</h3>
        <p>Description: {data.description}</p>
      {data.statChanges && (
        <ul>
          {Object.entries(data.statChanges).map(([key, value]) => (
            <li key={key}>
              {key}: {value}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Tooltip;
