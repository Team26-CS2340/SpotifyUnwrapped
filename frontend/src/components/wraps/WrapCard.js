// src/components/wraps/WrapCard.js
import React from 'react';

// WrapCard Component
const WrapCard = ({ title, content }) => {
  return (
    <div className="wrap-card">
      <h2>{title}</h2>
      {Array.isArray(content) ? (
        <ul>
          {content.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ) : (
        <p>{content}</p>
      )}
    </div>
  );
};

export default WrapCard;
