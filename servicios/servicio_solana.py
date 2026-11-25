from dotenv import load_dotenv
import requests, os, time

load_dotenv()  # carga las variables del archivo .env

SOLANA_RPC_URL = os.getenv('SOLANA_RPC_URL')
API_KEY = os.getenv("COINGECKO_API_KEY")
PLAN = os.getenv("COINGECKO_PLAN", "demo")

# Demo y Pro usan URL y header distintos
if PLAN == "pro":
    BASE_URL = "https://pro-api.coingecko.com/api/v3"
    HEADER_KEY = "x-cg-pro-api-key"
else:
    BASE_URL = "https://api.coingecko.com/api/v3"
    HEADER_KEY = "x-cg-demo-api-key"

# Caché simple en memoria: evita gastar créditos de la API
# cada vez que alguien recarga la página.
CACHE_SEGUNDOS = 60
_cache = {}


def _get(endpoint, params=None):
    """Hace un GET a CoinGecko (con caché) y devuelve el JSON."""
    clave = (endpoint, tuple(sorted((params or {}).items())))
    ahora = time.time()

    if clave in _cache and ahora - _cache[clave][0] < CACHE_SEGUNDOS:
        return _cache[clave][1]

    if not API_KEY:
        raise RuntimeError("Falta COINGECKO_API_KEY en el archivo .env")

    respuesta = requests.get(
        BASE_URL + endpoint,
        params=params,
        headers={HEADER_KEY: API_KEY, "accept": "application/json"},
        timeout=10,  # nunca dejar una petición sin límite de tiempo
    )
    respuesta.raise_for_status()  # lanza error si el código no es 2xx

    datos = respuesta.json()
    _cache[clave] = (ahora, datos)
    return datos


def obtener_mercado_solana():
    """
    Precio y métricas actuales de SOL.
    Devuelve None si falla, para que app.py use los datos de ejemplo.
    OJO: ajustá estas claves a las de datos.mercado["solana"].
    """
    try:
        r = _get("/simple/price", {
            "ids": "solana",
            "vs_currencies": "usd",
            "include_market_cap": "true",
            "include_24hr_vol": "true",
            "include_24hr_change": "true",
        })
        s = r["solana"]
        precio = s["usd"]
        cap = s.get("usd_market_cap", 0)

        return {
            "price": precio,
            "change24h": s.get("usd_24h_change", 0),
            "marketCap": cap,
            "volume24h": s.get("usd_24h_vol", 0),
            # Aproximación: capitalización / precio
            "circulatingSupply": cap / precio if precio else 0,
        }
    except (requests.RequestException, KeyError, RuntimeError) as error:
        print(f"[CoinGecko] No se pudo obtener el mercado: {error}")
        return None


def obtener_historial_solana(dias=7):
    """Un precio por día (el último de cada día). None si falla."""
    try:
        r = _get("/coins/solana/market_chart", {
            "vs_currency": "usd",
            "days": dias,
        })
        por_dia = {}
        for marca_ms, precio in r["prices"]:
            dia = time.strftime("%Y-%m-%d", time.gmtime(marca_ms / 1000))
            por_dia[dia] = precio  # el último valor del día pisa a los anteriores

        return [{"date": d, "etiqueta": f"{d[8:10]}/{d[5:7]}", "price": round(p, 2)} for d, p in por_dia.items()]
    except (requests.RequestException, KeyError, RuntimeError) as error:
        print(f"[CoinGecko] No se pudo obtener el historial: {error}")
        return None


def _dia(marca_ms):
    """Convierte una marca de tiempo en milisegundos a 'AAAA-MM-DD' (UTC)."""
    return time.strftime("%Y-%m-%d", time.gmtime(marca_ms / 1000))


def obtener_velas_solana(dias=7):
    """
    Una vela por día, con alza (sube/baja) y volumen aproximado.
    Devuelve None si falla.

    OJO: ajustá los nombres de las claves ("fecha", "apertura", etc.)
    a los de datos.velas_solana.
    """
    try:
        # /ohlc trae [cierre_ms, apertura, máximo, mínimo, cierre]: SIN volumen.
        ohlc = _get("/coins/solana/ohlc", {"vs_currency": "usd", "days": dias})
        # El volumen sale de otro endpoint.
        grafico = _get("/coins/solana/market_chart", {"vs_currency": "usd", "days": dias})

        # Volumen: el último valor de cada día. CoinGecko lo da como volumen
        # de las últimas 24 h, así que al cierre del día es una aproximación
        # del volumen diario (NO es el volumen exacto de la vela).
        volumen_por_dia = {}
        for marca_ms, volumen in grafico["total_volumes"]:
            volumen_por_dia[_dia(marca_ms)] = volumen

        # La API entrega velas de 4 h (con 3 a 30 días): las juntamos por día.
        # El tiempo de cada vela es su CIERRE, por eso se resta 1 ms.
        por_dia = {}
        for marca_ms, abre, maximo, minimo, cierra in ohlc:
            dia = _dia(marca_ms - 1)
            if dia not in por_dia:
                por_dia[dia] = {
                    "fecha": dia,
                    "etiqueta": f"{dia[8:10]}/{dia[5:7]}",
                    "apertura": abre,
                    "maximo": maximo,
                    "minimo": minimo,
                    "cierre": cierra,
                }
            else:
                vela = por_dia[dia]
                vela["maximo"] = max(vela["maximo"], maximo)
                vela["minimo"] = min(vela["minimo"], minimo)
                vela["cierre"] = cierra

        velas = []
        for dia, vela in por_dia.items():
            vela["alza"] = vela["cierre"] >= vela["apertura"]
            vela["vol"] = round(volumen_por_dia.get(dia, 0))
            velas.append(vela)

        return velas
    except (requests.RequestException, KeyError, ValueError, RuntimeError) as error:
        print(f"[CoinGecko] No se pudieron obtener las velas: {error}")
        return None

# Funcionalidad a prueba
def hacer_peticion_rpc(metodo, parametros):
    if not SOLANA_RPC_URL:
        raise ValueError("No se encontró SOLANA_RPC_URL en el archivo .env")

    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": metodo,
        "params": parametros
    }
    respuesta = requests.post(SOLANA_RPC_URL, json=payload)
    datos = respuesta.json()

    if "error" in datos:
        raise ValueError(datos["error"]["message"])
    
    return datos["result"]

def obtener_resumen_wallet(wallet_address):
    # 1. Consultar saldo principal en SOL
    info_saldo = hacer_peticion_rpc("getBalance", [wallet_address])
    saldo_sol = info_saldo["value"] / 1_000_000_000

    # 2. Consultar las últimas 5 transacciones
    firmas = hacer_peticion_rpc("getSignaturesForAddress", [wallet_address, {"limit": 5}])
    transacciones = [
        {
            "firma": tx["signature"],
            "estado": "Fallida" if tx["err"] else "Exitosa",
            "bloque": tx["slot"]
        }
        for tx in firmas
    ]

    # 3. Consultar tokens SPL (USDC, USDT, memecoins, etc.)
    info_tokens = hacer_peticion_rpc(
        "getTokenAccountsByOwner",
        [
            wallet_address,
            {"programId": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"},
            {"encoding": "jsonParsed"}
        ]
    )
    tokens = []
    for item in info_tokens["value"]:
        info = item["account"]["data"]["parsed"]["info"]
        cantidad = info["tokenAmount"]["uiAmount"]
        if cantidad and cantidad > 0:
            tokens.append({
                "mint_token": info["mint"],
                "cantidad": cantidad
            })

    # Devolvemos todo junto en un solo diccionario
    return {
        "wallet": wallet_address,
        "red": "Devnet" if "devnet" in SOLANA_RPC_URL else "Mainnet",
        "saldo_sol": saldo_sol,
        "total_tokens_distintos": len(tokens),
        "tokens": tokens,
        "ultimas_transacciones": transacciones
    }