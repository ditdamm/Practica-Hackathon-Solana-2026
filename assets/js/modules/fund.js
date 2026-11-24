
import { getGroups } from "../services/group-service.js";

import {
    getGroupFinancialSummary,
    formatMoney
} from "../services/finance.js";

import {
    createStatusBadge,
    createEmptyState,
    createSectionHeader,
    escapeHTML
} from "../components/ui.js";

// ==========================================
// LOS DATAOS - MÓDULO DE FONDO COMÚN
// ==========================================

export function renderFund() {
    const container = document.getElementById("page-content");

    if (!container) return;

    const groups = getGroups();

    if (groups.length === 0) {
        container.innerHTML = `
            <div class="fund-page">
                ${createEmptyState({
                    title: "No hay fondos registrados",
                    description: "Crea un grupo para comenzar a administrar un fondo común."
                })}
            </div>
        `;

        return;
    }

    const groupSummaries = groups.map(group => ({
        group,
        summary: getGroupFinancialSummary(group)
    }));

    container.innerHTML = `
        <div class="fund-page">

            <section class="welcome-section">
                <div>
                    <span class="welcome-eyebrow">
                        ADMINISTRACIÓN FINANCIERA
                    </span>

                    <h2>Fondo común</h2>

                    <p>
                        Consulta el estado de los fondos colectivos
                        y la disponibilidad económica de cada grupo.
                    </p>
                </div>
            </section>

            <section class="dashboard-section">

                ${createSectionHeader({
                    title: "Fondos por grupo",
                    description: "Detalle financiero individual"
                })}

                <div class="fund-groups-grid">
                    ${groupSummaries.map(({ group, summary }) => `
                        <article class="fund-card">

                            <div class="fund-card-header">
                                <div>
                                    <span class="group-category">
                                        ${escapeHTML(group.category)}
                                    </span>

                                    <h3>${escapeHTML(group.name)}</h3>
                                </div>

                                ${createStatusBadge(group.status)}
                            </div>

                            <div class="fund-main-balance">
                                <span>Dinero disponible</span>

                                <strong>
                                    ${formatMoney(
                                        summary.available,
                                        group.currency
                                    )}
                                </strong>
                            </div>

                            <div class="fund-breakdown">

                                <div class="fund-breakdown-row">
                                    <span>Dinero recaudado</span>
                                    <strong>
                                        ${formatMoney(
                                            summary.collected,
                                            group.currency
                                        )}
                                    </strong>
                                </div>

                                <div class="fund-breakdown-row">
                                    <span>Dinero comprometido</span>
                                    <strong>
                                        ${formatMoney(
                                            summary.committed,
                                            group.currency
                                        )}
                                    </strong>
                                </div>

                                <div class="fund-breakdown-row">
                                    <span>Gastos realizados</span>
                                    <strong>
                                        ${formatMoney(
                                            summary.spent,
                                            group.currency
                                        )}
                                    </strong>
                                </div>

                                <div class="fund-breakdown-row fund-total">
                                    <span>Saldo disponible</span>
                                    <strong>
                                        ${formatMoney(
                                            summary.available,
                                            group.currency
                                        )}
                                    </strong>
                                </div>

                            </div>

                            <div class="fund-card-footer">
                                <span>
                                    ${group.members.length} integrantes
                                </span>

                                <button
                                    class="btn btn-secondary"
                                    data-fund-group="${group.id}"
                                >
                                    Consultar grupo →
                                </button>
                            </div>

                        </article>
                    `).join("")}
                </div>

            </section>

            <section class="dashboard-panel">

                ${createSectionHeader({
                    title: "Resumen de fondos",
                    description: "Indicadores financieros de cada grupo"
                })}

                <div class="table-responsive">
                    <table class="data-table">

                        <thead>
                            <tr>
                                <th>Grupo</th>
                                <th>Moneda</th>
                                <th>Recaudado</th>
                                <th>Comprometido</th>
                                <th>Gastado</th>
                                <th>Disponible</th>
                            </tr>
                        </thead>

                        <tbody>
                            ${groupSummaries.map(({ group, summary }) => `
                                <tr>
                                    <td>
                                        <strong>
                                            ${escapeHTML(group.name)}
                                        </strong>
                                    </td>

                                    <td>${escapeHTML(group.currency)}</td>

                                    <td>
                                        ${formatMoney(summary.collected, group.currency)}
                                    </td>

                                    <td>
                                        ${formatMoney(summary.committed, group.currency)}
                                    </td>

                                    <td>
                                        ${formatMoney(summary.spent, group.currency)}
                                    </td>

                                    <td>
                                        <strong>
                                            ${formatMoney(summary.available, group.currency)}
                                        </strong>
                                    </td>
                                </tr>
                            `).join("")}
                        </tbody>

                    </table>
                </div>

            </section>

            <p class="demo-disclaimer">
                Los saldos corresponden a cálculos realizados con información simulada.
            </p>

        </div>
    `;

    // Abrir el detalle del grupo seleccionado
    container.querySelectorAll("[data-fund-group]")
        .forEach(button => {
            button.addEventListener("click", () => {
                const groupId = button.dataset.fundGroup;

                document.dispatchEvent(
                    new CustomEvent("losdataos:open-group", {
                        detail: { groupId }
                    })
                );
            });
        });
}
