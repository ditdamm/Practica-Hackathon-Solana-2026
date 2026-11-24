
import { escapeHTML } from "./ui.js";

// ==========================================
// LOS DATAOS - SISTEMA DE VENTANAS MODALES
// ==========================================

let activeModal = null;

// Crear una ventana modal
export function openModal({
    title = "",
    content = "",
    size = "medium",
    showCloseButton = true,
    onClose = null
} = {}) {
    closeModal();

    const modal = document.createElement("div");

    modal.className = "modal-overlay";

    modal.innerHTML = `
        <div
            class="modal-container modal-${escapeHTML(size)}"
            role="dialog"
            aria-modal="true"
            aria-label="${escapeHTML(title)}"
        >
            <div class="modal-header">
                <h2>${escapeHTML(title)}</h2>

                ${showCloseButton ? `
                    <button
                        type="button"
                        class="modal-close"
                        aria-label="Cerrar ventana"
                    >
                        ×
                    </button>
                ` : ""}
            </div>

            <div class="modal-body">
                ${content}
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    activeModal = modal;

    // Cerrar con el botón
    const closeButton = modal.querySelector(".modal-close");

    if (closeButton) {
        closeButton.addEventListener("click", closeModal);
    }

    // Cerrar al hacer clic fuera del contenido
    modal.addEventListener("click", event => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Cerrar con Escape
    document.addEventListener("keydown", handleEscape);

    // Animación de entrada
    requestAnimationFrame(() => {
        modal.classList.add("modal-visible");
    });

    return modal;
}

// Cerrar la ventana modal
export function closeModal() {
    if (!activeModal) return;

    const modal = activeModal;

    activeModal = null;

    document.removeEventListener("keydown", handleEscape);

    modal.classList.remove("modal-visible");

    modal.remove();

    if (typeof modal.onClose === "function") {
        modal.onClose();
    }
}

// Manejar la tecla Escape
function handleEscape(event) {
    if (event.key === "Escape") {
        closeModal();
    }
}

// Comprobar si hay una ventana abierta
export function isModalOpen() {
    return activeModal !== null;
}

// Mostrar una confirmación
export function confirmModal({
    title = "Confirmar acción",
    message = "¿Deseas continuar?",
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    onConfirm = null
} = {}) {
    const content = `
        <div class="confirm-modal-content">
            <p>${escapeHTML(message)}</p>

            <div class="modal-actions">
                <button
                    type="button"
                    class="btn btn-secondary"
                    data-modal-cancel
                >
                    ${escapeHTML(cancelText)}
                </button>

                <button
                    type="button"
                    class="btn btn-primary"
                    data-modal-confirm
                >
                    ${escapeHTML(confirmText)}
                </button>
            </div>
        </div>
    `;

    const modal = openModal({
        title,
        content,
        size: "small"
    });

    modal.querySelector("[data-modal-cancel]")
        .addEventListener("click", closeModal);

    modal.querySelector("[data-modal-confirm]")
        .addEventListener("click", () => {
            closeModal();

            if (typeof onConfirm === "function") {
                onConfirm();
            }
        });

    return modal;
}
