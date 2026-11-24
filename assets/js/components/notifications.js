
import { escapeHTML } from "./ui.js";

// ==========================================
// LOS DATAOS - SISTEMA DE NOTIFICACIONES
// ==========================================

let notificationContainer = null;

// Crear el contenedor de notificaciones
function getNotificationContainer() {
    if (notificationContainer && document.body.contains(notificationContainer)) {
        return notificationContainer;
    }

    notificationContainer = document.createElement("div");

    notificationContainer.className = "notification-container";
    notificationContainer.setAttribute("aria-live", "polite");
    notificationContainer.setAttribute("aria-atomic", "false");

    document.body.appendChild(notificationContainer);

    return notificationContainer;
}

// Mostrar una notificación
export function showNotification({
    title = "Notificación",
    message = "",
    type = "info",
    duration = 4000
} = {}) {
    const container = getNotificationContainer();

    const icons = {
        success: "✓",
        error: "×",
        warning: "!",
        info: "i"
    };

    const notification = document.createElement("div");

    notification.className = `notification notification-${type}`;

    notification.innerHTML = `
        <div class="notification-icon">
            ${icons[type] || icons.info}
        </div>

        <div class="notification-content">
            <strong>${escapeHTML(title)}</strong>
            <p>${escapeHTML(message)}</p>
        </div>

        <button
            type="button"
            class="notification-close"
            aria-label="Cerrar notificación"
        >
            ×
        </button>
    `;

    container.appendChild(notification);

    notification.querySelector(".notification-close")
        .addEventListener("click", () => {
            removeNotification(notification);
        });

    requestAnimationFrame(() => {
        notification.classList.add("notification-visible");
    });

    if (duration > 0) {
        setTimeout(() => {
            removeNotification(notification);
        }, duration);
    }

    return notification;
}

// Eliminar una notificación
function removeNotification(notification) {
    if (!notification || !notification.isConnected) {
        return;
    }

    notification.classList.remove("notification-visible");

    setTimeout(() => {
        notification.remove();
    }, 250);
}

// Notificación de éxito
export function showSuccess(message, title = "Operación exitosa") {
    return showNotification({
        title,
        message,
        type: "success"
    });
}

// Notificación de error
export function showError(message, title = "Ha ocurrido un error") {
    return showNotification({
        title,
        message,
        type: "error",
        duration: 6000
    });
}

// Notificación de advertencia
export function showWarning(message, title = "Atención") {
    return showNotification({
        title,
        message,
        type: "warning"
    });
}

// Notificación informativa
export function showInfo(message, title = "Información") {
    return showNotification({
        title,
        message,
        type: "info"
    });
}

// Eliminar todas las notificaciones
export function clearNotifications() {
    if (!notificationContainer) return;

    notificationContainer.innerHTML = "";
}
