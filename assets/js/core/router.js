
import { renderOverview } from "../modules/overview.js";
import { renderGroups } from "../modules/groups.js";
import { renderGroupDetail } from "../modules/group-detail.js";
import { renderContributions } from "../modules/contributions.js";
import { renderExpenses } from "../modules/expenses.js";
import { renderApprovals } from "../modules/approvals.js";
import { renderFund } from "../modules/fund.js";
import { renderOutings } from "../modules/outings.js";
import { renderTransactions } from "../modules/transactions.js";
import { renderSolana } from "../modules/solana.js";

// ==========================================
// CONFIGURACIÓN DE PÁGINAS
// ==========================================

const pageTitles = {
    overview: "Resumen",
    groups: "Mis grupos",
    contributions: "Aportaciones",
    expenses: "Gastos",
    approvals: "Aprobaciones",
    fund: "Fondo común",
    outings: "Salidas y actividades",
    transactions: "Transacciones",
    solana: "Solana"
};

const pages = {
    overview: renderOverview,
    groups: renderGroups,
    contributions: renderContributions,
    expenses: renderExpenses,
    approvals: renderApprovals,
    fund: renderFund,
    outings: renderOutings,
    transactions: renderTransactions,
    solana: renderSolana
};

// ==========================================
// NAVEGACIÓN
// ==========================================

export function navigateTo(page) {
    const renderPage = pages[page];

    if (!renderPage) {
        console.error(`La página "${page}" no existe.`);
        return;
    }

    const title = document.getElementById("page-title");

    if (title) {
        title.textContent = pageTitles[page];
    }

    document.querySelectorAll(".nav-item").forEach(item => {
        item.classList.toggle(
            "active",
            item.dataset.page === page
        );
    });

    renderPage();
}

// ==========================================
// DETALLE DE GRUPO
// ==========================================

export function navigateToGroup(groupId) {
    const title = document.getElementById("page-title");

    if (title) {
        title.textContent = "Detalle del grupo";
    }

    document.querySelectorAll(".nav-item").forEach(item => {
        item.classList.toggle(
            "active",
            item.dataset.page === "groups"
        );
    });

    renderGroupDetail(groupId);
}

// ==========================================
// INICIALIZAR ENRUTADOR
// ==========================================

export function initializeRouter() {
    const navItems = document.querySelectorAll(".nav-item");

    navItems.forEach(item => {
        item.addEventListener("click", () => {
            navigateTo(item.dataset.page);
        });
    });

    document.addEventListener(
        "losdataos:open-group",
        event => {
            navigateToGroup(event.detail.groupId);
        }
    );

    navigateTo("overview");
}
