
// Estado general de Los DataOS

let appState = {};

const listeners = new Set();

// Crear una copia independiente de los datos
function cloneData(data) {
    return JSON.parse(JSON.stringify(data));
}

// Inicializar el estado de la aplicación
export function initializeState(initialData = {}) {
    appState = cloneData(initialData);

    notifyListeners();

    return getState();
}

// Obtener todos los datos
export function getState() {
    return cloneData(appState);
}

// Actualizar el estado completo
export function setState(newState) {
    appState = cloneData(newState);

    notifyListeners();
}

// Actualizar una parte del estado
export function updateState(updater) {
    const currentState = getState();

    const updatedState = updater(currentState);

    if (updatedState !== undefined) {
        setState(updatedState);
    }

    return getState();
}

// Escuchar cambios en el estado
export function subscribe(listener) {
    listeners.add(listener);

    return () => {
        listeners.delete(listener);
    };
}

// Notificar a los módulos cuando cambian los datos
function notifyListeners() {
    listeners.forEach(listener => {
        listener(getState());
    });
}

// Restablecer el estado
export function resetState(initialData = {}) {
    initializeState(initialData);
}
