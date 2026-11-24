
/* ==========================================
   LOS DATAOS - DATOS SIMULADOS
   ========================================== */

// ==========================================
// INFORMACIÓN DEL MERCADO
// ==========================================

export const marketData = {
    solana: {
        name: "Solana",
        symbol: "SOL",
        price: 185.42,
        change24h: 5.28,
        marketCap: 87500000000,
        volume24h: 3250000000,
        circulatingSupply: 472000000
    }
};

export const priceHistory = [
    { date: "Lun", price: 172 },
    { date: "Mar", price: 175 },
    { date: "Mié", price: 169 },
    { date: "Jue", price: 178 },
    { date: "Vie", price: 181 },
    { date: "Sáb", price: 176 },
    { date: "Dom", price: 185.42 }
];

// ==========================================
// USUARIO DEMOSTRATIVO
// ==========================================

export const currentUser = {
    id: 1,
    name: "Carlos",
    email: "carlos@losdataos.demo",
    avatar: "C"
};

// ==========================================
// GRUPOS
// ==========================================

export const groups = [
    {
        id: 1,
        name: "Cena de amigos",
        category: "Gastronomía",
        description: "Fondo común para organizar cenas y encuentros.",
        currency: "USD",
        currencySymbol: "$",
        administratorId: 1,
        createdAt: "2026-11-01",
        status: "En progreso",

        contributionMode: "fixed",
        contributionGoal: 100,
        groupGoal: 500,

        members: [
            {
                id: 1,
                name: "Carlos",
                role: "Administrador",
                contributionGoal: 100,
                payments: [30, 30],
                status: "Activo"
            },
            {
                id: 2,
                name: "María",
                role: "Integrante",
                contributionGoal: 100,
                payments: [50, 50],
                status: "Activo"
            },
            {
                id: 3,
                name: "Andrés",
                role: "Integrante",
                contributionGoal: 100,
                payments: [30],
                status: "Activo"
            },
            {
                id: 4,
                name: "Lucía",
                role: "Integrante",
                contributionGoal: 100,
                payments: [100],
                status: "Activo"
            },
            {
                id: 5,
                name: "Pedro",
                role: "Integrante",
                contributionGoal: 100,
                payments: [20, 30],
                status: "Activo"
            }
        ],

        fundBalance: 340,

        commonFund: {
            collected: 340,
            committed: 0,
            available: 340,
            spent: 0
        },

        outings: [
            {
                id: 1,
                name: "Cena de noviembre",
                description: "Encuentro mensual del grupo.",
                date: "2026-11-28",
                estimatedCost: 350,
                actualCost: 0,
                fundraisingTarget: 350,
                collected: 340,
                pendingAmount: 10,
                participants: [1, 2, 3, 4, 5],
                status: "Recaudando",
                approvalStatus: "Aprobada"
            }
        ],

        expenses: [],

        statusDetail: "Recaudando aportaciones"
    },

    {
        id: 2,
        name: "Viaje a la costa",
        category: "Viajes",
        description: "Ahorro colectivo para un viaje de fin de semana.",
        currency: "USD",
        currencySymbol: "$",
        administratorId: 2,
        createdAt: "2026-10-15",
        status: "En progreso",

        contributionMode: "group",
        contributionGoal: 200,
        groupGoal: 1000,

        members: [
            {
                id: 2,
                name: "María",
                role: "Administrador",
                contributionGoal: 200,
                payments: [100],
                status: "Activo"
            },
            {
                id: 6,
                name: "Sofía",
                role: "Integrante",
                contributionGoal: 200,
                payments: [150],
                status: "Activo"
            },
            {
                id: 7,
                name: "Diego",
                role: "Integrante",
                contributionGoal: 200,
                payments: [200],
                status: "Activo"
            },
            {
                id: 8,
                name: "Valentina",
                role: "Integrante",
                contributionGoal: 200,
                payments: [100],
                status: "Activo"
            },
            {
                id: 9,
                name: "Mateo",
                role: "Integrante",
                contributionGoal: 200,
                payments: [100],
                status: "Activo"
            }
        ],

        fundBalance: 650,

        commonFund: {
            collected: 650,
            committed: 0,
            available: 650,
            spent: 0
        },

        outings: [],
        expenses: [],

        statusDetail: "Ahorro en progreso"
    },

    {
        id: 3,
        name: "Regalo grupal",
        category: "Regalos",
        description: "Organización de un regalo compartido.",
        currency: "USD",
        currencySymbol: "$",
        administratorId: 3,
        createdAt: "2026-11-10",
        status: "En progreso",

        contributionMode: "fixed",
        contributionGoal: 50,
        groupGoal: 200,

        members: [
            {
                id: 3,
                name: "Andrés",
                role: "Administrador",
                contributionGoal: 50,
                payments: [50],
                status: "Activo"
            },
            {
                id: 10,
                name: "Camila",
                role: "Integrante",
                contributionGoal: 50,
                payments: [50],
                status: "Activo"
            },
            {
                id: 11,
                name: "Joaquín",
                role: "Integrante",
                contributionGoal: 50,
                payments: [25],
                status: "Activo"
            },
            {
                id: 12,
                name: "Martina",
                role: "Integrante",
                contributionGoal: 50,
                payments: [],
                status: "Activo"
            }
        ],

        fundBalance: 125,

        commonFund: {
            collected: 125,
            committed: 0,
            available: 125,
            spent: 0
        },

        outings: [],
        expenses: [],

        statusDetail: "Aportaciones pendientes"
    },

    {
        id: 4,
        name: "Salida del viernes",
        category: "Entretenimiento",
        description: "Fondo para actividades recreativas.",
        currency: "ARS",
        currencySymbol: "$",
        administratorId: 4,
        createdAt: "2026-11-12",
        status: "En progreso",

        contributionMode: "fixed",
        contributionGoal: 15000,
        groupGoal: 60000,

        members: [
            {
                id: 4,
                name: "Lucía",
                role: "Administrador",
                contributionGoal: 15000,
                payments: [15000],
                status: "Activo"
            },
            {
                id: 13,
                name: "Tomás",
                role: "Integrante",
                contributionGoal: 15000,
                payments: [10000],
                status: "Activo"
            },
            {
                id: 14,
                name: "Julieta",
                role: "Integrante",
                contributionGoal: 15000,
                payments: [15000],
                status: "Activo"
            },
            {
                id: 15,
                name: "Nicolás",
                role: "Integrante",
                contributionGoal: 15000,
                payments: [5000],
                status: "Activo"
            }
        ],

        fundBalance: 45000,

        commonFund: {
            collected: 45000,
            committed: 0,
            available: 45000,
            spent: 0
        },

        outings: [],
        expenses: [],

        statusDetail: "Ahorro en progreso"
    }
];

// ==========================================
// APORTACIONES
// ==========================================

export const contributions = [
    {
        id: 1,
        groupId: 1,
        memberId: 1,
        memberName: "Carlos",
        amount: 30,
        currency: "USD",
        date: "2026-11-18",
        status: "Completado"
    },
    {
        id: 2,
        groupId: 1,
        memberId: 1,
        memberName: "Carlos",
        amount: 30,
        currency: "USD",
        date: "2026-11-20",
        status: "Completado"
    },
    {
        id: 3,
        groupId: 1,
        memberId: 2,
        memberName: "María",
        amount: 50,
        currency: "USD",
        date: "2026-11-17",
        status: "Completado"
    },
    {
        id: 4,
        groupId: 1,
        memberId: 2,
        memberName: "María",
        amount: 50,
        currency: "USD",
        date: "2026-11-21",
        status: "Completado"
    },
    {
        id: 5,
        groupId: 1,
        memberId: 3,
        memberName: "Andrés",
        amount: 30,
        currency: "USD",
        date: "2026-11-19",
        status: "Completado"
    },
    {
        id: 6,
        groupId: 1,
        memberId: 4,
        memberName: "Lucía",
        amount: 100,
        currency: "USD",
        date: "2026-11-20",
        status: "Completado"
    },
    {
        id: 7,
        groupId: 1,
        memberId: 5,
        memberName: "Pedro",
        amount: 50,
        currency: "USD",
        date: "2026-11-22",
        status: "Completado"
    }
];

// ==========================================
// GASTOS
// ==========================================

export const expenses = [
    {
        id: 1,
        groupId: 2,
        concept: "Reserva de alojamiento",
        description: "Pago anticipado del alojamiento.",
        amount: 120,
        currency: "USD",
        responsibleMemberId: 2,
        responsibleMember: "María",
        paymentMethod: "Fondo común",
        status: "Aprobado",
        date: "2026-11-20"
    }
];

// ==========================================
// APROBACIONES
// ==========================================

export const approvals = [
    {
        id: 1,
        groupId: 2,
        type: "Gasto",
        referenceId: 1,
        title: "Reserva de alojamiento",
        amount: 120,
        currency: "USD",
        status: "Aprobado",
        votes: [
            { memberId: 2, memberName: "María", vote: "Aprobar" },
            { memberId: 6, memberName: "Sofía", vote: "Aprobar" },
            { memberId: 7, memberName: "Diego", vote: "Aprobar" },
            { memberId: 8, memberName: "Valentina", vote: "Aprobar" },
            { memberId: 9, memberName: "Mateo", vote: "Aprobar" }
        ]
    }
];

// ==========================================
// TRANSACCIONES
// ==========================================

export const transactions = [
    {
        id: "TX-001",
        groupId: 1,
        groupName: "Cena de amigos",
        memberId: 1,
        memberName: "Carlos",
        concept: "Primera aportación",
        type: "Aportación",
        amount: 30,
        originalAmount: 30,
        originalCurrency: "USD",
        exchangeRate: 1,
        convertedAmount: 30,
        groupCurrency: "USD",
        date: "2026-11-18",
        status: "Completado"
    },
    {
        id: "TX-002",
        groupId: 1,
        groupName: "Cena de amigos",
        memberId: 2,
        memberName: "María",
        concept: "Primera aportación",
        type: "Aportación",
        amount: 50,
        originalAmount: 50,
        originalCurrency: "USD",
        exchangeRate: 1,
        convertedAmount: 50,
        groupCurrency: "USD",
        date: "2026-11-17",
        status: "Completado"
    },
    {
        id: "TX-003",
        groupId: 2,
        groupName: "Viaje a la costa",
        memberId: 2,
        memberName: "María",
        concept: "Reserva de alojamiento",
        type: "Gasto",
        amount: 120,
        originalAmount: 120,
        originalCurrency: "USD",
        exchangeRate: 1,
        convertedAmount: 120,
        groupCurrency: "USD",
        date: "2026-11-20",
        status: "Aprobado"
    }
];

// ==========================================
// PAGOS RECIENTES DEL DASHBOARD
// ==========================================

export const recentPayments = [
    {
        person: "Carlos",
        group: "Cena de amigos",
        amount: 30,
        status: "Completado"
    },
    {
        person: "María",
        group: "Viaje a la costa",
        amount: 100,
        status: "Completado"
    },
    {
        person: "Andrés",
        group: "Regalo grupal",
        amount: 25,
        status: "Pendiente"
    },
    {
        person: "Lucía",
        group: "Salida del viernes",
        amount: 15000,
        status: "Completado"
    }
];

// ==========================================
// INDICADORES GENERALES
// ==========================================

export const dashboardData = {
    activeGroups: 4,
    totalManaged: 1160,
    pendingPayments: 375,
    completedPayments: 18
};

// ==========================================
// TIPOS DE MONEDA
// ==========================================

export const currencies = [
    {
        code: "USD",
        name: "Dólar estadounidense",
        symbol: "$"
    },
    {
        code: "ARS",
        name: "Peso argentino",
        symbol: "$"
    },
    {
        code: "EUR",
        name: "Euro",
        symbol: "€"
    },
    {
        code: "BRL",
        name: "Real brasileño",
        symbol: "R$"
    }
];
