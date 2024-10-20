import React, { useEffect, useState } from 'react';
import './styles.css';
import { getfaturasClientes, downloadfaturaCliente } from '../../servicos/apiFaturas';

const InvoiceGrid = () => {
  const [clientes, setClientes] = useState([]);
  const [numeroClienteBusca, setNumeroClienteBusca] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getDados();
  }, []);

  const getDados = async (clienteId = null) => {
    setLoading(true);
    setError(""); // Limpa erros anteriores
    try {
      const dados = await getfaturasClientes(clienteId);
      setClientes(dados);
    } catch (err) {
      setError("Erro ao buscar faturas. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    getDados(numeroClienteBusca);
  };

  const downloadFatura = (numeroClien, mes) => {
    downloadfaturaCliente(numeroClien, mes);
  };

  return (
    <div className="invoice-container">
      <label htmlFor="cliente-search">Buscar por N.º DO CLIENTE:</label>
      <div className="filters">
        <input
          id="cliente-search"
          type="text"
          placeholder="Buscar"
          className="search"
          value={numeroClienteBusca}
          onChange={(e) => setNumeroClienteBusca(e.target.value)}
        />
        <button onClick={handleSearch}>Pesquisar</button>
      </div>

      {loading && <p>Carregando...</p>}
      {error && <p className="error">{error}</p>}

      <table className="invoice-table">
        <thead>
          <tr>
            <th>No DO CLIENTE</th>
            <th>Jan</th>
            <th>Fev</th>
            <th>Mar</th>
            <th>Abr</th>
            <th>Mai</th>
            <th>Jun</th>
            <th>Jul</th>
            <th>Ago</th>
            <th>Set</th>
            <th>Oct</th>
            <th>Nov</th>
            <th>Dec</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((invoice, index) => (
            <tr key={index}>
              <td>{invoice.numeroCliente}</td>
              {invoice.meses.map((mes, idx) => (
                <td key={idx}>
                  {mes ? (
                    <button
                      className='bordasFatura'
                      onClick={() => downloadFatura(invoice.numeroCliente, mes)}
                    >
                      <i className="icon-file" />
                    </button>
                  ) : (
                    <i className="icon-file opacity" />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceGrid;
