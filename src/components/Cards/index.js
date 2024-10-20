import React, { useEffect, useState } from 'react';
import './styles.css';
import { getCards } from '../../servicos/apiFaturas';

const Cards = () => {
  const [cardsData, setCardsData] = useState([]);

  useEffect(() => {
    fetchCardsData();
  }, []);

  async function fetchCardsData() {
    try {
      const dados = await getCards();
      if (dados && Array.isArray(dados)) {
        setCardsData(dados);
      } else {
        console.error("Dados inválidos recebidos");
      }
    } catch (error) {
      console.error("Erro ao buscar os dados dos cards:", error);
    }
  }

  return (
    <div className="cards">
      {cardsData.length > 0 ? (
        cardsData.map((card, index) => (
          <div key={index} className="card">
            <h3>{card.title}</h3>
            <h2>{card.value}</h2>
          </div>
        ))
      ) : (
        <p>Nenhum dado disponível</p>  // Mensagem para quando não houver dados
      )}
    </div>
  );
};

export default Cards;
