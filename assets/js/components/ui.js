
import { formatCurrency } from "../services/currency.js";

// ==========================================
// LOS DATAOS - COMPONENTES DE INTERFAZ
// ==========================================

// Escapar texto para evitar insertar HTML no deseado
export function escapeHTML(value = "") {
    return String(value).replace(/[&<>"']/g, character => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return entities[character];
    });
}

// Crear una tarjeta de indicador financiero
export function createStatCard({
    title,
    value,
    description = "",
    icon = "◈",
    trend = "",
    trendType = "neutral"
}) {
    return `
        <article class="stat-card">
            <div class="stat-card-top">
                <span class="stat-icon">${escapeHTML(icon)}</span>
                ${trend ? `
                    <span class="stat-trend ${escapeHTML(trendType)}">
                        ${escapeHTML(trend)}
                    </span>
                ` : ""}
            </div>

            <div class="stat-card-content">
                <p class="stat-title">${escapeHTML(title)}</p>
                <h3 class="stat-value">${escapeHTML(value)}</h3>
                <span class="stat-description">
                    ${escapeHTML(description)}
                </span>
            </div>
        </article>
    `;
}

// Crear una tarjeta financiera con formato monetario
export function createMoneyCard({
    title,
    amount,
    currency = "USD",
    description = "",
    icon = "◈"
}) {
    return createStatCard({
        title,
        value: formatCurrency(amount, currency),
        description,
        icon
    });
}

// Crear una barra de progreso
export function createProgressBar({
    value = 0,
    label = "",
    showPercentage = true
}) {
    const percentage = Math.min(
        Math.max(Number(value) || 0, 0),
        100
    );

    return `
        <div class="progress-container">
            <div class="progress-info">
                <span>${escapeHTML(label)}</span>

                ${showPercentage ? `
                    <strong>${percentage.toFixed(0)}%</strong>
                ` : ""}
            </div>

            <div
                class="progress-track"
                role="progressbar"
                aria-valuenow="${percentage.toFixed(0)}"
                aria-valuemin="0"
                aria-valuemax="100"
            >
                <div
                    class="progress-fill"
                    style="width: ${percentage}%"
                ></div>
            </div>
        </div>
    `;
}

// Crear una etiqueta de estado
export function createStatusBadge(status) {
    const normalizedStatus = String(status || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    let statusClass = "neutral";

    if (
        ["completado", "aprobado", "activa", "activo", "pagado"].includes(normalizedStatus)
    ) {
        statusClass = "success";
    } else if (
        ["pendiente", "en progreso", "recaudando"].includes(normalizedStatus)
    ) {
        statusClass = "warning";
    } else if (
        ["rechazado", "cancelado", "vencido"].includes(normalizedStatus)
    ) {
        statusClass = "danger";
    }

    return `
        <span class="status-badge ${statusClass}">
            ${escapeHTML(status || "Sin estado")}
        </span>
    `;
}

// Crear un avatar con iniciales
export function createAvatar(name = "Usuario", size = "normal") {
    const initials = String(name)
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(part => part.charAt(0).toUpperCase())
        .join("");

    return `
        <span class="user-avatar ${escapeHTML(size)}">
            ${escapeHTML(initials || "U")}
        </span>
    `;
}

// Crear una tarjeta de integrante
export function createMemberCard(member, currency = "USD") {
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
                    <span>${escapeHTML(member.role || "Integrante")}</span>
                </div>

                ${createStatusBadge(member.status)}
            </div>

            <div class="member-financial-info">
                <div>
                    <span>Aportado</span>
                    <strong>${formatCurrency(paid, currency)}</strong>
                </div>

                <div>
                    <span>Objetivo</span>
                    <strong>${formatCurrency(goal, currency)}</strong>
                </div>
            </div>

            ${createProgressBar({
                value: progress,
                label: "Progreso de aportación"
            })}
        </article>
    `;
}

// Crear un estado vacío
export function createEmptyState({
    icon = "◈",
    title = "No hay información",
    description = "Todavía no hay datos para mostrar.",
    action = ""
}) {
    return `
        <div class="empty-state">
            <div class="empty-state-icon">${escapeHTML(icon)}</div>
            <h3>${escapeHTML(title)}</h3>
            <p>${escapeHTML(description)}</p>
            ${action}
        </div>
    `;
}

// Crear un encabezado de sección
export function createSectionHeader({
    title,
    description = "",
    action = ""
}) {
    return `
        <div class="section-header">
            <div>
                <h2>${escapeHTML(title)}</h2>
                ${description ? `
                    <p>${escapeHTML(description)}</p>
                ` : ""}
            </div>

            <div class="section-header-action">
                ${action}
            </div>
        </div>
    `;
}
