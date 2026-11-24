
import {
    contributions,
    transactions,
    expenses,
    groups
} from "../../data/mock-data.js";

import {
    getGroupById,
    updateGroup
} from "./group-service.js";

import { convertCurrency } from "./currency.js";

let demoContributions = JSON.parse(JSON.stringify(contributions));
let demoTransactions = JSON.parse(JSON.stringify(transactions));
let demoExpenses = JSON.parse(JSON.stringify(expenses));

let demoOutings = JSON.parse(JSON.stringify(
    groups.flatMap(group =>
        (group.outings || []).map(outing => ({
            ...outing,
            groupId: group.id,
            currency: group.currency,
            participants: outing.participants || []
        }))
    )
));

function generateId(prefix, items) {
    const nextNumber = items.length + 1;
    return `${prefix}-${String(nextNumber).padStart(3, "0")}`;
}

function getCurrentDate() {
    return new Date().toISOString();
}

// ==========================================
// CONSULTAS
// ==========================================

export function getTransactions(groupId = null) {
    let result = [...demoTransactions];

    if (groupId !== null) {
        result = result.filter(
            item => item.groupId === Number(groupId)
        );
    }

    return JSON.parse(JSON.stringify(
        result.sort((a, b) => new Date(b.date) - new Date(a.date))
    ));
}

export function getContributions(groupId = null) {
    let result = [...demoContributions];

    if (groupId !== null) {
        result = result.filter(
            item => item.groupId === Number(groupId)
        );
    }

    return JSON.parse(JSON.stringify(result));
}

export function getExpenses(groupId = null) {
    let result = [...demoExpenses];

    if (groupId !== null) {
        result = result.filter(
            item => item.groupId === Number(groupId)
        );
    }

    return JSON.parse(JSON.stringify(result));
}

export function getOutings(groupId = null) {
    let result = [...demoOutings];

    if (groupId !== null) {
        result = result.filter(
            item => item.groupId === Number(groupId)
        );
    }

    return JSON.parse(JSON.stringify(result));
}

// ==========================================
// REGISTRAR APORTACIONES
// ==========================================

export function registerContribution(data) {
    const group = getGroupById(data.groupId);

    if (!group) {
        throw new Error("No se encontró el grupo.");
    }

    const member = group.members.find(
        item => item.id === Number(data.memberId)
    );

    if (!member) {
        throw new Error("No se encontró el integrante.");
    }

    const amount = Number(data.amount);
    const currency = data.currency || group.currency;

    if (!Number.isFinite(amount) || amount <= 0) {
        throw new Error("El importe debe ser mayor que cero.");
    }

    const conversion = convertCurrency(
        amount,
        currency,
        group.currency
    );

    const date = getCurrentDate();

    const contribution = {
        id: demoContributions.length + 1,
        groupId: group.id,
        memberId: member.id,
        memberName: member.name,
        amount: conversion.convertedAmount,
        originalAmount: amount,
        currency,
        groupCurrency: group.currency,
        exchangeRate: conversion.exchangeRate,
        date,
        status: "Completado"
    };

    const transaction = {
        id: generateId("TX", demoTransactions),
        groupId: group.id,
        groupName: group.name,
        memberId: member.id,
        memberName: member.name,
        concept: data.concept || "Aportación al fondo común",
        type: "Aportación",
        amount: conversion.convertedAmount,
        originalAmount: amount,
        originalCurrency: currency,
        exchangeRate: conversion.exchangeRate,
        convertedAmount: conversion.convertedAmount,
        groupCurrency: group.currency,
        date,
        status: "Completado"
    };

    demoContributions.push(contribution);
    demoTransactions.push(transaction);

    const updatedMembers = group.members.map(item => {
        if (item.id === member.id) {
            return {
                ...item,
                payments: [
                    ...(item.payments || []),
                    conversion.convertedAmount
                ]
            };
        }

        return item;
    });

    updateGroup(group.id, {
        members: updatedMembers
    });

    return { contribution, transaction };
}

// ==========================================
// REGISTRAR GASTOS
// ==========================================

export function registerExpense(data) {
    const group = getGroupById(data.groupId);

    if (!group) {
        throw new Error("No se encontró el grupo.");
    }

    const amount = Number(data.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
        throw new Error("El importe debe ser mayor que cero.");
    }

    if (!data.concept || !data.concept.trim()) {
        throw new Error("Debes indicar el concepto del gasto.");
    }

    const currency = data.currency || group.currency;

    const conversion = convertCurrency(
        amount,
        currency,
        group.currency
    );

    const date = getCurrentDate();

    const expense = {
        id: demoExpenses.length + 1,
        groupId: group.id,
        concept: data.concept.trim(),
        description: data.description || "",
        amount: conversion.convertedAmount,
        originalAmount: amount,
        currency,
        groupCurrency: group.currency,
        exchangeRate: conversion.exchangeRate,
        responsibleMemberId: Number(data.memberId),
        responsibleMember: data.memberName || "Integrante",
        paymentMethod: data.paymentMethod || "Fondo común",
        status: "Pendiente",
        date
    };

    demoExpenses.push(expense);

    const transaction = {
        id: generateId("TX", demoTransactions),
        groupId: group.id,
        groupName: group.name,
        memberId: Number(data.memberId),
        memberName: data.memberName || "Integrante",
        concept: expense.concept,
        type: "Gasto",
        amount: conversion.convertedAmount,
        originalAmount: amount,
        originalCurrency: currency,
        exchangeRate: conversion.exchangeRate,
        convertedAmount: conversion.convertedAmount,
        groupCurrency: group.currency,
        date,
        status: "Pendiente"
    };

    demoTransactions.push(transaction);

    return { expense, transaction };
}

// ==========================================
// PROCESAR GASTOS
// ==========================================

function updateExpenseTransaction(expense) {
    const transaction = demoTransactions.find(item =>
        item.groupId === expense.groupId &&
        item.type === "Gasto" &&
        item.concept === expense.concept &&
        item.status === "Pendiente"
    );

    if (transaction) {
        transaction.status = expense.status;
    }
}

export function approveExpense(expenseId) {
    const expense = demoExpenses.find(
        item => item.id === Number(expenseId)
    );

    if (!expense) {
        throw new Error("No se encontró el gasto.");
    }

    if (expense.status !== "Pendiente") {
        throw new Error("El gasto ya fue procesado.");
    }

    expense.status = "Aprobado";

    updateExpenseTransaction(expense);

    return JSON.parse(JSON.stringify(expense));
}

export function rejectExpense(expenseId) {
    const expense = demoExpenses.find(
        item => item.id === Number(expenseId)
    );

    if (!expense) {
        throw new Error("No se encontró el gasto.");
    }

    if (expense.status !== "Pendiente") {
        throw new Error("El gasto ya fue procesado.");
    }

    expense.status = "Rechazado";

    updateExpenseTransaction(expense);

    return JSON.parse(JSON.stringify(expense));
}

// ==========================================
// CREAR ACTIVIDADES
// ==========================================

export function createOuting(data) {
    const group = getGroupById(data.groupId);

    if (!group) {
        throw new Error("No se encontró el grupo.");
    }

    if (!data.name || !data.name.trim()) {
        throw new Error("La actividad debe tener un nombre.");
    }

    if (!data.date) {
        throw new Error("Debes seleccionar una fecha.");
    }

    const estimatedCost = Number(data.estimatedCost);
    const fundraisingTarget = Number(data.fundraisingTarget);

    if (!Number.isFinite(estimatedCost) || estimatedCost <= 0) {
        throw new Error("El presupuesto debe ser mayor que cero.");
    }

    if (!Number.isFinite(fundraisingTarget) || fundraisingTarget <= 0) {
        throw new Error("El objetivo de recaudación debe ser mayor que cero.");
    }

    const participantIds = (data.participants || []).map(Number);

    const validParticipants = group.members
        .filter(member => participantIds.includes(member.id))
        .map(member => member.id);

    if (validParticipants.length === 0) {
        throw new Error("Debes seleccionar al menos un participante.");
    }

    const outing = {
        id: demoOutings.length + 1,
        groupId: group.id,
        name: data.name.trim(),
        description: data.description || "",
        date: data.date,
        estimatedCost,
        fundraisingTarget,
        collected: 0,
        currency: group.currency,
        participants: validParticipants,
        approvalStatus: "Pendiente",
        status: "Pendiente",
        createdAt: getCurrentDate()
    };

    demoOutings.push(outing);

    return JSON.parse(JSON.stringify(outing));
}

// ==========================================
// RESTABLECER DATOS DE DEMOSTRACIÓN
// ==========================================

export function resetTransactions() {
    demoContributions = JSON.parse(JSON.stringify(contributions));
    demoTransactions = JSON.parse(JSON.stringify(transactions));
    demoExpenses = JSON.parse(JSON.stringify(expenses));

    demoOutings = JSON.parse(JSON.stringify(
        groups.flatMap(group =>
            (group.outings || []).map(outing => ({
                ...outing,
                groupId: group.id,
                currency: group.currency,
                participants: outing.participants || []
            }))
        )
    ));
}
