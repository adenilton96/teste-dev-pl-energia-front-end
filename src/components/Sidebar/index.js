import React, { useState } from 'react';
import './styles.css';
import { NavLink, useLocation } from 'react-router-dom';
import logo from '../../img/logo.png'; // Importando a imagem diretamente

const Sidebar = () => {
  const { pathname } = useLocation(); 
  const [active, setActive] = useState(pathname); 

  const handleSetActive = (path) => {
    setActive(path); 
  };

  return (
    <div className="sidebar">
      <div className="logo">
        <img src={logo} alt="Lumi Logo" />
      </div>
      
      <ul className="nav-menu">
        <NavLink className='link' to='/' onClick={() => handleSetActive('/')} >
          <li className={active === '/' ? 'active' : ''}>
            <i className="fas fa-tachometer-alt"></i>Dashboard
          </li>
        </NavLink> 

        <NavLink className='link' to='/faturas' onClick={() => handleSetActive('/faturas')}  >
          <li className={active === '/faturas' ? 'active' : ''}>
            <i className="fas fa-file-invoice"></i>Faturas
          </li>
        </NavLink>
      </ul>
      
      <div className="footer">
        {/* Se você tiver conteúdo aqui, pode ser uma boa ideia adicionar */}
      </div>
    </div>
  );
};

export default Sidebar;
