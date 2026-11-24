
import { getGroups } from "../services/group-service.js";

import {
    getExpenses,
    approveExpense,
    rejectExpense
} from "../services/transaction-service.js";

import {
    createStatusBadge,
    createEmptyState,
    createSectionHeader,
    escapeHTML
} from "../components/ui.js";

import {
    openModal,
    closeModal
} from "../components/modal.js";

import {
    showSuccess,
    showError
} from "../components/notifications.js";

// ==========================================
// LOS DATAOS - SISTEMA DE APROBACIONES
// ==========================================

// Votos simulados durante la sesión
let demoVotes = {};

// ==========================================
// PANTALLA PRINCIPAL
// ==========================================

export function renderApprovals() {
    const container = document.getElementById("page-content");

    if (!container) return;

    const groups = getGroups();
    const expenses = getExpenses();

    const pendingExpenses = expenses.filter(
        expense => expense.status === "Pendiente"
    );

    const approvedExpenses = expenses.filter(
        expense => expense.status === "Aprobado"
    );

    const rejectedExpenses = expenses.filter(
        expense => expense.status === "Rechazado"
    );

    container.innerHTML = `
        <div class="approvals-page">

            <section class="welcome-section">
                <div>
                    <span class="welcome-eyebrow">
                        GOBERNANZA COLECTIVA
                    </span>

                    <h2>Aprobaciones</h2>

                    <p>
                        Participa en las decisiones financieras
                        de tus grupos mediante votaciones.
                    </p>
                </div>
            </section>

            <div class="stats-grid">

                <article class="stat-card">
                    <div class="stat-card-content">
                        <p class="stat-title">Pendientes</p>
                        <h3 class="stat-value">
                            ${pendingExpenses.length}
                        </h3>
                        <span class="stat-description">
                            Esperando votación
                        </span>
                    </div>
                </article>

                <article class="stat-card">
                    <div class="stat-card-content">
                        <p class="stat-title">Aprobados</p>
                        <h3 class="stat-value">
                            ${approvedExpenses.length}
                        </h3>
                        <span class="stat-description">
                            Decisiones favorables
                        </span>
                    </div>
                </article>

                <article class="stat-card">
                    <div class="stat-card-content">
                        <p class="stat-title">Rechazados</p>
                        <h3 class="stat-value">
                            ${rejectedExpenses.length}
                        </h3>
                        <span class="stat-description">
                            Decisiones desfavorables
                        </span>
                    </div>
                </article>

            </div>

            <section class="dashboard-section">

                ${createSectionHeader({
                    title: "Propuestas pendientes",
                    description: "Gastos que necesitan aprobación"
                })}

                <div class="approval-list">
                    ${renderPendingApprovals(pendingExpenses, groups)}
                </div>

            </section>

            <section class="dashboard-panel">

                ${createSectionHeader({
                    title: "Historial de decisiones",
                    description: "Propuestas aprobadas o rechazadas"
                })}

                ${renderApprovalHistory(
                    [...approvedExpenses, ...rejectedExpenses],
                    groups
                )}

            </section>

        </div>
    `;

    container.querySelectorAll("[data-approval-id]")
        .forEach(button => {
            button.addEventListener("click", () => {
                const expenseId = Number(button.dataset.approvalId);

                openVotingModal(expenseId);
            });
        });
}

// ==========================================
// PROPUESTAS PENDIENTES
// ==========================================

function renderPendingApprovals(expenses, groups) {
    if (expenses.length === 0) {
        return createEmptyState({
            title: "No hay propuestas pendientes",
            description: "Las nuevas propuestas de gastos aparecerán aquí."
        });
    }

    return expenses.map(expense => {
        const group = groups.find(
            item => item.id === expense.groupId
        );

        const votes = demoVotes[expense.id] || {};

        const totalMembers = group?.members.length || 0;

        const totalVotes = Object.keys(votes).length;

        return `
            <article class="approval-card">

                <div class="approval-card-header">
                    <div>
                        <span class="group-category">
                            ${escapeHTML(group?.name || "Grupo")}
                        </span>

                        <h3>${escapeHTML(expense.concept)}</h3>
                    </div>

                    ${createStatusBadge(expense.status)}
                </div>

                <p>${escapeHTML(expense.description || "Sin descripción")}</p>

                <div class="approval-details">
                    <div>
                        <span>Importe</span>
                        <strong>
                            ${Number(expense.amount).toLocaleString("es-AR", {
                                style: "currency",
                                currency: expense.groupCurrency || "USD"
                            })}
                        </strong>
                    </div>

                    <div>
                        <span>Responsable</span>
                        <strong>
                            ${escapeHTML(expense.responsibleMember)}
                        </strong>
                    </div>

                    <div>
                        <span>Votos registrados</span>
                        <strong>
                            ${totalVotes} / ${totalMembers}
                        </strong>
                    </div>
                </div>

                <button
                    class="btn btn-primary"
                    data-approval-id="${expense.id}"
                    ${totalMembers === 0 ? "disabled" : ""}
                >
                    Gestionar votación
                </button>

            </article>
        `;
    }).join("");
}

// ==========================================
// VENTANA DE VOTACIÓN
// ==========================================

function openVotingModal(expenseId) {
    const expenses = getExpenses();
    const groups = getGroups();

    const expense = expenses.find(
        item => item.id === expenseId
    );

    if (!expense || expense.status !== "Pendiente") {
        showError("Esta propuesta ya no está pendiente.");
        renderApprovals();
        return;
    }

    const group = groups.find(
        item => item.id === expense.groupId
    );

    if (!group || group.members.length === 0) {
        showError("El grupo no tiene integrantes para votar.");
        return;
    }

    if (!demoVotes[expenseId]) {
        demoVotes[expenseId] = {};
    }

    const votes = demoVotes[expenseId];

    const content = `
        <div class="voting-modal-content">

            <div class="voting-proposal">
                <span>Propuesta de gasto</span>
                <h3>${escapeHTML(expense.concept)}</h3>
                <strong>
                    ${Number(expense.amount).toLocaleString("es-AR", {
                        style: "currency",
                        currency: expense.groupCurrency || "USD"
                    })}
                </strong>
            </div>

            <p>
                Cada integrante debe registrar su voto.
                Todos deben aprobar para autorizar el gasto.
            </p>

            <div class="voting-members">

                ${group.members.map(member => {
                    const vote = votes[member.id];

                    return `
                        <div class="voting-member-row">

                            <div>
                                <strong>
                                    ${escapeHTML(member.name)}
                                </strong>

                                <span>
                                    ${vote
                                        ? `Voto: ${escapeHTML(vote)}`
                                        : "Pendiente de votar"}
                                </span>
                            </div>

                            <div class="voting-actions">

                                <button
                                    type="button"
                                    class="btn btn-small btn-success"
                                    data-vote-approve="${member.id}"
                                    ${vote ? "disabled" : ""}
                                >
                                    Aprobar
                                </button>

                                <button
                                    type="button"
                                    class="btn btn-small btn-danger"
                                    data-vote-reject="${member.id}"
                                    ${vote ? "disabled" : ""}
                                >
                                    Rechazar
                                </button>

                            </div>

                        </div>
                    `;
                }).join("")}

            </div>

            <div class="modal-actions">
                <button
                    type="button"
                    class="btn btn-secondary"
                    id="close-voting-modal"
                >
                    Cerrar
                </button>
            </div>

        </div>
    `;

    const modal = openModal({
        title: "Votación del grupo",
        content,
        size: "large"
    });

    modal.querySelector("#close-voting-modal")
        .addEventListener("click", closeModal);

    // Registrar votos favorables
    modal.querySelectorAll("[data-vote-approve]")
        .forEach(button => {
            button.addEventListener("click", () => {
                const memberId = Number(button.dataset.voteApprove);

                registerVote(
                    expenseId,
                    memberId,
                    "Aprobar"
                );
            });
        });

    // Registrar votos desfavorables
    modal.querySelectorAll("[data-vote-reject]")
        .forEach(button => {
            button.addEventListener("click", () => {
                const memberId = Number(button.dataset.voteReject);

                registerVote(
                    expenseId,
                    memberId,
                    "Rechazar"
                );
            });
        });
}

// ==========================================
// REGISTRAR UN VOTO
// ==========================================

function registerVote(expenseId, memberId, vote) {
    const expenses = getExpenses();
    const groups = getGroups();

    const expense = expenses.find(
        item => item.id === expenseId
    );

    const group = groups.find(
        item => item.id === expense?.groupId
    );

    if (!expense || !group) {
        showError("No se pudo identificar la propuesta.");
        return;
    }

    if (expense.status !== "Pendiente") {
        showError("La propuesta ya fue procesada.");
        return;
    }

    if (!demoVotes[expenseId]) {
        demoVotes[expenseId] = {};
    }

    if (demoVotes[expenseId][memberId]) {
        showError("Este integrante ya registró su voto.");
        return;
    }

    demoVotes[expenseId][memberId] = vote;

    // Un solo voto negativo rechaza la propuesta
    if (vote === "Rechazar") {
        rejectExpense(expenseId);

        closeModal();

        showError(
            "La propuesta fue rechazada por un integrante."
        );

        renderApprovals();

        return;
    }

    const totalMembers = group.members.length;

    const totalVotes = Object.keys(
        demoVotes[expenseId]
    ).length;

    // Aprobar únicamente cuando todos votaron a favor
    if (totalVotes === totalMembers) {
        approveExpense(expenseId);

        closeModal();

        showSuccess(
            "Todos los integrantes aprobaron el gasto."
        );

        renderApprovals();

        return;
    }

    showSuccess(
        `Voto registrado. Faltan ${totalMembers - totalVotes} integrantes por votar.`
    );

    // Actualizar la ventana de votación
    closeModal();

    openVotingModal(expenseId);
}

// ==========================================
// HISTORIAL DE APROBACIONES
// ==========================================

function renderApprovalHistory(expenses, groups) {
    if (expenses.length === 0) {
        return createEmptyState({
            title: "Sin decisiones registradas",
            description: "Las propuestas procesadas aparecerán aquí."
        });
    }

    return `
        <div class="table-responsive">
            <table class="data-table">

                <thead>
                    <tr>
                        <th>Propuesta</th>
                        <th>Grupo</th>
                        <th>Responsable</th>
                        <th>Importe</th>
                        <th>Estado</th>
                    </tr>
                </thead>

                <tbody>
                    ${expenses.map(expense => {
                        const group = groups.find(
                            item => item.id === expense.groupId
                        );

                        return `
                            <tr>
                                <td>
                                    <strong>
                                        ${escapeHTML(expense.concept)}
                                    </strong>
                                </td>

                                <td>
                                    ${escapeHTML(group?.name || "Grupo")}
                                </td>

                                <td>
                                    ${escapeHTML(expense.responsibleMember)}
                                </td>

                                <td>
                                    ${Number(expense.amount).toLocaleString("es-AR", {
                                        style: "currency",
                                        currency: expense.groupCurrency || "USD"
                                    })}
                                </td>

                                <td>
                                    ${createStatusBadge(expense.status)}
                                </td>
                            </tr>
                        `;
                    }).join("")}
                </tbody>

            </table>
        </div>
    `;
}
