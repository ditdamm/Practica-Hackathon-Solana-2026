
import { getGroups } from "../services/group-service.js";

import {
    getExpenses,
    registerExpense
} from "../services/transaction-service.js";

import { formatMoney } from "../services/finance.js";

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
// LOS DATAOS - MÓDULO DE GASTOS
// ==========================================

export function renderExpenses() {
    const container = document.getElementById("page-content");

    if (!container) return;

    const groups = getGroups();
    const expenses = getExpenses();

    const pending = expenses.filter(
        item => item.status === "Pendiente"
    ).length;

    const approved = expenses.filter(
        item => item.status === "Aprobado"
    ).length;

    const rejected = expenses.filter(
        item => item.status === "Rechazado"
    ).length;

    container.innerHTML = `
        <div class="expenses-page">

            <section class="welcome-section">
                <div>
                    <span class="welcome-eyebrow">
                        CONTROL DE GASTOS
                    </span>

                    <h2>Gastos</h2>

                    <p>
                        Registra y consulta los gastos de tus grupos
                        y controla su estado de aprobación.
                    </p>
                </div>

                <button
                    class="btn btn-primary"
                    id="create-expense-button"
                    ${groups.length === 0 ? "disabled" : ""}
                >
                    + Registrar gasto
                </button>
            </section>

            <div class="stats-grid">

                <article class="stat-card">
                    <div class="stat-card-content">
                        <p class="stat-title">Total de gastos</p>
                        <h3 class="stat-value">${expenses.length}</h3>
                        <span class="stat-description">
                            Registros realizados
                        </span>
                    </div>
                </article>

                <article class="stat-card">
                    <div class="stat-card-content">
                        <p class="stat-title">Pendientes</p>
                        <h3 class="stat-value">${pending}</h3>
                        <span class="stat-description">
                            En espera de aprobación
                        </span>
                    </div>
                </article>

                <article class="stat-card">
                    <div class="stat-card-content">
                        <p class="stat-title">Aprobados</p>
                        <h3 class="stat-value">${approved}</h3>
                        <span class="stat-description">
                            Gastos autorizados
                        </span>
                    </div>
                </article>

                <article class="stat-card">
                    <div class="stat-card-content">
                        <p class="stat-title">Rechazados</p>
                        <h3 class="stat-value">${rejected}</h3>
                        <span class="stat-description">
                            Gastos no autorizados
                        </span>
                    </div>
                </article>

            </div>

            <section class="dashboard-panel">

                ${createSectionHeader({
                    title: "Historial de gastos",
                    description: "Consulta todos los movimientos registrados"
                })}

                ${renderExpensesTable(expenses, groups)}

            </section>

        </div>
    `;

    document.getElementById("create-expense-button")
        ?.addEventListener("click", openCreateExpenseModal);
}

// ==========================================
// TABLA DE GASTOS
// ==========================================

function renderExpensesTable(expenses, groups) {
    if (expenses.length === 0) {
        return createEmptyState({
            title: "No hay gastos registrados",
            description: "Cuando registres un gasto, aparecerá en esta sección."
        });
    }

    const ordered = [...expenses].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
    );

    return `
        <div class="table-responsive">
            <table class="data-table">

                <thead>
                    <tr>
                        <th>Concepto</th>
                        <th>Grupo</th>
                        <th>Responsable</th>
                        <th>Fecha</th>
                        <th>Importe</th>
                        <th>Estado</th>
                    </tr>
                </thead>

                <tbody>
                    ${ordered.map(expense => {
                        const group = groups.find(
                            item => item.id === expense.groupId
                        );

                        const currency = expense.groupCurrency ||
                            group?.currency ||
                            expense.currency ||
                            "USD";

                        return `
                            <tr>
                                <td>
                                    <strong>
                                        ${escapeHTML(expense.concept)}
                                    </strong>

                                    <span class="table-secondary-text">
                                        ${escapeHTML(expense.description || "")}
                                    </span>
                                </td>

                                <td>
                                    ${escapeHTML(group?.name || "Grupo")}
                                </td>

                                <td>
                                    ${escapeHTML(expense.responsibleMember)}
                                </td>

                                <td>
                                    ${new Date(expense.date).toLocaleDateString("es-AR")}
                                </td>

                                <td>
                                    ${formatMoney(expense.amount, currency)}
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

// ==========================================
// FORMULARIO PARA REGISTRAR GASTOS
// ==========================================

function openCreateExpenseModal() {
    const groups = getGroups();

    if (groups.length === 0) {
        showError("Primero debes crear un grupo.");
        return;
    }

    const content = `
        <form id="create-expense-form">

            <div class="form-group">
                <label for="expense-group">Grupo</label>

                <select
                    id="expense-group"
                    name="groupId"
                    required
                >
                    ${groups.map(group => `
                        <option value="${group.id}">
                            ${escapeHTML(group.name)}
                        </option>
                    `).join("")}
                </select>
            </div>

            <div class="form-group">
                <label for="expense-member">Responsable</label>

                <select
                    id="expense-member"
                    name="memberId"
                    required
                ></select>
            </div>

            <div class="form-group">
                <label for="expense-concept">Concepto del gasto</label>

                <input
                    type="text"
                    id="expense-concept"
                    name="concept"
                    placeholder="Ej. Reserva de alojamiento"
                    required
                >
            </div>

            <div class="form-group">
                <label for="expense-description">Descripción</label>

                <textarea
                    id="expense-description"
                    name="description"
                    rows="3"
                    placeholder="Describe el motivo del gasto"
                ></textarea>
            </div>

            <div class="form-group">
                <label for="expense-amount">Importe</label>

                <input
                    type="number"
                    id="expense-amount"
                    name="amount"
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    required
                >
            </div>

            <div class="form-group">
                <label for="expense-currency">Moneda de origen</label>

                <select
                    id="expense-currency"
                    name="currency"
                >
                    <option value="USD">USD - Dólar</option>
                    <option value="ARS">ARS - Peso argentino</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="BRL">BRL - Real</option>
                </select>
            </div>

            <div class="form-group">
                <label for="expense-method">Método de pago</label>

                <select id="expense-method" name="paymentMethod">
                    <option value="Fondo común">Fondo común</option>
                    <option value="Pago personal">Pago personal</option>
                </select>
            </div>

            <div class="modal-actions">
                <button
                    type="button"
                    class="btn btn-secondary"
                    id="cancel-expense"
                >
                    Cancelar
                </button>

                <button type="submit" class="btn btn-primary">
                    Registrar gasto
                </button>
            </div>

        </form>
    `;

    const modal = openModal({
        title: "Registrar nuevo gasto",
        content,
        size: "medium"
    });

    const form = modal.querySelector("#create-expense-form");
    const groupSelect = form.querySelector("#expense-group");
    const memberSelect = form.querySelector("#expense-member");
    const currencySelect = form.querySelector("#expense-currency");

    // Actualizar integrantes y moneda según el grupo seleccionado
    function updateGroupFields() {
        const selectedGroup = groups.find(
            group => group.id === Number(groupSelect.value)
        );

        if (!selectedGroup) return;

        memberSelect.innerHTML = selectedGroup.members.map(member => `
            <option value="${member.id}">
                ${escapeHTML(member.name)}
            </option>
        `).join("");

        if (selectedGroup.members.length === 0) {
            memberSelect.innerHTML = `
                <option value="">No hay integrantes</option>
            `;
        }

        currencySelect.value = selectedGroup.currency;
    }

    groupSelect.addEventListener("change", updateGroupFields);

    updateGroupFields();

    modal.querySelector("#cancel-expense")
        .addEventListener("click", closeModal);

    form.addEventListener("submit", event => {
        event.preventDefault();

        const formData = new FormData(form);

        const group = groups.find(
            item => item.id === Number(formData.get("groupId"))
        );

        const member = group?.members.find(
            item => item.id === Number(formData.get("memberId"))
        );

        if (!member) {
            showError("Selecciona un integrante válido.");
            return;
        }

        try {
            registerExpense({
                groupId: group.id,
                memberId: member.id,
                memberName: member.name,
                concept: formData.get("concept"),
                description: formData.get("description"),
                amount: Number(formData.get("amount")),
                currency: formData.get("currency"),
                paymentMethod: formData.get("paymentMethod")
            });

            closeModal();

            showSuccess(
                "El gasto se registró y quedó pendiente de aprobación."
            );

            renderExpenses();

        } catch (error) {
            showError(error.message);
        }
    });
}
