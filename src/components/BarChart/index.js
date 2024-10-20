import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { getResulFinanceiro } from '../../servicos/apiFaturas';

const BarChart = () => {
  const [total, setTotal] = useState({});
  const [economia, setEconomia] = useState({});

  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Valor Total sem GDR$',
        data: [
          total.janeiro || 0,
          total.fevereiro || 0,
          total.marco || 0,
          total.abril || 0,
          total.maio || 0,
          total.junho || 0,
          total.julho || 0,
          total.agosto || 0,
          total.setembro || 0,
          total.outubro || 0,
          total.novembro || 0,
          total.dezembro || 0,
        ],
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
      },
      {
        label: 'Economia GDR$',
        data: [
          economia.janeiro || 0,
          economia.fevereiro || 0,
          economia.marco || 0,
          economia.abril || 0,
          economia.maio || 0,
          economia.junho || 0,
          economia.julho || 0,
          economia.agosto || 0,
          economia.setembro || 0,
          economia.outubro || 0,
          economia.novembro || 0,
          economia.dezembro || 0,
        ],
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  useEffect(() => {
    fetchDadosFinanceiros();
  }, []);

  // Função para buscar os dados financeiros
  async function fetchDadosFinanceiros() {
    try {
      const dados = await getResulFinanceiro();
      setTotal(dados.valorTotal || {});
      setEconomia(dados.valorEconomia || {});
    } catch (error) {
      console.error("Erro ao buscar os dados financeiros:", error);
    }
  }

  return (
    <div className="bar-chart">
      <h3>Resultados Financeiros (R$)</h3>
      <Bar data={data} height={200} width={445} />
    </div>
  );
};

export default BarChart;
