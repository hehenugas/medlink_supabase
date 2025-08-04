import React from 'react';

const GoogleMaps = ({ show, latitude, longitude, zoom = 15, markerColor = 'red', markerLabel = 'A' }: any) => {
  if (!show) return null;

  const mapUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&hl=eng&z=${zoom}&output=embed&markers=color:${markerColor}|label:${markerLabel}|${latitude},${longitude}`;

  return (
    <div className="mt-4">
      <div className="map-container">
        <iframe
          src={mapUrl}
          allowFullScreen
          loading="lazy"
          className="map-iframe"
        />
      </div>
      <style jsx>{`
        .map-container {
          width: 100%;
          height: 400px;
          border: 2px solid #ccc;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .map-iframe {
          width: 100%;
          height: 100%;
          border: none;
        }

        .mt-4 {
          margin-top: 1rem;
        }
      `}</style>
    </div>
  );
};

export default GoogleMaps;