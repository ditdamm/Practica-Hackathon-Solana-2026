
import { getGroups } from "../services/group-service.js";

import {
    getTransactions
} from "../services/transaction-service.js";

import {
    formatMoney
} from "../services/finance.js";

import {
    createStatusBadge,
    createEmptyState,
    createSectionHeader,
    escapeHTML
} from "../components/ui.js";

// ==========================================
// LOS DATAOS - MÓDULO DE TRANSACCIONES
// ==========================================

export function renderTransactions() {
    const container = document.getElementById("page-content");

    if (!container) return;

    const groups = getGroups();
    const transactions = getTransactions();

    const contributions = transactions.filter(
        item => item.type === "Aportación"
    );

    const expenses = transactions.filter(
        item => item.type === "Gasto"
    );

    container.innerHTML = `
        <div class="transactions-page">

            <section class="welcome-section">
                <div>
                    <span class="welcome-eyebrow">
                        ACTIVIDAD FINANCIERA
                    </span>

                    <h2>Transacciones</h2>

                    <p>
                        Consulta y filtra los movimientos financieros
                        registrados en tus grupos.
                    </p>
                </div>
            </section>

            <div class="stats-grid">

                <article class="stat-card">
                    <div class="stat-card-content">
                        <p class="stat-title">Movimientos</p>
                        <h3 class="stat-value">
                            ${transactions.length}
                        </h3>
                        <span class="stat-description">
                            Total de transacciones
                        </span>
                    </div>
                </article>

                <article class="stat-card">
                    <div class="stat-card-content">
                        <p class="stat-title">Aportaciones</p>
                        <h3 class="stat-value">
                            ${contributions.length}
                        </h3>
                        <span class="stat-description">
                            Ingresos registrados
                        </span>
                    </div>
                </article>

                <article class="stat-card">
                    <div class="stat-card-content">
                        <p class="stat-title">Gastos</p>
                        <h3 class="stat-value">
                            ${expenses.length}
                        </h3>
                        <span class="stat-description">
                            Egresos registrados
                        </span>
                    </div>
                </article>

            </div>

            <section class="dashboard-panel">

                ${createSectionHeader({
                    title: "Historial de movimientos",
                    description: "Filtra y consulta las transacciones"
                })}

                <div class="transaction-filters">

                    <div class="form-group">
                        <label for="transaction-group-filter">
                            Grupo
                        </label>

                        <select id="transaction-group-filter">
                            <option value="all">Todos los grupos</option>

                            ${groups.map(group => `
                                <option value="${group.id}">
                                    ${escapeHTML(group.name)}
                                </option>
                            `).join("")}
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="transaction-type-filter">
                            Tipo de movimiento
                        </label>

                        <select id="transaction-type-filter">
                            <option value="all">Todos los movimientos</option>
                            <option value="Aportación">Aportaciones</option>
                            <option value="Gasto">Gastos</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="transaction-status-filter">
                            Estado
                        </label>

                        <select id="transaction-status-filter">
                            <option value="all">Todos los estados</option>
                            <option value="Completado">Completado</option>
                            <option value="Pendiente">Pendiente</option>
                            <option value="Aprobado">Aprobado</option>
                            <option value="Rechazado">Rechazado</option>
                        </select>
                    </div>

                </div>

                <div id="transaction-results">
                    ${renderTransactionTable(transactions, groups)}
                </div>

            </section>

        </div>
    `;

    attachTransactionFilters(container, transactions, groups);
}

// ==========================================
// TABLA DE TRANSACCIONES
// ==========================================

function renderTransactionTable(transactions, groups) {
    if (transactions.length === 0) {
        return createEmptyState({
            title: "No hay movimientos",
            description: "No se encontraron transacciones con los filtros seleccionados."
        });
    }

    const ordered = [...transactions].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
    );

    return `
        <div class="table-responsive">

            <table class="data-table">

                <thead>
                    <tr>
                        <th>Concepto</th>
                        <th>Grupo</th>
                        <th>Integrante</th>
                        <th>Tipo</th>
                        <th>Fecha</th>
                        <th>Importe</th>
                        <th>Estado</th>
                    </tr>
                </thead>

                <tbody>
                    ${ordered.map(transaction => {
                        const group = groups.find(
                            item => item.id === transaction.groupId
                        );

                        const currency = transaction.groupCurrency ||
                            group?.currency ||
                            "USD";

                        const isContribution =
                            transaction.type === "Aportación";

                        return `
                            <tr>
                                <td>
                                    <strong>
                                        ${escapeHTML(transaction.concept)}
                                    </strong>

                                    <span class="table-secondary-text">
                                        ${escapeHTML(transaction.id)}
                                    </span>
                                </td>

                                <td>
                                    ${escapeHTML(
                                        transaction.groupName ||
                                        group?.name ||
                                        "Grupo"
                                    )}
                                </td>

                                <td>
                                    ${escapeHTML(transaction.memberName || "Integrante")}
                                </td>

                                <td>
                                    <span class="transaction-type ${isContribution ? "income" : "expense"}">
                                        ${isContribution ? "↑ Aportación" : "↓ Gasto"}
                                    </span>
                                </td>

                                <td>
                                    ${new Date(transaction.date).toLocaleDateString("es-AR")}
                                </td>

                                <td>
                                    <strong>
                                        ${formatMoney(transaction.amount, currency)}
                                    </strong>
                                </td>

                                <td>
                                    ${createStatusBadge(transaction.status)}
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
// FILTROS
// ==========================================

function attachTransactionFilters(container, transactions, groups) {
    const groupFilter = container.querySelector(
        "#transaction-group-filter"
    );

    const typeFilter = container.querySelector(
        "#transaction-type-filter"
    );

    const statusFilter = container.querySelector(
        "#transaction-status-filter"
    );

    const results = container.querySelector(
        "#transaction-results"
    );

    function applyFilters() {
        const selectedGroup = groupFilter.value;
        const selectedType = typeFilter.value;
        const selectedStatus = statusFilter.value;

        const filtered = transactions.filter(transaction => {
            const matchesGroup =
                selectedGroup === "all" ||
                transaction.groupId === Number(selectedGroup);

            const matchesType =
                selectedType === "all" ||
                transaction.type === selectedType;

            const matchesStatus =
                selectedStatus === "all" ||
                transaction.status === selectedStatus;

            return matchesGroup && matchesType && matchesStatus;
        });

        results.innerHTML = renderTransactionTable(
            filtered,
            groups
        );
    }

    groupFilter.addEventListener("change", applyFilters);
    typeFilter.addEventListener("change", applyFilters);
    statusFilter.addEventListener("change", applyFilters);
}
