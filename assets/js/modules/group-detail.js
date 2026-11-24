
import {
    getGroupById,
    addMember
} from "../services/group-service.js";

import {
    getGroupFinancialSummary,
    formatMoney
} from "../services/finance.js";

import {
    getContributions,
    registerContribution
} from "../services/transaction-service.js";

import {
    createStatusBadge,
    createProgressBar,
    createAvatar,
    createEmptyState,
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
// LOS DATAOS - DETALLE DEL GRUPO
// ==========================================

export function renderGroupDetail(groupId) {
    const container = document.getElementById("page-content");

    if (!container) return;

    const group = getGroupById(groupId);

    if (!group) {
        container.innerHTML = createEmptyState({
            title: "Grupo no encontrado",
            description: "No fue posible encontrar la información solicitada.",
            action: `
                <button class="btn btn-secondary" id="back-to-groups">
                    Volver a mis grupos
                </button>
            `
        });

        container.querySelector("#back-to-groups")
            ?.addEventListener("click", () => {
                document.querySelector(
                    '.nav-item[data-page="groups"]'
                )?.click();
            });

        return;
    }

    const summary = getGroupFinancialSummary(group);
    const contributions = getContributions(group.id);

    container.innerHTML = `
        <div class="group-detail-page">

            <button class="text-button" id="back-to-groups">
                ← Volver a mis grupos
            </button>

            <section class="welcome-section group-detail-welcome">
                <div>
                    <span class="welcome-eyebrow">
                        ${escapeHTML(group.category)}
                    </span>

                    <h2>${escapeHTML(group.name)}</h2>

                    <p>${escapeHTML(group.description)}</p>

                    <div class="group-detail-status">
                        ${createStatusBadge(group.status)}
                        <span>
                            ${group.members.length} integrantes
                        </span>
                    </div>
                </div>

                <button class="btn btn-primary" id="add-member-button">
                    + Agregar integrante
                </button>
            </section>

            <section class="stats-grid">

                <article class="stat-card">
                    <div class="stat-card-content">
                        <p class="stat-title">Total recaudado</p>
                        <h3 class="stat-value">
                            ${formatMoney(summary.collected, group.currency)}
                        </h3>
                        <span class="stat-description">
                            Aportaciones registradas
                        </span>
                    </div>
                </article>

                <article class="stat-card">
                    <div class="stat-card-content">
                        <p class="stat-title">Objetivo del grupo</p>
                        <h3 class="stat-value">
                            ${formatMoney(summary.goal, group.currency)}
                        </h3>
                        <span class="stat-description">
                            Meta de recaudación
                        </span>
                    </div>
                </article>

                <article class="stat-card">
                    <div class="stat-card-content">
                        <p class="stat-title">Dinero disponible</p>
                        <h3 class="stat-value">
                            ${formatMoney(summary.available, group.currency)}
                        </h3>
                        <span class="stat-description">
                            Saldo libre calculado
                        </span>
                    </div>
                </article>

                <article class="stat-card">
                    <div class="stat-card-content">
                        <p class="stat-title">Gastos realizados</p>
                        <h3 class="stat-value">
                            ${formatMoney(summary.spent, group.currency)}
                        </h3>
                        <span class="stat-description">
                            Gastos aprobados y registrados
                        </span>
                    </div>
                </article>

            </section>

            <section class="dashboard-panel group-progress-panel">
                <div class="section-header">
                    <div>
                        <h2>Progreso financiero</h2>
                        <p>Estado actual de la recaudación</p>
                    </div>

                    <strong>
                        ${summary.progress.toFixed(0)}%
                    </strong>
                </div>

                ${createProgressBar({
                    value: summary.progress,
                    label: "Objetivo alcanzado"
                })}

                <div class="fund-breakdown">
                    <div>
                        <span>Recaudado</span>
                        <strong>
                            ${formatMoney(summary.collected, group.currency)}
                        </strong>
                    </div>

                    <div>
                        <span>Comprometido</span>
                        <strong>
                            ${formatMoney(summary.committed, group.currency)}
                        </strong>
                    </div>

                    <div>
                        <span>Pendiente de recaudar</span>
                        <strong>
                            ${formatMoney(summary.pending, group.currency)}
                        </strong>
                    </div>
                </div>
            </section>

            <section class="dashboard-section">

                <div class="section-header">
                    <div>
                        <h2>Integrantes del grupo</h2>
                        <p>Personas que participan en el fondo común</p>
                    </div>

                    <button class="btn btn-secondary" id="add-member-secondary">
                        + Agregar
                    </button>
                </div>

                <div class="members-grid">
                    ${renderMembers(group)}
                </div>

            </section>

            <section class="dashboard-panel">

                <div class="section-header">
                    <div>
                        <h2>Historial de aportaciones</h2>
                        <p>Movimientos registrados en este grupo</p>
                    </div>

                    <button class="btn btn-primary" id="add-contribution-button">
                        + Registrar aportación
                    </button>
                </div>

                ${renderContributionHistory(contributions, group.currency)}

            </section>

        </div>
    `;

    // Navegación
    container.querySelector("#back-to-groups")
        .addEventListener("click", () => {
            document.querySelector(
                '.nav-item[data-page="groups"]'
            )?.click();
        });

    // Agregar integrante
    container.querySelector("#add-member-button")
        .addEventListener("click", () => {
            openAddMemberModal(group);
        });

    container.querySelector("#add-member-secondary")
        .addEventListener("click", () => {
            openAddMemberModal(group);
        });

    // Registrar aportación
    container.querySelector("#add-contribution-button")
        .addEventListener("click", () => {
            openContributionModal(group);
        });
}

// ==========================================
// MOSTRAR INTEGRANTES
// ==========================================

function renderMembers(group) {
    if (!group.members.length) {
        return createEmptyState({
            title: "Sin integrantes",
            description: "Agrega personas para comenzar a gestionar el grupo."
        });
    }

    return group.members.map(member => {
        const paid = (member.payments || []).reduce(
            (total, payment) => total + Number(payment),
            0
        );

        const goal = Number(member.contributionGoal || 0);

        const progress = goal > 0
            ? Math.min((paid / goal) * 100, 100)
            : 0;

        return `
            <article class="member-card">

                <div class="member-card-header">
                    ${createAvatar(member.name)}

                    <div class="member-info">
                        <strong>${escapeHTML(member.name)}</strong>
                        <span>${escapeHTML(member.role)}</span>
                    </div>

                    ${createStatusBadge(member.status)}
                </div>

                <div class="member-financial-info">
                    <div>
                        <span>Aportado</span>
                        <strong>
                            ${formatMoney(paid, group.currency)}
                        </strong>
                    </div>

                    <div>
                        <span>Objetivo</span>
                        <strong>
                            ${formatMoney(goal, group.currency)}
                        </strong>
                    </div>
                </div>

                ${createProgressBar({
                    value: progress,
                    label: "Progreso individual"
                })}

            </article>
        `;
    }).join("");
}

// ==========================================
// HISTORIAL DE APORTACIONES
// ==========================================

function renderContributionHistory(contributions, currency) {
    if (contributions.length === 0) {
        return createEmptyState({
            title: "Sin aportaciones registradas",
            description: "Las nuevas aportaciones aparecerán en este historial."
        });
    }

    const ordered = [...contributions].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
    );

    return `
        <div class="table-responsive">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Integrante</th>
                        <th>Fecha</th>
                        <th>Importe</th>
                        <th>Estado</th>
                    </tr>
                </thead>

                <tbody>
                    ${ordered.map(item => `
                        <tr>
                            <td>
                                <strong>
                                    ${escapeHTML(item.memberName)}
                                </strong>
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
                    `).join("")}
                </tbody>
            </table>
        </div>
    `;
}

// ==========================================
// FORMULARIO PARA AGREGAR INTEGRANTES
// ==========================================

function openAddMemberModal(group) {
    const content = `
        <form id="add-member-form">

            <div class="form-group">
                <label for="member-name">Nombre del integrante</label>

                <input
                    type="text"
                    id="member-name"
                    name="name"
                    placeholder="Nombre completo"
                    required
                >
            </div>

            <div class="form-group">
                <label for="member-goal">
                    Objetivo de aportación
                </label>

                <input
                    type="number"
                    id="member-goal"
                    name="contributionGoal"
                    min="0"
                    step="0.01"
                    value="${Number(group.contributionGoal || 0)}"
                    required
                >
            </div>

            <div class="modal-actions">
                <button
                    type="button"
                    class="btn btn-secondary"
                    id="cancel-add-member"
                >
                    Cancelar
                </button>

                <button type="submit" class="btn btn-primary">
                    Agregar integrante
                </button>
            </div>

        </form>
    `;

    const modal = openModal({
        title: "Agregar integrante",
        content,
        size: "small"
    });

    modal.querySelector("#cancel-add-member")
        .addEventListener("click", closeModal);

    modal.querySelector("#add-member-form")
        .addEventListener("submit", event => {
            event.preventDefault();

            const formData = new FormData(event.currentTarget);

            try {
                addMember(group.id, {
                    name: formData.get("name"),
                    contributionGoal: Number(
                        formData.get("contributionGoal")
                    )
                });

                closeModal();

                showSuccess("El integrante se agregó correctamente.");

                renderGroupDetail(group.id);

            } catch (error) {
                showError(error.message);
            }
        });
}

// ==========================================
// FORMULARIO PARA REGISTRAR APORTACIONES
// ==========================================

function openContributionModal(group) {
    if (group.members.length === 0) {
        showError("Primero debes agregar integrantes al grupo.");
        return;
    }

    const content = `
        <form id="contribution-form">

            <div class="form-group">
                <label for="contribution-member">Integrante</label>

                <select
                    id="contribution-member"
                    name="memberId"
                    required
                >
                    ${group.members.map(member => `
                        <option value="${member.id}">
                            ${escapeHTML(member.name)}
                        </option>
                    `).join("")}
                </select>
            </div>

            <div class="form-group">
                <label for="contribution-amount">Importe</label>

                <input
                    type="number"
                    id="contribution-amount"
                    name="amount"
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    required
                >
            </div>

            <div class="form-group">
                <label for="contribution-currency">Moneda de origen</label>

                <select
                    id="contribution-currency"
                    name="currency"
                >
                    <option value="${group.currency}">
                        ${group.currency} - Moneda del grupo
                    </option>
                    <option value="USD">USD - Dólar</option>
                    <option value="ARS">ARS - Peso argentino</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="BRL">BRL - Real brasileño</option>
                </select>
            </div>

            <div class="form-group">
                <label for="contribution-concept">Concepto</label>

                <input
                    type="text"
                    id="contribution-concept"
                    name="concept"
                    value="Aportación al fondo común"
                >
            </div>

            <div class="modal-actions">
                <button
                    type="button"
                    class="btn btn-secondary"
                    id="cancel-contribution"
                >
                    Cancelar
                </button>

                <button type="submit" class="btn btn-primary">
                    Registrar aportación
                </button>
            </div>

        </form>
    `;

    const modal = openModal({
        title: "Registrar aportación",
        content,
        size: "medium"
    });

    modal.querySelector("#cancel-contribution")
        .addEventListener("click", closeModal);

    modal.querySelector("#contribution-form")
        .addEventListener("submit", event => {
            event.preventDefault();

            const formData = new FormData(event.currentTarget);

            const memberId = Number(formData.get("memberId"));

            const member = group.members.find(
                item => item.id === memberId
            );

            try {
                registerContribution({
                    groupId: group.id,
                    memberId,
                    memberName: member.name,
                    amount: Number(formData.get("amount")),
                    currency: formData.get("currency"),
                    concept: formData.get("concept")
                });

                closeModal();

                showSuccess("La aportación se registró correctamente.");

                renderGroupDetail(group.id);

            } catch (error) {
                showError(error.message);
            }
        });
}
