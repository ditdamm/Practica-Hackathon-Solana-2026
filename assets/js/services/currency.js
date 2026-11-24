
import { currencies } from "../../data/mock-data.js";

// ==========================================
// LOS DATAOS - SERVICIO DE MONEDAS
// ==========================================

// Tasas de cambio simuladas.
// Representan cuántas unidades de cada moneda equivalen a 1 USD.

const exchangeRates = {
    USD: 1,
    ARS: 1450,
    EUR: 0.92,
    BRL: 5.35
};

// Obtener información de una moneda
export function getCurrencyInfo(code) {
    return currencies.find(
        currency => currency.code === code
    ) || currencies[0];
}

// Obtener símbolo de una moneda
export function getCurrencySymbol(code) {
    return getCurrencyInfo(code).symbol;
}

// Obtener tasa de cambio
export function getExchangeRate(fromCurrency, toCurrency) {
    if (
        !exchangeRates[fromCurrency] ||
        !exchangeRates[toCurrency]
    ) {
        throw new Error("Moneda no disponible.");
    }

    return exchangeRates[toCurrency] / exchangeRates[fromCurrency];
}

// Convertir un importe entre monedas
export function convertCurrency(
    amount,
    fromCurrency,
    toCurrency
) {
    const value = Number(amount);

    if (!Number.isFinite(value) || value < 0) {
        throw new Error("El importe debe ser un número válido.");
    }

    if (fromCurrency === toCurrency) {
        return {
            originalAmount: value,
            originalCurrency: fromCurrency,
            convertedAmount: value,
            targetCurrency: toCurrency,
            exchangeRate: 1
        };
    }

    const rate = getExchangeRate(
        fromCurrency,
        toCurrency
    );

    const convertedAmount = Number(
        (value * rate).toFixed(2)
    );

    return {
        originalAmount: value,
        originalCurrency: fromCurrency,
        convertedAmount,
        targetCurrency: toCurrency,
        exchangeRate: rate
    };
}

// Formatear una cantidad según su moneda
export function formatCurrency(amount, currency = "USD") {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(Number(amount) || 0);
}

// Obtener todas las monedas disponibles
export function getAvailableCurrencies() {
    return [...currencies];
}

// Obtener las tasas de cambio simuladas
export function getExchangeRates() {
    return { ...exchangeRates };
}
