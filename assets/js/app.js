
import { initializeRouter } from "./core/router.js";

const app = document.getElementById("app");

// ==========================================
// ESTRUCTURA PRINCIPAL DE LOS DATAOS
// ==========================================

app.innerHTML = `
    <div class="app-layout">

        <aside class="sidebar">

            <div class="brand">
                <div class="brand-icon">D</div>

                <div>
                    <h2>Los DataOS</h2>
                    <span>Financial ecosystem</span>
                </div>
            </div>

            <nav class="sidebar-nav">

                <span class="nav-label">GENERAL</span>

                <button class="nav-item active" data-page="overview">
                    <span class="nav-icon">▦</span>
                    Resumen
                </button>

                <button class="nav-item" data-page="groups">
                    <span class="nav-icon">◉</span>
                    Mis grupos
                </button>

                <span class="nav-label">GESTIÓN FINANCIERA</span>

                <button class="nav-item" data-page="contributions">
                    <span class="nav-icon">↗</span>
                    Aportaciones
                </button>

                <button class="nav-item" data-page="expenses">
                    <span class="nav-icon">↘</span>
                    Gastos
                </button>

                <button class="nav-item" data-page="approvals">
                    <span class="nav-icon">✓</span>
                    Aprobaciones
                </button>

                <button class="nav-item" data-page="fund">
                    <span class="nav-icon">◈</span>
                    Fondo común
                </button>

                <button class="nav-item" data-page="outings">
                    <span class="nav-icon">⌖</span>
                    Salidas y actividades
                </button>

                <button class="nav-item" data-page="transactions">
                    <span class="nav-icon">⇄</span>
                    Transacciones
                </button>

                <span class="nav-label">ECOSISTEMA</span>

                <button class="nav-item" data-page="solana">
                    <span class="nav-icon">◎</span>
                    Solana
                </button>

            </nav>

            <div class="sidebar-footer">
                <span class="status-dot"></span>
                Demo mode activo
            </div>

        </aside>

        <main class="main-content">

            <header class="topbar">

                <div class="topbar-heading">
                    <h1 id="page-title">Resumen</h1>
                    <p>Bienvenido a tu centro financiero</p>
                </div>

                <div class="topbar-right">

                    <span class="demo-badge">
                        DATOS SIMULADOS
                    </span>

                    <div class="user-avatar">
                        D
                    </div>

                </div>

            </header>

            <section
                id="page-content"
                class="page-content"
            ></section>

        </main>

    </div>
`;

// ==========================================
// INICIALIZAR APLICACIÓN
// ==========================================

initializeRouter();
