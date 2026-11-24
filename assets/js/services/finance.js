
// ==========================================
// LOS DATAOS - SERVICIO FINANCIERO
// ==========================================

// Obtener el total aportado por un integrante
export function getMemberPaid(member) {
    return (member.payments || []).reduce(
        (total, payment) => total + Number(payment),
        0
    );
}

// Obtener cuánto le falta aportar a un integrante
export function getMemberPending(member) {
    const goal = Number(member.contributionGoal || 0);
    const paid = getMemberPaid(member);

    return Math.max(goal - paid, 0);
}

// Calcular el porcentaje de aportación de un integrante
export function getMemberProgress(member) {
    const goal = Number(member.contributionGoal || 0);

    if (goal <= 0) return 100;

    const paid = getMemberPaid(member);

    return Math.min((paid / goal) * 100, 100);
}

// Obtener el total recaudado por todos los integrantes
export function getGroupCollected(group) {
    return (group.members || []).reduce(
        (total, member) => total + getMemberPaid(member),
        0
    );
}

// Obtener el objetivo total del grupo
export function getGroupGoal(group) {
    if (group.contributionMode === "group") {
        return Number(group.groupGoal || 0);
    }

    return (group.members || []).reduce(
        (total, member) =>
            total + Number(member.contributionGoal || 0),
        0
    );
}

// Calcular cuánto falta recaudar
export function getGroupPending(group) {
    const goal = getGroupGoal(group);
    const collected = getGroupCollected(group);

    return Math.max(goal - collected, 0);
}

// Calcular el porcentaje de recaudación
export function getGroupProgress(group) {
    const goal = getGroupGoal(group);

    if (goal <= 0) return 0;

    const collected = getGroupCollected(group);

    return Math.min((collected / goal) * 100, 100);
}

// Obtener el total de gastos realizados
export function getGroupSpent(group) {
    return (group.expenses || [])
        .filter(expense =>
            ["Aprobado", "Completado", "Pagado"].includes(expense.status)
        )
        .reduce(
            (total, expense) => total + Number(expense.amount || 0),
            0
        );
}

// Calcular el dinero comprometido en actividades aprobadas
export function getGroupCommitted(group) {
    return (group.outings || [])
        .filter(outing =>
            ["Aprobada", "Aprobado"].includes(outing.approvalStatus)
            && !["Completada", "Cancelada"].includes(outing.status)
        )
        .reduce(
            (total, outing) =>
                total + Number(outing.estimatedCost || 0),
            0
        );
}

// Obtener el resumen del fondo común
export function getGroupFundSummary(group) {
    const collected = getGroupCollected(group);
    const spent = getGroupSpent(group);
    const committed = getGroupCommitted(group);

    const available = Math.max(
        collected - spent - committed,
        0
    );

    return {
        collected,
        spent,
        committed,
        available
    };
}

// Obtener el resumen financiero completo del grupo
export function getGroupFinancialSummary(group) {
    const collected = getGroupCollected(group);
    const goal = getGroupGoal(group);
    const pending = Math.max(goal - collected, 0);
    const progress = getGroupProgress(group);

    const fund = getGroupFundSummary(group);

    return {
        goal,
        collected,
        pending,
        progress,
        spent: fund.spent,
        committed: fund.committed,
        available: fund.available,
        currency: group.currency || "USD",
        currencySymbol: group.currencySymbol || "$"
    };
}

// Calcular la distribución proporcional de un gasto
export function calculateProportionalShare(amount, participants) {
    if (!Array.isArray(participants) || participants.length === 0) {
        return [];
    }

    const total = Number(amount);

    if (!Number.isFinite(total) || total < 0) {
        throw new Error("El importe debe ser un número válido.");
    }

    const baseShare = Math.floor(
        (total / participants.length) * 100
    ) / 100;

    let distributed = 0;

    return participants.map((participant, index) => {
        const share = index === participants.length - 1
            ? Math.round((total - distributed) * 100) / 100
            : baseShare;

        distributed += share;

        return {
            memberId: participant.id,
            memberName: participant.name,
            amount: share
        };
    });
}

// Formatear cantidades monetarias
export function formatMoney(amount, currency = "USD") {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(Number(amount) || 0);
}
