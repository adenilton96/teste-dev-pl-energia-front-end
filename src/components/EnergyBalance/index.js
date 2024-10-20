import React from 'react';
import BarChart from '../BarChart';
import AreaChart from '../AreaChart';
import './styles.css';

const EnergyBalance = () => {
  return (
    <div className="energy-balance">
      <AreaChart />
      <BarChart />
    </div>
  );
};

export default EnergyBalance;
