
import { getGroups } from "../services/group-service.js";

import {
    getOutings,
    createOuting
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

import {
    openModal,
    closeModal
} from "../components/modal.js";

import {
    showSuccess,
    showError
} from "../components/notifications.js";

// ==========================================
// LOS DATAOS - MÓDULO DE SALIDAS
// ==========================================

export function renderOutings() {
    const container = document.getElementById("page-content");

    if (!container) return;

    const groups = getGroups();
    const outings = getOutings();

    const fundraising = outings.filter(
        outing => outing.status === "Recaudando"
    ).length;

    const approved = outings.filter(
        outing => outing.approvalStatus === "Aprobada"
    ).length;

    container.innerHTML = `
        <div class="outings-page">

            <section class="welcome-section">
                <div>
                    <span class="welcome-eyebrow">
                        ORGANIZACIÓN COLECTIVA
                    </span>

                    <h2>Salidas y actividades</h2>

                    <p>
                        Organiza encuentros, viajes y actividades
                        financiadas mediante fondos grupales.
                    </p>
                </div>

                <button
                    class="btn btn-primary"
                    id="create-outing-button"
                    ${groups.length === 0 ? "disabled" : ""}
                >
                    + Crear actividad
                </button>
            </section>

            <div class="stats-grid">

                <article class="stat-card">
                    <div class="stat-card-content">
                        <p class="stat-title">Actividades registradas</p>
                        <h3 class="stat-value">${outings.length}</h3>
                        <span class="stat-description">
                            Total de actividades
                        </span>
                    </div>
                </article>

                <article class="stat-card">
                    <div class="stat-card-content">
                        <p class="stat-title">Recaudando</p>
                        <h3 class="stat-value">${fundraising}</h3>
                        <span class="stat-description">
                            Reuniendo fondos
                        </span>
                    </div>
                </article>

                <article class="stat-card">
                    <div class="stat-card-content">
                        <p class="stat-title">Aprobadas</p>
                        <h3 class="stat-value">${approved}</h3>
                        <span class="stat-description">
                            Actividades autorizadas
                        </span>
                    </div>
                </article>

            </div>

            <section class="dashboard-section">

                ${createSectionHeader({
                    title: "Actividades de los grupos",
                    description: "Consulta el presupuesto y la recaudación"
                })}

                <div class="outings-grid">
                    ${renderOutingCards(outings, groups)}
                </div>

            </section>

        </div>
    `;

    document.getElementById("create-outing-button")
        ?.addEventListener("click", openCreateOutingModal);
}

// ==========================================
// TARJETAS DE ACTIVIDADES
// ==========================================

function renderOutingCards(outings, groups) {
    if (outings.length === 0) {
        return createEmptyState({
            title: "No hay actividades registradas",
            description: "Crea una actividad para comenzar a organizar tu próximo encuentro."
        });
    }

    const ordered = [...outings].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
    );

    return ordered.map(outing => {
        const group = groups.find(
            item => item.id === outing.groupId
        );

        const currency = outing.currency ||
            group?.currency ||
            "USD";

        const target = Number(outing.fundraisingTarget || outing.estimatedCost || 0);
        const collected = Number(outing.collected || 0);

        const progress = target > 0
            ? Math.min((collected / target) * 100, 100)
            : 0;

        return `
            <article class="outing-card">

                <div class="outing-card-header">
                    <span class="group-category">
                        ${escapeHTML(group?.name || "Grupo")}
                    </span>

                    ${createStatusBadge(outing.status)}
                </div>

                <h3>${escapeHTML(outing.name)}</h3>

                <p>${escapeHTML(outing.description || "")}</p>

                <div class="outing-date">
                    <span>Fecha programada</span>
                    <strong>
                        ${new Date(`${outing.date}T12:00:00`).toLocaleDateString("es-AR")}
                    </strong>
                </div>

                <div class="outing-finances">
                    <div>
                        <span>Presupuesto</span>
                        <strong>
                            ${formatMoney(target, currency)}
                        </strong>
                    </div>

                    <div>
                        <span>Recaudado</span>
                        <strong>
                            ${formatMoney(collected, currency)}
                        </strong>
                    </div>

                    <div>
                        <span>Faltante</span>
                        <strong>
                            ${formatMoney(
                                Math.max(target - collected, 0),
                                currency
                            )}
                        </strong>
                    </div>
                </div>

                <div class="outing-progress">
                    <div class="progress-header">
                        <span>Progreso de recaudación</span>
                        <strong>${progress.toFixed(0)}%</strong>
                    </div>

                    <div class="progress-track">
                        <div
                            class="progress-fill"
                            style="width: ${progress}%"
                        ></div>
                    </div>
                </div>

                <div class="outing-card-footer">
                    <span>
                        ${outing.participants?.length || 0} participantes
                    </span>

                    ${createStatusBadge(
                        outing.approvalStatus || "Pendiente"
                    )}
                </div>

            </article>
        `;
    }).join("");
}

// ==========================================
// FORMULARIO PARA CREAR ACTIVIDADES
// ==========================================

function openCreateOutingModal() {
    const groups = getGroups();

    if (groups.length === 0) {
        showError("Primero debes crear un grupo.");
        return;
    }

    const content = `
        <form id="create-outing-form">

            <div class="form-group">
                <label for="outing-group">Grupo organizador</label>

                <select
                    id="outing-group"
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
                <label for="outing-name">Nombre de la actividad</label>

                <input
                    type="text"
                    id="outing-name"
                    name="name"
                    placeholder="Ej. Cena de fin de año"
                    required
                >
            </div>

            <div class="form-group">
                <label for="outing-description">Descripción</label>

                <textarea
                    id="outing-description"
                    name="description"
                    rows="3"
                    placeholder="Describe la actividad"
                ></textarea>
            </div>

            <div class="form-group">
                <label for="outing-date">Fecha programada</label>

                <input
                    type="date"
                    id="outing-date"
                    name="date"
                    required
                    min="${new Date().toISOString().split("T")[0]}"
                >
            </div>

            <div class="form-group">
                <label for="outing-budget">Presupuesto estimado</label>

                <input
                    type="number"
                    id="outing-budget"
                    name="estimatedCost"
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    required
                >
            </div>

            <div class="form-group">
                <label for="outing-target">Objetivo de recaudación</label>

                <input
                    type="number"
                    id="outing-target"
                    name="fundraisingTarget"
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    required
                >
            </div>

            <div class="form-group">
                <label>Participantes</label>

                <div id="outing-participants" class="checkbox-list"></div>
            </div>

            <div class="modal-actions">
                <button
                    type="button"
                    class="btn btn-secondary"
                    id="cancel-outing"
                >
                    Cancelar
                </button>

                <button type="submit" class="btn btn-primary">
                    Crear actividad
                </button>
            </div>

        </form>
    `;

    const modal = openModal({
        title: "Crear actividad",
        content,
        size: "large"
    });

    const form = modal.querySelector("#create-outing-form");
    const groupSelect = form.querySelector("#outing-group");
    const participantsContainer = form.querySelector("#outing-participants");
    const budgetInput = form.querySelector("#outing-budget");
    const targetInput = form.querySelector("#outing-target");

    // Seleccionar integrantes según el grupo
    function updateParticipants() {
        const group = groups.find(
            item => item.id === Number(groupSelect.value)
        );

        if (!group) return;

        participantsContainer.innerHTML = group.members.map(member => `
            <label class="checkbox-item">
                <input
                    type="checkbox"
                    name="participants"
                    value="${member.id}"
                    checked
                >

                <span>${escapeHTML(member.name)}</span>
            </label>
        `).join("");

        if (group.members.length === 0) {
            participantsContainer.innerHTML = `
                <p>Este grupo todavía no tiene integrantes.</p>
            `;
        }
    }

    groupSelect.addEventListener("change", updateParticipants);

    budgetInput.addEventListener("input", () => {
        if (!targetInput.dataset.manuallyEdited) {
            targetInput.value = budgetInput.value;
        }
    });

    targetInput.addEventListener("input", () => {
        targetInput.dataset.manuallyEdited = "true";
    });

    updateParticipants();

    modal.querySelector("#cancel-outing")
        .addEventListener("click", closeModal);

    form.addEventListener("submit", event => {
        event.preventDefault();

        const formData = new FormData(form);

        const group = groups.find(
            item => item.id === Number(formData.get("groupId"))
        );

        const participantIds = formData.getAll("participants")
            .map(Number);

        if (!group || participantIds.length === 0) {
            showError("Selecciona al menos un participante.");
            return;
        }

        const participants = group.members
            .filter(member => participantIds.includes(member.id))
            .map(member => member.id);

        const estimatedCost = Number(formData.get("estimatedCost"));
        const fundraisingTarget = Number(formData.get("fundraisingTarget"));

        if (
            !Number.isFinite(estimatedCost) ||
            estimatedCost <= 0 ||
            !Number.isFinite(fundraisingTarget) ||
            fundraisingTarget <= 0
        ) {
            showError("Los importes deben ser mayores que cero.");
            return;
        }

        try {
            createOuting({
                groupId: group.id,
                name: formData.get("name"),
                description: formData.get("description"),
                date: formData.get("date"),
                estimatedCost,
                fundraisingTarget,
                participants
            });

            closeModal();

            showSuccess(
                "La actividad se creó correctamente y quedó pendiente de aprobación."
            );

            renderOutings();

        } catch (error) {
            showError(error.message);
        }
    });
}
