import axios from "axios";
import React from 'react';

const faturasAPI = axios.create({
    baseURL: "http://localhost:8000/"
});

async function getDados() {
    try {
        const response = await faturasAPI.get('/dados');
        return response.data.dados;
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
        return []; 
    }
}

async function getDadosNCliente(id) {
    try {
        const response = await faturasAPI.get('/dados/'+id);
        return response.data.dados;
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
        return []; 
    }
}

async function getDadosNClienteData(id,data) {
    try {
        const response = await faturasAPI.get('/dados/'+id+'/'+data);
        return response.data.dados;
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
        return []; 
    }
}

async function calculaDados(dados) {
    try {

        if (!Array.isArray(dados)) {
            console.error("Dados não estão no formato esperado: não é um array");
            return [];
        }

        let consumo_energia = 0;
        let energia_compensada = 0;
        let valor_total = 0;
        let valor_economia = 0;

        dados.forEach(element => {
            const eng_eletrica_qtd = parseFloat(element.eng_eletrica_qtd) || 0;
            const eng_sceee_ims_qtd = parseFloat(element.eng_sceee_ims_qtd) || 0;
            const eng_compensada_qtd = parseFloat(element.eng_compensada_qtd) || 0;
            const eng_eletrica_valor = parseFloat(element.eng_eletrica_valor) || 0;
            const eng_sceee_ims_valor = parseFloat(element.eng_sceee_ims_valor) || 0;
            const contrib_ilum_publica_valor = parseFloat(element.contrib_ilum_publica_valor) || 0;
            const eng_compensada_valor = parseFloat(element.eng_compensada_valor) || 0;

            consumo_energia += eng_eletrica_qtd + eng_sceee_ims_qtd;
            energia_compensada += eng_compensada_qtd;
            valor_total += eng_eletrica_valor + eng_sceee_ims_valor + contrib_ilum_publica_valor;
            valor_economia += eng_compensada_valor;
        });

        return {
            consumo_energia,
            energia_compensada,
            valor_total,
            valor_economia
        }  
        ;
        
    } catch (error) {
        console.error("Erro ao obter os dados:", error);
        return []; 
    }
}

async function getCards() {
    try {
        const dados = await getDados();
       
        if (!Array.isArray(dados)) {
            console.error("Dados não estão no formato esperado: não é um array");
            return [];
        }
       
        const dadosCalculado = await calculaDados(dados);

        return [
            { title: 'Consumo de Energia Elétrica (KWh):', value: `${dadosCalculado.consumo_energia} kWh` },
            { title: 'Energia Compensada (kWh):', value: `${dadosCalculado.energia_compensada} kWh` },
            { title: 'Valor Total sem GD (R$):', value: `R$ ${dadosCalculado.valor_total.toFixed(2)}` },
            { title: 'Economia GD (R$):', value: `R$ ${dadosCalculado.valor_economia.toFixed(2)}` }
        ];
        
    } catch (error) {
        console.error("Erro ao obter os dados:", error);
        return []; 
    }
}

async function getResultadoEnergiaFinanceirosMes() {
    try {
        const dados = await getDados();
       
        if (!Array.isArray(dados)) {
            console.error("Dados não estão no formato esperado: não é um array");
            return [];
        }
        
        const mesData = {
            janeiro: [],
            fevereiro: [],
            marco: [],
            abril: [],
            maio: [],
            junho: [],
            julho: [],
            agosto: [],
            setembro: [],
            outubro: [],
            novembro: [],
            dezembro: []
        };
       
        dados.forEach(element => {
            const data = new Date(element.mes_referencia + 'T00:00:00');
            let mes = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(data);
            
            if (mes === 'março') {
                mes = 'marco';
            }

            if (mes in mesData) {
                mesData[mes].push(element);
            }
        });
        const dadosCalculado= [];

        for (const [mes, elementos] of Object.entries(mesData)) {
            if (elementos.length > 0) {
                 dadosCalculado[mes] = await calculaDados(dados);
            }else{
                dadosCalculado[mes] = {
                                    "consumo_energia": 0,
                                    "energia_compensada": 0,
                                    "valor_total": 0,
                                    "valor_economia": 0
                                }
            }
        }

        return dadosCalculado;
    } catch (error) {
        console.error("Erro ao obter os dados:", error);
        return []; 
    }
}

async function getResultadoEnergia() {
    try { 

        const dados = await getResultadoEnergiaFinanceirosMes();
        let dadosConsumo = [];
        let dadosCompesado = [];
        Object.entries(dados).forEach(([mes, elementos]) => {
           
            dadosConsumo[mes]= elementos.consumo_energia;
            dadosCompesado[mes]= elementos.energia_compensada;
        });
      
       return {
            dadosConsumo,
            dadosCompesado
        }
    } catch (error) {
        console.error("Erro ao obter os dados:", error);
        return []; 
    }
}

async function getResulFinanceiro() {
    try { 

        const dados = await getResultadoEnergiaFinanceirosMes();
        let valorTotal = [];
        let valorEconomia = [];
        Object.entries(dados).forEach(([mes, elementos]) => {
            valorTotal[mes]= Math.abs(elementos.valor_total).toFixed(2);
            valorEconomia[mes]= Math.abs(elementos.valor_economia).toFixed(2);
        });
      
        
       return {
            valorTotal,
            valorEconomia
        }
    } catch (error) {
        console.error("Erro ao obter os dados:", error);
        return []; 
    }
}

async function getfaturasClientes(idCliente = null) {
    try { 

        const dados = idCliente ? await getDadosNCliente(idCliente) : await getDados();
        
        const meses = ['janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
        let clientes = {};
       
        dados.forEach(element => {
            const numeroCliente = element.numero_cliente;
            
            // Inicializa o cliente se não existir
            if (!clientes[numeroCliente]) {
                clientes[numeroCliente] = {
                    numeroCliente: numeroCliente,
                    meses: Array(12).fill(''), // Inicializa com 12 meses vazios
                };
            }
            
            const data = new Date(element.mes_referencia + 'T00:00:00');
            let mes = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(data);
            
            // Corrige o mês "março" para "marco"
            if (mes === 'março') {
                mes = 'marco';
            }
            
            // Encontra o índice do mês
            const mesIndex = meses.indexOf(mes);
            if (mesIndex !== -1) {
                // Se o mês for encontrado, atribui 'file' à posição correspondente
                clientes[numeroCliente].meses[mesIndex] = element.mes_referencia; 
            }
        });
        return Object.values(clientes); 
    } catch (error) {
        console.error("Erro ao obter os dados:", error);
        return []; 
    }
}

async function downloadfaturaCliente(numeroClien, mes) {
    try { 
        const dados = await getDadosNClienteData(numeroClien, mes);
        if (!dados || !dados[0] || !dados[0].pdf || !dados[0].pdf.data) {
            throw new Error("Dados do PDF estão ausentes ou incorretos.");
        }
        const pdfBuffer = dados[0].pdf.data;
       
        const base64String = arrayBufferToBase64(pdfBuffer);
        const byteCharacters = atob(base64String);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        
        // Criando um link de download
        const link = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        link.href = url;
        link.download = `fatura_${numeroClien}_${mes}.pdf`;
        document.body.appendChild(link);
        link.click();
        
        // Revogando a URL do objeto após o download
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
        
    } catch (error) {
        console.error("Erro ao obter os dados:", error);
    }
}

function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}



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
