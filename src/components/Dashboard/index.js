import React from 'react';
import Header from '../Header';
import Cards from '../Cards';
import EnergyBalance from '../EnergyBalance';
import './styles.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <Header title="Dashboard" />
      <Cards />
      <div className="main-charts">
        <EnergyBalance />
      </div>
    </div>
  );
};

export default Dashboard;
