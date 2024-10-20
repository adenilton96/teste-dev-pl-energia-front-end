import axios from "axios";
import React from 'react';

const faturasAPI = axios.create({
    baseURL: "http://localhost:8000/"
});

// Função para tratar erros
const handleError = (error, message) => {
    console.error(message, error);
    return [];
};

// Função genérica para obter dados da API
async function fetchData(endpoint) {
    try {
        const response = await faturasAPI.get(endpoint);
        return response.data.dados || [];
    } catch (error) {
        return handleError(error, `Erro ao buscar dados de ${endpoint}:`);
    }
}

// Funções específicas para obter dados
async function getDados() {
    return await fetchData('/dados');
}

async function getDadosNCliente(id) {
    return await fetchData(`/dados/${id}`);
}

async function getDadosNClienteData(id, data) {
    return await fetchData(`/dados/${id}/${data}`);
}

// Função para formatar números para notação brasileira
function formatarNumero(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(valor);
}

// Função para calcular os dados
async function calculaDados(dados) {
    if (!Array.isArray(dados)) {
        console.error("Dados não estão no formato esperado: não é um array");
        return {
            consumo_energia: 0,
            energia_compensada: 0,
            valor_total: 0,
            valor_economia: 0
        };
    }

    return dados.reduce((acc, element) => {
        const eng_eletrica_qtd = parseFloat(element.eng_eletrica_qtd) || 0;
        const eng_sceee_ims_qtd = parseFloat(element.eng_sceee_ims_qtd) || 0;
        const eng_compensada_qtd = parseFloat(element.eng_compensada_qtd) || 0;
        const eng_eletrica_valor = parseFloat(element.eng_eletrica_valor) || 0;
        const eng_sceee_ims_valor = parseFloat(element.eng_sceee_ims_valor) || 0;
        const contrib_ilum_publica_valor = parseFloat(element.contrib_ilum_publica_valor) || 0;
        const eng_compensada_valor = parseFloat(element.eng_compensada_valor) || 0;

        acc.consumo_energia += eng_eletrica_qtd + eng_sceee_ims_qtd;
        acc.energia_compensada += eng_compensada_qtd;
        acc.valor_total += eng_eletrica_valor + eng_sceee_ims_valor + contrib_ilum_publica_valor;
        acc.valor_economia += eng_compensada_valor;

        return acc;
    }, {
        consumo_energia: 0,
        energia_compensada: 0,
        valor_total: 0,
        valor_economia: 0
    });
}

// Função para obter os cards
async function getCards() {
    const dados = await getDados();
    const dadosCalculado = await calculaDados(dados);

    return [
        { title: 'Consumo de Energia Elétrica (KWh):', value: `${formatarNumero(dadosCalculado.consumo_energia)} kWh` },
        { title: 'Energia Compensada (kWh):', value: `${formatarNumero(dadosCalculado.energia_compensada)} kWh` },
        { title: 'Valor Total sem GD (R$):', value: `R$ ${formatarNumero(dadosCalculado.valor_total)}` },
        { title: 'Economia GD (R$):', value: `R$ ${formatarNumero(dadosCalculado.valor_economia)}` }
    ];
}

// Função para obter dados financeiros mensais
async function getResultadoEnergiaFinanceirosMes() {
    const dados = await getDados();
    const mesData = {};

    dados.forEach(element => {
        const data = new Date(element.mes_referencia + 'T00:00:00');
        const mes = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(data).replace('março', 'marco');
        mesData[mes] = mesData[mes] || [];
        mesData[mes].push(element);
    });

    const dadosCalculado = await Promise.all(
        Object.entries(mesData).map(async ([mes, elementos]) => {
            return {
                mes,
                dados: elementos.length > 0 ? await calculaDados(elementos) : {
                    consumo_energia: 0,
                    energia_compensada: 0,
                    valor_total: 0,
                    valor_economia: 0
                }
            };
        })
    );

    return Object.fromEntries(dadosCalculado.map(item => [item.mes, item.dados]));
}

// Função para obter resultado de energia
async function getResultadoEnergia() {
    const dados = await getResultadoEnergiaFinanceirosMes();
    return Object.entries(dados).reduce((acc, [mes, elementos]) => {
        acc.dadosConsumo[mes] = formatarNumero(elementos.consumo_energia);
        acc.dadosCompesado[mes] = formatarNumero(elementos.energia_compensada);
        return acc;
    }, { dadosConsumo: {}, dadosCompesado: {} });
}

// Função para obter resultados financeiros
async function getResulFinanceiro() {
    const dados = await getResultadoEnergiaFinanceirosMes();
    return Object.entries(dados).reduce((acc, [mes, elementos]) => {
        acc.valorTotal[mes] = formatarNumero(Math.abs(elementos.valor_total));
        acc.valorEconomia[mes] = formatarNumero(Math.abs(elementos.valor_economia));
        return acc;
    }, { valorTotal: {}, valorEconomia: {} });
}

// Função para obter faturas de clientes
async function getfaturasClientes(idCliente = null) {
    const dados = idCliente ? await getDadosNCliente(idCliente) : await getDados();
    const meses = ['janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    const clientes = {};

    dados.forEach(element => {
        const numeroCliente = element.numero_cliente;
        if (!clientes[numeroCliente]) {
            clientes[numeroCliente] = { numeroCliente, meses: Array(12).fill('') };
        }
        
        const data = new Date(element.mes_referencia + 'T00:00:00');
        const mes = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(data).replace('março', 'marco');
        const mesIndex = meses.indexOf(mes);
        if (mesIndex !== -1) {
            clientes[numeroCliente].meses[mesIndex] = element.mes_referencia; 
        }
    });
    
    return Object.values(clientes); 
}

// Função para download de fatura
async function downloadfaturaCliente(numeroClien, mes) {
    try {
        const dados = await getDadosNClienteData(numeroClien, mes);
        if (!dados || !dados[0]?.pdf?.data) {
            throw new Error("Dados do PDF estão ausentes ou incorretos.");
        }

        const pdfBuffer = dados[0].pdf.data;
        const base64String = arrayBufferToBase64(pdfBuffer);
        const byteCharacters = atob(base64String);
        const byteNumbers = new Uint8Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const blob = new Blob([byteNumbers], { type: 'application/pdf' });
        const link = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        
        link.href = url;
        link.download = `fatura_${numeroClien}_${mes}.pdf`;
        document.body.appendChild(link);
        link.click();

        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
        
    } catch (error) {
        handleError(error, "Erro ao obter os dados:");
    }
}

// Função auxiliar para converter ArrayBuffer para Base64
function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

// Exportando as funções
export {
    getDados,
    getCards,
    calculaDados,
    getResultadoEnergia,
    getResulFinanceiro,
    getfaturasClientes,
    getDadosNCliente,
    downloadfaturaCliente
};
