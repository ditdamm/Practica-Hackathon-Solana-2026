
import { escapeHTML } from "./ui.js";

// ==========================================
// LOS DATAOS - COMPONENTES DE GRÁFICOS
// ==========================================

// Crear un gráfico de líneas
export function createLineChart({
    data = [],
    width = 700,
    height = 260,
    color = "#8b5cf6",
    showPoints = true,
    showGrid = true
} = {}) {
    if (!Array.isArray(data) || data.length < 2) {
        return `
            <div class="chart-empty">
                No hay suficientes datos para mostrar el gráfico.
            </div>
        `;
    }

    const padding = {
        top: 20,
        right: 20,
        bottom: 35,
        left: 45
    };

    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const values = data.map(item => Number(item.value));

    if (values.some(value => !Number.isFinite(value))) {
        return `<div class="chart-empty">Los datos del gráfico no son válidos.</div>`;
    }

    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue || 1;

    const points = data.map((item, index) => {
        const x = padding.left +
            (index / (data.length - 1)) * chartWidth;

        const y = padding.top +
            chartHeight -
            ((Number(item.value) - minValue) / range) * chartHeight;

        return {
            x,
            y,
            label: item.label,
            value: Number(item.value)
        };
    });

    const linePath = points.map((point, index) => {
        return `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`;
    }).join(" ");

    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];

    const areaPath = `
        ${linePath}
        L ${lastPoint.x} ${padding.top + chartHeight}
        L ${firstPoint.x} ${padding.top + chartHeight}
        Z
    `;

    const grid = showGrid
        ? [0, 0.25, 0.5, 0.75, 1].map(position => {
            const y = padding.top + chartHeight * position;

            return `
                <line
                    x1="${padding.left}"
                    y1="${y}"
                    x2="${width - padding.right}"
                    y2="${y}"
                    class="chart-grid-line"
                />
            `;
        }).join("")
        : "";

    const pointElements = showPoints
        ? points.map(point => `
            <circle
                cx="${point.x}"
                cy="${point.y}"
                r="4"
                fill="${color}"
                class="chart-point"
            >
                <title>${escapeHTML(point.label)}: ${point.value}</title>
            </circle>
        `).join("")
        : "";

    const labels = points.map(point => `
        <text
            x="${point.x}"
            y="${height - 8}"
            text-anchor="middle"
            class="chart-label"
        >
            ${escapeHTML(point.label)}
        </text>
    `).join("");

    return `
        <div class="chart-wrapper">
            <svg
                viewBox="0 0 ${width} ${height}"
                role="img"
                aria-label="Gráfico de evolución"
                preserveAspectRatio="none"
            >
                <defs>
                    <linearGradient
                        id="chart-gradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                    >
                        <stop offset="0%" stop-color="${color}" stop-opacity="0.30"/>
                        <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
                    </linearGradient>
                </defs>

                ${grid}

                <path
                    d="${areaPath}"
                    fill="url(#chart-gradient)"
                />

                <path
                    d="${linePath}"
                    fill="none"
                    stroke="${color}"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />

                ${pointElements}
                ${labels}
            </svg>
        </div>
    `;
}

// Crear un gráfico de barras
export function createBarChart({
    data = [],
    height = 240,
    color = "#8b5cf6"
} = {}) {
    if (!Array.isArray(data) || data.length === 0) {
        return `
            <div class="chart-empty">
                No hay datos disponibles.
            </div>
        `;
    }

    const values = data.map(item => Number(item.value));

    if (values.some(value => !Number.isFinite(value))) {
        return `<div class="chart-empty">Los datos del gráfico no son válidos.</div>`;
    }

    const maxValue = Math.max(...values, 1);
    const chartHeight = height - 35;
    const barWidth = Math.min(
        48,
        500 / data.length
    );

    const gap = Math.max(
        8,
        (500 - data.length * barWidth) / data.length
    );

    const totalWidth = data.length * (barWidth + gap);

    const bars = data.map((item, index) => {
        const value = Number(item.value);
        const barHeight = (value / maxValue) * chartHeight;
        const x = gap / 2 + index * (barWidth + gap);
        const y = chartHeight - barHeight;

        return `
            <rect
                x="${x}"
                y="${y}"
                width="${barWidth}"
                height="${barHeight}"
                rx="5"
                fill="${color}"
                class="chart-bar"
            >
                <title>${escapeHTML(item.label)}: ${value}</title>
            </rect>

            <text
                x="${x + barWidth / 2}"
                y="${height - 8}"
                text-anchor="middle"
                class="chart-label"
            >
                ${escapeHTML(item.label)}
            </text>
        `;
    }).join("");

    return `
        <div class="chart-wrapper">
            <svg
                viewBox="0 0 ${totalWidth} ${height}"
                role="img"
                aria-label="Gráfico de barras"
            >
                ${bars}
            </svg>
        </div>
    `;
}
