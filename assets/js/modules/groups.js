
import {
    getGroups,
    createGroup
} from "../services/group-service.js";

import {
    getGroupFinancialSummary,
    formatMoney
} from "../services/finance.js";

import {
    createStatusBadge,
    createProgressBar,
    createEmptyState,
    escapeHTML
} from "../components/ui.js";

import { openModal, closeModal } from "../components/modal.js";

import {
    showSuccess,
    showError
} from "../components/notifications.js";

// ==========================================
// LOS DATAOS - MÓDULO DE GRUPOS
// ==========================================

export function renderGroups() {
    const container = document.getElementById("page-content");

    if (!container) return;

    const groups = getGroups();

    const categories = [
        ...new Set(groups.map(group => group.category))
    ];

    container.innerHTML = `
        <div class="groups-page">

            <section class="welcome-section">
                <div>
                    <span class="welcome-eyebrow">GESTIÓN COLECTIVA</span>
                    <h2>Mis grupos</h2>
                    <p>
                        Organiza fondos, administra integrantes
                        y controla las aportaciones.
                    </p>
                </div>

                <button class="btn btn-primary" id="create-group-button">
                    + Crear grupo
                </button>
            </section>

            <div class="groups-toolbar">
                <div class="groups-count">
                    <strong>${groups.length}</strong>
                    <span>grupos registrados</span>
                </div>

                <div class="groups-filter">
                    <label for="group-category-filter">
                        Filtrar por categoría
                    </label>

                    <select id="group-category-filter">
                        <option value="all">Todas las categorías</option>

                        ${categories.map(category => `
                            <option value="${escapeHTML(category)}">
                                ${escapeHTML(category)}
                            </option>
                        `).join("")}
                    </select>
                </div>
            </div>

            <div class="groups-grid" id="groups-grid">
                ${renderGroupCards(groups)}
            </div>

        </div>
    `;

    document.getElementById("create-group-button")
        .addEventListener("click", openCreateGroupModal);

    document.getElementById("group-category-filter")
        .addEventListener("change", event => {
            const selectedCategory = event.target.value;

            const filteredGroups = selectedCategory === "all"
                ? getGroups()
                : getGroups().filter(
                    group => group.category === selectedCategory
                );

            document.getElementById("groups-grid").innerHTML =
                renderGroupCards(filteredGroups);

            attachGroupEvents(container);
        });

    attachGroupEvents(container);
}

// ==========================================
// TARJETAS DE GRUPOS
// ==========================================

function renderGroupCards(groups) {
    if (groups.length === 0) {
        return createEmptyState({
            icon: "◉",
            title: "No se encontraron grupos",
            description: "Prueba con otra categoría o crea un nuevo grupo."
        });
    }

    return groups.map(group => {
        const summary = getGroupFinancialSummary(group);

        return `
            <article class="group-card">

                <div class="group-card-header">
                    <span class="group-category">
                        ${escapeHTML(group.category)}
                    </span>

                    ${createStatusBadge(group.status)}
                </div>

                <h3>${escapeHTML(group.name)}</h3>

                <p class="group-card-description">
                    ${escapeHTML(group.description)}
                </p>

                <div class="group-card-members">
                    <span>♙</span>
                    ${group.members.length} integrantes
                </div>

                <div class="group-card-finances">
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
                    label: "Progreso del fondo"
                })}

                <div class="group-card-footer">
                    <span>
                        Disponible:
                        <strong>
                            ${formatMoney(summary.available, group.currency)}
                        </strong>
                    </span>

                    <button
                        class="btn btn-secondary"
                        data-group-id="${group.id}"
                    >
                        Ver detalles →
                    </button>
                </div>

            </article>
        `;
    }).join("");
}

// ==========================================
// EVENTOS DE LAS TARJETAS
// ==========================================

function attachGroupEvents(container) {
    container.querySelectorAll("[data-group-id]")
        .forEach(button => {
            button.addEventListener("click", () => {
                const groupId = button.dataset.groupId;

                document.dispatchEvent(
                    new CustomEvent("losdataos:open-group", {
                        detail: { groupId }
                    })
                );
            });
        });
}

// ==========================================
// FORMULARIO DE CREACIÓN
// ==========================================

function openCreateGroupModal() {
    const content = `
        <form id="create-group-form">

            <div class="form-group">
                <label for="group-name">Nombre del grupo</label>
                <input
                    type="text"
                    id="group-name"
                    name="name"
                    placeholder="Ej. Viaje de vacaciones"
                    required
                >
            </div>

            <div class="form-group">
                <label for="group-category">Categoría</label>

                <select id="group-category" name="category" required>
                    <option value="General">General</option>
                    <option value="Viajes">Viajes</option>
                    <option value="Gastronomía">Gastronomía</option>
                    <option value="Regalos">Regalos</option>
                    <option value="Entretenimiento">Entretenimiento</option>
                    <option value="Ahorro">Ahorro</option>
                </select>
            </div>

            <div class="form-group">
                <label for="group-description">Descripción</label>

                <textarea
                    id="group-description"
                    name="description"
                    placeholder="Describe el objetivo del grupo"
                    rows="3"
                ></textarea>
            </div>

            <div class="form-group">
                <label for="group-currency">Moneda del grupo</label>

                <select id="group-currency" name="currency">
                    <option value="USD">USD - Dólar estadounidense</option>
                    <option value="ARS">ARS - Peso argentino</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="BRL">BRL - Real brasileño</option>
                </select>
            </div>

            <div class="form-group">
                <label for="contribution-mode">Modalidad de aportación</label>

                <select id="contribution-mode" name="contributionMode">
                    <option value="fixed">Objetivo por integrante</option>
                    <option value="group">Objetivo grupal</option>
                </select>
            </div>

            <div class="form-group">
                <label for="contribution-goal">
                    Objetivo por integrante
                </label>

                <input
                    type="number"
                    id="contribution-goal"
                    name="contributionGoal"
                    min="0"
                    step="0.01"
                    value="100"
                >
            </div>

            <div class="form-group">
                <label for="group-goal">Objetivo total del grupo</label>

                <input
                    type="number"
                    id="group-goal"
                    name="groupGoal"
                    min="0"
                    step="0.01"
                    value="500"
                >
            </div>

            <div class="modal-actions">
                <button
                    type="button"
                    class="btn btn-secondary"
                    id="cancel-create-group"
                >
                    Cancelar
                </button>

                <button
                    type="submit"
                    class="btn btn-primary"
                >
                    Crear grupo
                </button>
            </div>

        </form>
    `;

    const modal = openModal({
        title: "Crear nuevo grupo",
        content,
        size: "medium"
    });

    const form = modal.querySelector("#create-group-form");

    const modeSelect = form.querySelector("#contribution-mode");
    const memberGoal = form.querySelector("#contribution-goal");
    const groupGoal = form.querySelector("#group-goal");

    function updateGoalFields() {
        const isFixed = modeSelect.value === "fixed";

        memberGoal.disabled = !isFixed;
        groupGoal.disabled = isFixed;

        memberGoal.required = isFixed;
        groupGoal.required = !isFixed;
    }

    modeSelect.addEventListener("change", updateGoalFields);
    updateGoalFields();

    modal.querySelector("#cancel-create-group")
        .addEventListener("click", closeModal);

    form.addEventListener("submit", event => {
        event.preventDefault();

        const formData = new FormData(form);

        const data = {
            name: formData.get("name"),
            category: formData.get("category"),
            description: formData.get("description"),
            currency: formData.get("currency"),
            contributionMode: formData.get("contributionMode"),
            contributionGoal: Number(formData.get("contributionGoal")),
            groupGoal: Number(formData.get("groupGoal")),
            administratorId: 1
        };

        try {
            if (
                data.contributionMode === "fixed" &&
                data.contributionGoal <= 0
            ) {
                throw new Error("El objetivo por integrante debe ser mayor que cero.");
            }

            if (
                data.contributionMode === "group" &&
                data.groupGoal <= 0
            ) {
                throw new Error("El objetivo grupal debe ser mayor que cero.");
            }

            createGroup(data);

            closeModal();

            showSuccess("El grupo se creó correctamente.");

            renderGroups();

        } catch (error) {
            showError(error.message);
        }
    });
}
