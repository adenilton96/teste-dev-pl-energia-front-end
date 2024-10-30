import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { getResultadoEnergia } from '../../servicos/apiFaturas';

Chart.register(...registerables);

const AreaChart = () => {
  const [dadosConsumo, setDadosConsumo] = useState({});
  const [dadosCompensado, setDadosCompensado] = useState({});

  // Labels dos meses
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Consumo de Energia El\u00E9trica (KWh)',
        data: [
          dadosConsumo.janeiro || 0,
          dadosConsumo.fevereiro || 0,
          dadosConsumo.marco || 0,
          dadosConsumo.abril || 0,
          dadosConsumo.maio || 0,
          dadosConsumo.junho || 0,
          dadosConsumo.julho || 0,
          dadosConsumo.agosto || 0,
          dadosConsumo.setembro || 0,
          dadosConsumo.outubro || 0,
          dadosConsumo.novembro || 0,
          dadosConsumo.dezembro || 0,
        ],
        fill: true,
        backgroundColor: 'rgba(255, 159, 64, 0.3)',
        borderColor: 'rgba(255, 159, 64, 1)',
        tension: 0.4,
      },
      {
        label: 'Energia Compensada (KWh)',
        data: [
          dadosCompensado.janeiro || 0,
          dadosCompensado.fevereiro || 0,
          dadosCompensado.marco || 0,
          dadosCompensado.abril || 0,
          dadosCompensado.maio || 0,
          dadosCompensado.junho || 0,
          dadosCompensado.julho || 0,
          dadosCompensado.agosto || 0,
          dadosCompensado.setembro || 0,
          dadosCompensado.outubro || 0,
          dadosCompensado.novembro || 0,
          dadosCompensado.dezembro || 0,
        ],
        fill: true,
        backgroundColor: 'rgba(0, 182, 137, 0.4)',
        borderColor: 'rgba(0, 182, 137, 1)',
        tension: 0.4,
      },
    ],
  };

  useEffect(() => {
    fetchDadosEnergia();
  }, []);

  // Função para buscar os dados de consumo e energia compensada
  async function fetchDadosEnergia() {
    try {
      const dados = await getResultadoEnergia();
      setDadosConsumo(dados.dadosConsumo || {});
      setDadosCompensado(dados.dadosCompesado || {});
    } catch (error) {
      console.error("Erro ao buscar os dados de energia:", error);
    }
  }

  return (
    <div className="area-chart">
      <h3>Resultados de Energia (kWh)</h3>
      <Line data={data} height={200} width={445} />
    </div>
  );
};

export default AreaChart;
