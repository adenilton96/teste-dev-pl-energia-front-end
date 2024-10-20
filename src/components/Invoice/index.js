import React from 'react';
import Header from '../Header/index.js';
import Cards from '../Cards/index.js';
import InvoiceGrid from '../InvoiceGrid/index.js';


const Invoice = () => {
  return (
    <div className="dashboard">
      <Header title="Faturas"/>
      <Cards />
      <div className="main-charts">
        <InvoiceGrid />
      </div>
    
    </div>
  );
};

export default Invoice;
