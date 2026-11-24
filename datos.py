# ==========================================
# LOS DATAOS - DATOS SIMULADOS EN ESPAÑOL

mercado = {
    "solana": {
        "nombre": "Solana",
        "simbolo": "SOL",
        "precio": 185.42,
        "cambio_24h": 5.28,
        "capitalizacion": 87500000000,
        "volumen_24h": 3250000000,
        "oferta_circulante": 472000000
    }
}

historial_precios = [
    {"dia": "Lun", "precio": 172},
    {"dia": "Mar", "precio": 175},
    {"dia": "Mié", "precio": 169},
    {"dia": "Jue", "precio": 178},
    {"dia": "Vie", "precio": 181},
    {"dia": "Sáb", "precio": 176},
    {"dia": "Dom", "precio": 185.42}
]

usuario_actual = {
    "id": 1,
    "nombre": "Carlos",
    "correo": "carlos@losdataos.demo",
    "inicial": "C"
}

grupos = [
    {
        "id": 1,
        "nombre": "Cena de amigos",
        "categoria": "Gastronomía",
        "descripcion": "Fondo común para organizar cenas y encuentros.",
        "moneda": "USD",
        "simbolo": "$",
        "estado": "En progreso",
        "meta_individual": 100,
        "meta_grupo": 500,
        "recaudado": 340,
        "integrantes": [
            {"nombre": "Carlos", "rol": "Administrador", "aportado": 60, "meta": 100, "estado": "Activo"},
            {"nombre": "María", "rol": "Integrante", "aportado": 100, "meta": 100, "estado": "Activo"},
            {"nombre": "Andrés", "rol": "Integrante", "aportado": 30, "meta": 100, "estado": "Activo"},
            {"nombre": "Lucía", "rol": "Integrante", "aportado": 100, "meta": 100, "estado": "Activo"},
            {"nombre": "Pedro", "rol": "Integrante", "aportado": 50, "meta": 100, "estado": "Activo"},
        ]
    },
    {
        "id": 2,
        "nombre": "Viaje a la costa",
        "categoria": "Viajes",
        "descripcion": "Ahorro colectivo para un viaje de fin de semana.",
        "moneda": "USD",
        "simbolo": "$",
        "estado": "En progreso",
        "meta_individual": 200,
        "meta_grupo": 1000,
        "recaudado": 650,
        "integrantes": [
            {"nombre": "María", "rol": "Administrador", "aportado": 100, "meta": 200, "estado": "Activo"},
            {"nombre": "Sofía", "rol": "Integrante", "aportado": 150, "meta": 200, "estado": "Activo"},
            {"nombre": "Diego", "rol": "Integrante", "aportado": 200, "meta": 200, "estado": "Activo"},
            {"nombre": "Valentina", "rol": "Integrante", "aportado": 100, "meta": 200, "estado": "Activo"},
            {"nombre": "Mateo", "rol": "Integrante", "aportado": 100, "meta": 200, "estado": "Activo"},
        ]
    },
    {
        "id": 3,
        "nombre": "Regalo grupal",
        "categoria": "Regalos",
        "descripcion": "Organización de un regalo compartido.",
        "moneda": "USD",
        "simbolo": "$",
        "estado": "En progreso",
        "meta_individual": 50,
        "meta_grupo": 200,
        "recaudado": 125,
        "integrantes": [
            {"nombre": "Andrés", "rol": "Administrador", "aportado": 50, "meta": 50, "estado": "Activo"},
            {"nombre": "Camila", "rol": "Integrante", "aportado": 50, "meta": 50, "estado": "Activo"},
            {"nombre": "Joaquín", "rol": "Integrante", "aportado": 25, "meta": 50, "estado": "Activo"},
            {"nombre": "Martina", "rol": "Integrante", "aportado": 0, "meta": 50, "estado": "Activo"},
        ]
    },
    {
        "id": 4,
        "nombre": "Salida del viernes",
        "categoria": "Entretenimiento",
        "descripcion": "Fondo para actividades recreativas.",
        "moneda": "ARS",
        "simbolo": "$",
        "estado": "En progreso",
        "meta_individual": 15000,
        "meta_grupo": 60000,
        "recaudado": 45000,
        "integrantes": [
            {"nombre": "Lucía", "rol": "Administrador", "aportado": 15000, "meta": 15000, "estado": "Activo"},
            {"nombre": "Tomás", "rol": "Integrante", "aportado": 10000, "meta": 15000, "estado": "Activo"},
            {"nombre": "Julieta", "rol": "Integrante", "aportado": 15000, "meta": 15000, "estado": "Activo"},
            {"nombre": "Nicolás", "rol": "Integrante", "aportado": 5000, "meta": 15000, "estado": "Activo"},
        ]
    }
]

aportes = [
    {"id": 1, "grupo": "Cena de amigos", "integrante": "Carlos", "monto": 30, "moneda": "USD", "fecha": "2026-11-18", "estado": "Completado"},
    {"id": 2, "grupo": "Cena de amigos", "integrante": "Carlos", "monto": 30, "moneda": "USD", "fecha": "2026-11-20", "estado": "Completado"},
    {"id": 3, "grupo": "Cena de amigos", "integrante": "María", "monto": 50, "moneda": "USD", "fecha": "2026-11-17", "estado": "Completado"},
    {"id": 4, "grupo": "Cena de amigos", "integrante": "Lucía", "monto": 100, "moneda": "USD", "fecha": "2026-11-20", "estado": "Completado"},
    {"id": 5, "grupo": "Cena de amigos", "integrante": "Pedro", "monto": 50, "moneda": "USD", "fecha": "2026-11-22", "estado": "Completado"},
]

gastos = [
    {"id": 1, "grupo": "Viaje a la costa", "concepto": "Reserva de alojamiento", "monto": 120, "moneda": "USD", "responsable": "María", "metodo": "Fondo común", "estado": "Aprobado", "fecha": "2026-11-20"}
]

aprobaciones = [
    {"id": 1, "grupo": "Viaje a la costa", "tipo": "Gasto", "titulo": "Reserva de alojamiento", "monto": 120, "moneda": "USD", "estado": "Aprobado", "votos_favor": 5, "total_votos": 5}
]

transacciones = [
    {"id": "TX-001", "grupo": "Cena de amigos", "integrante": "Carlos", "concepto": "Primera aportación", "tipo": "Aportación", "monto": 30, "moneda": "USD", "fecha": "2026-11-18", "estado": "Completado"},
    {"id": "TX-002", "grupo": "Cena de amigos", "integrante": "María", "concepto": "Primera aportación", "tipo": "Aportación", "monto": 50, "moneda": "USD", "fecha": "2026-11-17", "estado": "Completado"},
    {"id": "TX-003", "grupo": "Viaje a la costa", "integrante": "María", "concepto": "Reserva de alojamiento", "tipo": "Gasto", "monto": 120, "moneda": "USD", "fecha": "2026-11-20", "estado": "Aprobado"},
]

salidas = [
    {"id": 1, "grupo": "Cena de amigos", "nombre": "Cena de noviembre", "fecha": "2026-11-28", "estimado": 350, "recaudado": 340, "pendiente": 10, "estado": "Recaudando"}
]

velas_solana = [
    {"hora": "08:00", "apertura": 170.0, "cierre": 173.5, "maximo": 175.0, "minimo": 169.0, "tipo": "alza", "vol": 45},
    {"hora": "09:00", "apertura": 173.5, "cierre": 171.2, "maximo": 174.5, "minimo": 170.0, "tipo": "baja", "vol": 32},
    {"hora": "10:00", "apertura": 171.2, "cierre": 176.8, "maximo": 178.0, "minimo": 170.8, "tipo": "alza", "vol": 68},
    {"hora": "11:00", "apertura": 176.8, "cierre": 179.4, "maximo": 181.0, "minimo": 175.5, "tipo": "alza", "vol": 80},
    {"hora": "12:00", "apertura": 179.4, "cierre": 175.0, "maximo": 180.0, "minimo": 173.8, "tipo": "baja", "vol": 54},
    {"hora": "13:00", "apertura": 175.0, "cierre": 172.5, "maximo": 176.2, "minimo": 171.0, "tipo": "baja", "vol": 61},
    {"hora": "14:00", "apertura": 172.5, "cierre": 177.9, "maximo": 179.0, "minimo": 172.0, "tipo": "alza", "vol": 72},
    {"hora": "15:00", "apertura": 177.9, "cierre": 182.3, "maximo": 183.5, "minimo": 177.0, "tipo": "alza", "vol": 95},
    {"hora": "16:00", "apertura": 182.3, "cierre": 180.1, "maximo": 184.0, "minimo": 179.2, "tipo": "baja", "vol": 48},
    {"hora": "17:00", "apertura": 180.1, "cierre": 184.6, "maximo": 186.0, "minimo": 179.8, "tipo": "alza", "vol": 88},
    {"hora": "18:00", "apertura": 184.6, "cierre": 181.8, "maximo": 185.5, "minimo": 180.5, "tipo": "baja", "vol": 42},
    {"hora": "19:00", "apertura": 181.8, "cierre": 185.4, "maximo": 187.2, "minimo": 181.5, "tipo": "alza", "vol": 91},
]
