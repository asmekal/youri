import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const InteractiveMap = () => {
  const [markers, setMarkers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]);
  const [zoom, setZoom] = useState(13);

  const handleAddMarker = (e) => {
    const { latlng } = e;
    setMarkers([...markers, { id: markers.length + 1, latlng, note: '' }]);
  };

  const handleUpdateNote = (id, note) => {
    setMarkers(
      markers.map((marker) => (marker.id === id ? { ...marker, note } : marker))
    );
  };

  return (
    <div className="map-container">
      <input
        type="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search"
      />
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ width: '100%', height: '600px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker) => (
          <Marker key={marker.id} position={marker.latlng}>
            <Popup>
              <input
                type="text"
                value={marker.note}
                onChange={(e) => handleUpdateNote(marker.id, e.target.value)}
              />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <button onClick={(e) => handleAddMarker(e)}>Add Marker</button>
    </div>
  );
};

export default InteractiveMap;