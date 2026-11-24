
import { groups } from "../../data/mock-data.js";

// ==========================================
// LOS DATAOS - SERVICIO DE GRUPOS
// ==========================================

// Copia independiente para trabajar con datos simulados
let demoGroups = JSON.parse(JSON.stringify(groups));

// Generar identificadores
function getNextGroupId() {
    return demoGroups.length > 0
        ? Math.max(...demoGroups.map(group => group.id)) + 1
        : 1;
}

function getNextMemberId() {
    const memberIds = demoGroups.flatMap(group =>
        (group.members || []).map(member => member.id)
    );

    return memberIds.length > 0
        ? Math.max(...memberIds) + 1
        : 1;
}

// Obtener todos los grupos
export function getGroups() {
    return JSON.parse(JSON.stringify(demoGroups));
}

// Obtener un grupo por su identificador
export function getGroupById(groupId) {
    const group = demoGroups.find(
        item => item.id === Number(groupId)
    );

    return group
        ? JSON.parse(JSON.stringify(group))
        : null;
}

// Crear un grupo
export function createGroup(data) {
    if (!data.name || !data.name.trim()) {
        throw new Error("El grupo debe tener un nombre.");
    }

    const currency = data.currency || "USD";

    const newGroup = {
        id: getNextGroupId(),
        name: data.name.trim(),
        category: data.category || "General",
        description: data.description || "",
        currency,
        currencySymbol: data.currencySymbol || "$",
        administratorId: data.administratorId || 1,
        createdAt: new Date().toISOString().slice(0, 10),
        status: "En progreso",

        contributionMode: data.contributionMode || "fixed",
        contributionGoal: Number(data.contributionGoal || 0),
        groupGoal: Number(data.groupGoal || 0),

        members: [],
        fundBalance: 0,

        commonFund: {
            collected: 0,
            committed: 0,
            available: 0,
            spent: 0
        },

        outings: [],
        expenses: [],

        statusDetail: "Grupo recién creado"
    };

    demoGroups.push(newGroup);

    return JSON.parse(JSON.stringify(newGroup));
}

// Agregar un integrante
export function addMember(groupId, memberData) {
    const group = demoGroups.find(
        item => item.id === Number(groupId)
    );

    if (!group) {
        throw new Error("No se encontró el grupo.");
    }

    if (!memberData.name || !memberData.name.trim()) {
        throw new Error("El integrante debe tener un nombre.");
    }

    const newMember = {
        id: getNextMemberId(),
        name: memberData.name.trim(),
        role: "Integrante",
        contributionGoal: Number(
            memberData.contributionGoal ??
            group.contributionGoal ??
            0
        ),
        payments: [],
        status: "Activo"
    };

    group.members.push(newMember);

    // Si el objetivo es por integrante, actualizar
    // el objetivo total del grupo.
    if (group.contributionMode === "fixed") {
        group.groupGoal = group.members.reduce(
            (total, member) =>
                total + Number(member.contributionGoal || 0),
            0
        );
    }

    return JSON.parse(JSON.stringify(newMember));
}

// Modificar información de un grupo
export function updateGroup(groupId, changes) {
    const group = demoGroups.find(
        item => item.id === Number(groupId)
    );

    if (!group) {
        throw new Error("No se encontró el grupo.");
    }

    Object.assign(group, changes);

    return JSON.parse(JSON.stringify(group));
}

// Eliminar un grupo
export function deleteGroup(groupId) {
    const initialLength = demoGroups.length;

    demoGroups = demoGroups.filter(
        group => group.id !== Number(groupId)
    );

    return demoGroups.length < initialLength;
}

// Restablecer los grupos de demostración
export function resetGroups() {
    demoGroups = JSON.parse(JSON.stringify(groups));

    return getGroups();
}
