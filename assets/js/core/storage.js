
// Almacenamiento temporal de Los DataOS

const STORAGE_PREFIX = "los-dataos-";

// Guardar información
export function saveData(key, data) {
    try {
        const serializedData = JSON.stringify(data);

        sessionStorage.setItem(
            STORAGE_PREFIX + key,
            serializedData
        );

        return true;

    } catch (error) {
        console.error("Error al guardar los datos:", error);
        return false;
    }
}

// Recuperar información
export function loadData(key, fallback = null) {
    try {
        const storedData = sessionStorage.getItem(
            STORAGE_PREFIX + key
        );

        if (storedData === null) {
            return fallback;
        }

        return JSON.parse(storedData);

    } catch (error) {
        console.error("Error al recuperar los datos:", error);
        return fallback;
    }
}

// Eliminar información específica
export function removeData(key) {
    sessionStorage.removeItem(STORAGE_PREFIX + key);
}

// Eliminar todos los datos de Los DataOS
export function clearStorage() {
    Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith(STORAGE_PREFIX)) {
            sessionStorage.removeItem(key);
        }
    });
}

// Comprobar si existe información guardada
export function hasData(key) {
    return sessionStorage.getItem(STORAGE_PREFIX + key) !== null;
}
