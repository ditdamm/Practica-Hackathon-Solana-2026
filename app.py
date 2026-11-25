from flask import Flask, render_template, jsonify
import datos
from servicios import servicio_solana

app = Flask(__name__, template_folder='.', static_folder='static')

@app.route('/')
def index():
    return render_template('index.html')

# ==========================================
# GENERAL

@app.route('/cliente/inicio')
def inicio_cliente():
    return render_template(
        'modulos/cliente/general/inicio.html',
        pagina_activa='inicio',
        grupos=datos.grupos,
        total_integrantes=sum(len(g["integrantes"]) for g in datos.grupos),
        transacciones=datos.transacciones,
        solana=datos.mercado["solana"],
        historial_sol=datos.historial_precios
    )

@app.route('/cliente/grupos')
def grupos_cliente():
    return render_template(
        'modulos/cliente/general/grupos.html',
        pagina_activa='grupos',
        grupos=datos.grupos
    )

# ==========================================
# GESTIÓN FINANCIERA

@app.route('/cliente/aportes')
def aportes_cliente():
    total_aportado = sum(a["monto"] for a in datos.aportes)
    return render_template(
        'modulos/cliente/gestion/aportes.html',
        pagina_activa='aportes',
        aportes=datos.aportes,
        total_aportado=total_aportado
    )

@app.route('/cliente/aprobaciones')
def aprobaciones_cliente():
    return render_template(
        'modulos/cliente/gestion/aprobaciones.html',
        pagina_activa='aprobaciones',
        aprobaciones=datos.aprobaciones
    )

@app.route('/cliente/gastos')
def gastos_cliente():
    total_gastado = sum(g["monto"] for g in datos.gastos)
    return render_template(
        'modulos/cliente/gestion/gastos.html',
        pagina_activa='gastos',
        gastos=datos.gastos,
        total_gastado=total_gastado
    )

@app.route('/cliente/fondo-comun')
def fondo_comun_cliente():
    return render_template(
        'modulos/cliente/gestion/fondo_comun.html',
        pagina_activa='fondo',
        grupos=datos.grupos,
        gastos=datos.gastos
    )

@app.route('/cliente/transacciones')
def transacciones_cliente():
    return render_template(
        'modulos/cliente/gestion/transacciones.html',
        pagina_activa='transacciones',
        transacciones=datos.transacciones
    )

@app.route('/cliente/salida-comun')
def salida_comun_cliente():
    return render_template(
        'modulos/cliente/gestion/salida_comun.html',
        pagina_activa='salidas',
        salidas=datos.salidas
    )

# ==========================================
# ECOSISTEMA

@app.route('/cliente/solana')
def solana_cliente():
    return render_template(
        'modulos/cliente/ecosistema/solana.html',
        pagina_activa='solana',
        solana=servicio_solana.obtener_mercado_solana(),
        historial_sol=servicio_solana.obtener_historial_solana(),
        velas_solana=servicio_solana.obtener_velas_solana()
    )

# ===========================================
# FUNCIONALIDAD A PRUEBA ILLIT

@app.route('/consulta/<wallet_address>', methods=['GET'])
def consulta(wallet_address):
    # print(len(wallet_address))
    if len(wallet_address) < 43 or len(wallet_address) > 44:
        return jsonify({'error': 'La longitud de la wallet está fuera del rango permitido'})
    try:
        datos = servicio_solana.obtener_resumen_wallet(wallet_address)
        return jsonify(datos)
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route("/consulta", methods=["GET"])
def consulta_solana():
    try:
        datos_mercado = servicio_solana.obtener_mercado_solana()
        return jsonify(datos_mercado)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/consulta/precio')
def precio():
    precio= servicio_solana.consultas["precio"]()
    return precio

# ===========================================


if __name__ == '__main__':
    app.run(debug=True)
