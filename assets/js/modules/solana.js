
import {
    marketData,
    priceHistory
} from "../../data/mock-data.js";

import {
    createLineChart
} from "../components/chart.js";

import {
    createStatCard,
    createSectionHeader,
    escapeHTML
} from "../components/ui.js";

// ==========================================
// LOS DATAOS - MÓDULO SOLANA
// ==========================================

export function renderSolana() {
    const container = document.getElementById("page-content");

    if (!container) return;

    const isPositive = marketData.change24h >= 0;

    const changeClass = isPositive ? "positive" : "negative";

    const changeSymbol = isPositive ? "+" : "";

    container.innerHTML = `
        <div class="solana-page">

            <section class="welcome-section">
                <div>
                    <span class="welcome-eyebrow">
                        ECOSISTEMA BLOCKCHAIN
                    </span>

                    <h2>Solana Market</h2>

                    <p>
                        Consulta indicadores de mercado y evolución
                        del activo SOL.
                    </p>
                </div>

                <span class="demo-badge">
                    MERCADO SIMULADO
                </span>
            </section>

            <section class="solana-hero">

                <div class="solana-asset-info">

                    <div class="solana-token-icon">
                        ◎
                    </div>

                    <div>
                        <h2>Solana</h2>
                        <span>SOL · Solana Network</span>
                    </div>

                </div>

                <div class="solana-price-container">

                    <span>Precio actual</span>

                    <h1>
                        ${formatUSD(marketData.price)}
                    </h1>

                    <span class="solana-change ${changeClass}">
                        ${changeSymbol}${marketData.change24h.toFixed(2)}%
                        en las últimas 24 horas
                    </span>

                </div>

            </section>

            <section class="dashboard-section">

                ${createSectionHeader({
                    title: "Indicadores de mercado",
                    description: "Métricas generales del activo SOL"
                })}

                <div class="stats-grid">

                    ${createStatCard({
                        title: "Capitalización de mercado",
                        value: formatCompact(marketData.marketCap),
                        description: "Valor total de mercado",
                        icon: "◈"
                    })}

                    ${createStatCard({
                        title: "Volumen 24 horas",
                        value: formatCompact(marketData.volume24h),
                        description: "Volumen negociado",
                        icon: "⇄"
                    })}

                    ${createStatCard({
                        title: "Oferta circulante",
                        value: formatCompact(marketData.circulatingSupply),
                        description: "SOL en circulación",
                        icon: "◎"
                    })}

                    ${createStatCard({
                        title: "Variación 24 horas",
                        value: `${changeSymbol}${marketData.change24h.toFixed(2)}%`,
                        description: "Cambio porcentual",
                        icon: isPositive ? "↗" : "↘",
                        trend: isPositive ? "Positiva" : "Negativa",
                        trendType: isPositive ? "positive" : "negative"
                    })}

                </div>

            </section>

            <section class="dashboard-panel">

                ${createSectionHeader({
                    title: "Evolución del precio",
                    description: "Historial simulado de los últimos siete días"
                })}

                <div class="solana-chart-summary">
                    <div>
                        <span>Precio actual</span>
                        <strong>${formatUSD(marketData.price)}</strong>
                    </div>

                    <div>
                        <span>Variación diaria</span>
                        <strong class="${changeClass}">
                            ${changeSymbol}${marketData.change24h.toFixed(2)}%
                        </strong>
                    </div>
                </div>

                ${createLineChart({
                    data: priceHistory,
                    width: 900,
                    height: 320,
                    color: "#8b5cf6",
                    showPoints: true,
                    showGrid: true
                })}

            </section>

            <section class="dashboard-panel">

                ${createSectionHeader({
                    title: "Información del activo",
                    description: "Características generales de Solana"
                })}

                <div class="solana-information-grid">

                    <div class="solana-information-item">
                        <span>Nombre</span>
                        <strong>Solana</strong>
                    </div>

                    <div class="solana-information-item">
                        <span>Símbolo</span>
                        <strong>SOL</strong>
                    </div>

                    <div class="solana-information-item">
                        <span>Red</span>
                        <strong>Solana Mainnet</strong>
                    </div>

                    <div class="solana-information-item">
                        <span>Tipo de activo</span>
                        <strong>Criptoactivo</strong>
                    </div>

                    <div class="solana-information-item">
                        <span>Consenso</span>
                        <strong>Proof of Stake</strong>
                    </div>

                    <div class="solana-information-item">
                        <span>Arquitectura</span>
                        <strong>Blockchain de alto rendimiento</strong>
                    </div>

                </div>

            </section>

            <p class="demo-disclaimer">
                Los valores de mercado son simulados y no representan
                cotizaciones financieras en tiempo real.
            </p>

        </div>
    `;
}

// ==========================================
// FORMATEO DE VALORES
// ==========================================

function formatUSD(value) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(Number(value) || 0);
}

function formatCompact(value) {
    return new Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 2
    }).format(Number(value) || 0);
}
