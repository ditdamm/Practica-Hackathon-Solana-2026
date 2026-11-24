
import {
    marketData,
    priceHistory
} from "../../data/mock-data.js";

import { getGroups } from "../services/group-service.js";

import {
    getGroupFinancialSummary,
    formatMoney
} from "../services/finance.js";

import { getTransactions } from "../services/transaction-service.js";

import {
    createStatCard,
    createProgressBar,
    createStatusBadge,
    createSectionHeader,
    createEmptyState,
    escapeHTML
} from "../components/ui.js";

import { createLineChart } from "../components/chart.js";

// ==========================================
// LOS DATAOS - RESUMEN GENERAL
// ==========================================

export function renderOverview() {
    const container = document.getElementById("page-content");

    if (!container) return;

    const groups = getGroups();
    const transactions = getTransactions();

    const totalMembers = groups.reduce(
        (total, group) => total + group.members.length,
        0
    );

    const totalTransactions = transactions.length;

    const solana = marketData.solana;

    // Indicadores principales
    const stats = `
        <div class="stats-grid">
            ${createStatCard({
                title: "Grupos activos",
                value: groups.length,
                description: "Grupos registrados",
                icon: "◉"
            })}

            ${createStatCard({
                title: "Integrantes",
                value: totalMembers,
                description: "Participantes de los grupos",
                icon: "♙"
            })}

            ${createStatCard({
                title: "Movimientos",
                value: totalTransactions,
                description: "Transacciones registradas",
                icon: "⇄"
            })}

            ${createStatCard({
                title: "Precio de SOL",
                value: `$${solana.price.toFixed(2)}`,
                description: "Variación de 24 horas",
                icon: "◈",
                trend: `${solana.change24h > 0 ? "+" : ""}${solana.change24h}%`,
                trendType: solana.change24h >= 0 ? "positive" : "negative"
            })}
        </div>
    `;

    // Tarjetas de grupos
    const groupCards = groups.length > 0
        ? groups.map(group => {
            const summary = getGroupFinancialSummary(group);

            return `
                <article class="overview-group-card">
                    <div class="overview-group-header">
                        <div>
                            <span class="group-category">
                                ${escapeHTML(group.category)}
                            </span>

                            <h3>${escapeHTML(group.name)}</h3>
                        </div>

                        ${createStatusBadge(group.status)}
                    </div>

                    <p class="overview-group-description">
                        ${escapeHTML(group.description)}
                    </p>

                    <div class="overview-group-finances">
                        <div>
                            <span>Recaudado</span>
                            <strong>
                                ${formatMoney(summary.collected, group.currency)}
                            </strong>
                        </div>

                        <div>
                            <span>Objetivo</span>
                            <strong>
                                ${formatMoney(summary.goal, group.currency)}
                            </strong>
                        </div>
                    </div>

                    ${createProgressBar({
                        value: summary.progress,
                        label: "Progreso de recaudación"
                    })}

                    <div class="overview-group-footer">
                        <span>
                            ${group.members.length} integrantes
                        </span>

                        <button
                            class="text-button"
                            data-open-groups
                        >
                            Ver grupo →
                        </button>
                    </div>
                </article>
            `;
        }).join("")
        : createEmptyState({
            title: "Todavía no tienes grupos",
            description: "Crea tu primer grupo para comenzar a gestionar aportaciones y gastos."
        });

    // Últimos movimientos
    const recentTransactions = transactions.slice(0, 5);

    const transactionsContent = recentTransactions.length > 0
        ? `
            <div class="table-responsive">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Concepto</th>
                            <th>Grupo</th>
                            <th>Tipo</th>
                            <th>Importe</th>
                            <th>Estado</th>
                        </tr>
                    </thead>

                    <tbody>
                        ${recentTransactions.map(transaction => `
                            <tr>
                                <td>
                                    <strong>
                                        ${escapeHTML(transaction.concept)}
                                    </strong>
                                </td>

                                <td>
                                    ${escapeHTML(transaction.groupName)}
                                </td>

                                <td>
                                    ${escapeHTML(transaction.type)}
                                </td>

                                <td>
                                    ${formatMoney(
                                        transaction.amount,
                                        transaction.groupCurrency || "USD"
                                    )}
                                </td>

                                <td>
                                    ${createStatusBadge(transaction.status)}
                                </td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
        `
        : createEmptyState({
            title: "Sin movimientos",
            description: "Los movimientos registrados aparecerán aquí."
        });

    // Gráfico de Solana
    const chartData = priceHistory.map(item => ({
        label: item.date,
        value: item.price
    }));

    container.innerHTML = `
        <div class="overview-page">

            <section class="welcome-section">
                <div>
                    <span class="welcome-eyebrow">
                        PANEL DE CONTROL
                    </span>

                    <h2>Tu ecosistema financiero</h2>

                    <p>
                        Consulta tus grupos, aportaciones y el mercado
                        de Solana desde un mismo lugar.
                    </p>
                </div>

                <button
                    class="btn btn-primary"
                    data-open-groups
                >
                    Explorar grupos
                </button>
            </section>

            ${stats}

            <div class="overview-main-grid">

                <section class="dashboard-panel solana-panel">
                    ${createSectionHeader({
                        title: "Mercado de Solana",
                        description: "Evolución simulada del precio de SOL"
                    })}

                    <div class="solana-price-summary">
                        <div>
                            <span>Precio actual</span>
                            <h2>$${solana.price.toFixed(2)}</h2>
                        </div>

                        <span class="${solana.change24h >= 0 ? "positive" : "negative"}">
                            ${solana.change24h > 0 ? "+" : ""}${solana.change24h}% (24 h)
                        </span>
                    </div>

                    ${createLineChart({
                        data: chartData,
                        color: "#8b5cf6"
                    })}

                    <p class="chart-disclaimer">
                        Datos ilustrativos. No representan cotizaciones en tiempo real.
                    </p>
                </section>

                <section class="dashboard-panel market-details-panel">
                    ${createSectionHeader({
                        title: "Indicadores de SOL",
                        description: "Información de mercado simulada"
                    })}

                    <div class="market-detail">
                        <span>Capitalización de mercado</span>
                        <strong>
                            $${(solana.marketCap / 1000000000).toFixed(2)} B
                        </strong>
                    </div>

                    <div class="market-detail">
                        <span>Volumen en 24 horas</span>
                        <strong>
                            $${(solana.volume24h / 1000000000).toFixed(2)} B
                        </strong>
                    </div>

                    <div class="market-detail">
                        <span>Oferta circulante</span>
                        <strong>
                            ${(solana.circulatingSupply / 1000000).toFixed(2)} M SOL
                        </strong>
                    </div>

                    <button
                        class="btn btn-secondary btn-full"
                        data-open-solana
                    >
                        Ver mercado completo
                    </button>
                </section>

            </div>

            <section class="dashboard-section">
                ${createSectionHeader({
                    title: "Mis grupos",
                    description: "Resumen de tus fondos colectivos",
                    action: `
                        <button class="text-button" data-open-groups>
                            Ver todos →
                        </button>
                    `
                })}

                <div class="overview-groups-grid">
                    ${groupCards}
                </div>
            </section>

            <section class="dashboard-panel transactions-panel">
                ${createSectionHeader({
                    title: "Movimientos recientes",
                    description: "Últimas operaciones registradas"
                })}

                ${transactionsContent}
            </section>

            <p class="demo-disclaimer">
                Los DataOS · Entorno de demostración · Información simulada
            </p>

        </div>
    `;

    // Navegación hacia otras secciones
    container.querySelectorAll("[data-open-groups]")
        .forEach(button => {
            button.addEventListener("click", () => {
                document.querySelector(
                    '.nav-item[data-page="groups"]'
                )?.click();
            });
        });

    container.querySelectorAll("[data-open-solana]")
        .forEach(button => {
            button.addEventListener("click", () => {
                document.querySelector(
                    '.nav-item[data-page="solana"]'
                )?.click();
            });
        });
}
