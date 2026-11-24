
import { getGroups } from "../services/group-service.js";

import {
    getContributions
} from "../services/transaction-service.js";

import {
    formatMoney,
    getMemberPaid,
    getMemberPending
} from "../services/finance.js";

import {
    createStatusBadge,
    createProgressBar,
    createEmptyState,
    createSectionHeader,
    escapeHTML
} from "../components/ui.js";

// ==========================================
// LOS DATAOS - MÓDULO DE APORTACIONES
// ==========================================

export function renderContributions() {
    const container = document.getElementById("page-content");

    if (!container) return;

    const groups = getGroups();

    const contributions = getContributions();

    const totalContributions = contributions.reduce(
        (total, item) => total + Number(item.amount || 0),
        0
    );

    const completedContributions = contributions.filter(
        item => item.status === "Completado"
    ).length;

    const pendingContributions = groups.reduce(
        (total, group) => {
            return total + group.members.reduce(
                (memberTotal, member) =>
                    memberTotal + getMemberPending(member),
                0
            );
        },
        0
    );

    container.innerHTML = `
        <div class="contributions-page">

            <section class="welcome-section">
                <div>
                    <span class="welcome-eyebrow">
                        CONTROL FINANCIERO
                    </span>

                    <h2>Aportaciones</h2>

                    <p>
                        Consulta los pagos registrados y el progreso
                        de recaudación de tus grupos.
                    </p>
                </div>
            </section>

            <div class="stats-grid">

                <article class="stat-card">
                    <div class="stat-card-content">
                        <p class="stat-title">Aportaciones registradas</p>
                        <h3 class="stat-value">
                            ${contributions.length}
                        </h3>
                        <span class="stat-description">
                            Movimientos registrados
                        </span>
                    </div>
                </article>

                <article class="stat-card">
                    <div class="stat-card-content">
                        <p class="stat-title">Aportaciones completadas</p>
                        <h3 class="stat-value">
                            ${completedContributions}
                        </h3>
                        <span class="stat-description">
                            Pagos confirmados
                        </span>
                    </div>
                </article>

                <article class="stat-card">
                    <div class="stat-card-content">
                        <p class="stat-title">Pendiente de recaudar</p>
                        <h3 class="stat-value">
                            ${pendingContributions.toLocaleString("es-AR", {
                                maximumFractionDigits: 2
                            })}
                        </h3>
                        <span class="stat-description">
                            Suma de importes en monedas de cada grupo
                        </span>
                    </div>
                </article>

            </div>

            <section class="dashboard-section">

                ${createSectionHeader({
                    title: "Progreso por grupo",
                    description: "Estado de las aportaciones individuales"
                })}

                <div class="contribution-groups-grid">
                    ${renderGroupContributions(groups)}
                </div>

            </section>

            <section class="dashboard-panel">

                ${createSectionHeader({
                    title: "Historial de aportaciones",
                    description: "Todos los pagos registrados"
                })}

                ${renderContributionTable(contributions)}

            </section>

        </div>
    `;
}

// ==========================================
// PROGRESO DE APORTACIONES POR GRUPO
// ==========================================

function renderGroupContributions(groups) {
    if (groups.length === 0) {
        return createEmptyState({
            title: "No hay grupos registrados",
            description: "Cuando crees grupos, sus aportaciones aparecerán aquí."
        });
    }

    return groups.map(group => {
        const members = group.members || [];

        const collected = members.reduce(
            (total, member) => total + getMemberPaid(member),
            0
        );

        const pending = members.reduce(
            (total, member) => total + getMemberPending(member),
            0
        );

        const goal = collected + pending;

        const progress = goal > 0
            ? (collected / goal) * 100
            : 0;

        return `
            <article class="contribution-group-card">

                <div class="contribution-group-header">
                    <div>
                        <span class="group-category">
                            ${escapeHTML(group.category)}
                        </span>

                        <h3>${escapeHTML(group.name)}</h3>
                    </div>

                    ${createStatusBadge(group.status)}
                </div>

                <div class="contribution-group-summary">
                    <div>
                        <span>Recaudado</span>
                        <strong>
                            ${formatMoney(collected, group.currency)}
                        </strong>
                    </div>

                    <div>
                        <span>Pendiente</span>
                        <strong>
                            ${formatMoney(pending, group.currency)}
                        </strong>
                    </div>
                </div>

                ${createProgressBar({
                    value: progress,
                    label: "Progreso de aportación"
                })}

                <div class="contribution-members-list">
                    ${members.map(member => {
                        const paid = getMemberPaid(member);
                        const memberPending = getMemberPending(member);

                        return `
                            <div class="contribution-member-row">
                                <span>
                                    ${escapeHTML(member.name)}
                                </span>

                                <span>
                                    ${formatMoney(paid, group.currency)}
                                    / ${formatMoney(
                                        Number(member.contributionGoal || 0),
                                        group.currency
                                    )}
                                </span>

                                <span class="contribution-pending">
                                    ${memberPending > 0
                                        ? `Pendiente: ${formatMoney(memberPending, group.currency)}`
                                        : "Completado"}
                                </span>
                            </div>
                        `;
                    }).join("")}
                </div>

            </article>
        `;
    }).join("");
}

// ==========================================
// TABLA GENERAL DE APORTACIONES
// ==========================================

function renderContributionTable(contributions) {
    if (contributions.length === 0) {
        return createEmptyState({
            title: "No hay aportaciones",
            description: "Los pagos registrados aparecerán en esta sección."
        });
    }

    const ordered = [...contributions].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
    );

    const groups = getGroups();

    return `
        <div class="table-responsive">
            <table class="data-table">

                <thead>
                    <tr>
                        <th>Integrante</th>
                        <th>Grupo</th>
                        <th>Fecha</th>
                        <th>Importe</th>
                        <th>Estado</th>
                    </tr>
                </thead>

                <tbody>
                    ${ordered.map(item => {
                        const group = groups.find(
                            group => group.id === item.groupId
                        );

                        const currency = item.groupCurrency ||
                            group?.currency ||
                            item.currency ||
                            "USD";

                        return `
                            <tr>
                                <td>
                                    <strong>
                                        ${escapeHTML(item.memberName)}
                                    </strong>
                                </td>

                                <td>
                                    ${escapeHTML(group?.name || "Grupo")}
                                </td>

                                <td>
                                    ${new Date(item.date).toLocaleDateString("es-AR")}
                                </td>

                                <td>
                                    ${formatMoney(item.amount, currency)}
                                </td>

                                <td>
                                    ${createStatusBadge(item.status)}
                                </td>
                            </tr>
                        `;
                    }).join("")}
                </tbody>

            </table>
        </div>
    `;
}
