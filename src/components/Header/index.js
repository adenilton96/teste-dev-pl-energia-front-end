import React from 'react';
import './styles.css';

const Header = ({ title }) => {
  return (
    <div className="header">
      <div className="title">
        <h2>{title}</h2>
      </div>
    </div>
  );
};

export default Header;
