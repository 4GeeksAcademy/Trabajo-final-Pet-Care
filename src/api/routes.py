"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint, send_from_directory
from api.models import db, User, Pet, Vacuna, Raza, Favorite, Recomendacion, MedicalProfile
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_swagger import swagger
from flask_jwt_extended import create_access_token, jwt_required, get_jwt, get_jwt_identity
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import timedelta
from flask import request, jsonify, Blueprint
from flask_jwt_extended import (
    create_access_token, jwt_required, get_jwt, get_jwt_identity
)
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import timedelta
from .utils import APIException
from .utils import admin_required 
import os 
from dotenv import load_dotenv

load_dotenv()

# import openai
# import os
# openai.api_key = os.getenv("OPENAI_API_KEY")

from openai import OpenAI
import stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
print("STRIPE KEY:", os.getenv("STRIPE_SECRET_KEY"))

client = OpenAI()

api = Blueprint('api', __name__)

jwt_blacklist = set()

# Allow CORS requests to this API
CORS(api)

#______RUTAS PANEL ADMINISTRADOR_____ 
#GET USUARIOS 
@api.route('/admin/users', methods=['GET'])
@jwt_required()
@admin_required
def admin_list_users():
    users = User.query.all()
    return jsonify([u.serialize() for u in users]), 200

#VER USUARIO INDIVIDUAL 
@api.route('/admin/user/<int:user_id>', methods=['GET'])
@jwt_required()
@admin_required
def admin_get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404
    return jsonify(user.serialize()), 200
#EDITAR USUARIO 
@api.route('/admin/user/<int:user_id>', methods=['PUT'])
@jwt_required()
@admin_required
def admin_edit_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404
    data = request.get_json()
    user.nombre = data.get("nombre", user.nombre)
    user.apellido = data.get("apellido", user.apellido)
    user.email = data.get("email", user.email)
    user.is_admin = data.get("is_admin", user.is_admin)
    user.is_active = data.get("is_active", user.is_active)
    db.session.commit()
    return jsonify(user.serialize()), 200
#ACTIVAR-DESACTIVAR USUARIO 
@api.route('/admin/user/<int:user_id>/toggle_active', methods=['PATCH'])
@jwt_required()
@admin_required
def admin_toggle_active_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404
    user.is_active = not user.is_active
    db.session.commit()
    return jsonify({"id": user.id, "is_active": user.is_active}), 200

#LISTAR MASCOTAS
@api.route('/admin/pets', methods=['GET'])
@jwt_required()
@admin_required
def admin_list_pets():
    pets = Pet.query.all()
    return jsonify([p.serialize() for p in pets]), 200
#DETALLE DE MASCOTA
@api.route('/admin/pet/<int:pet_id>', methods=['GET'])
@jwt_required()
@admin_required
def admin_get_pet(pet_id):
    pet = Pet.query.get(pet_id)
    if not pet:
        return jsonify({"msg": "Mascota no encontrada"}), 404
    return jsonify(pet.serialize()), 200
#EDITAR MASCOTA
@api.route('/admin/pet/<int:pet_id>', methods=['PUT'])
@jwt_required()
@admin_required
def admin_edit_pet(pet_id):
    pet = Pet.query.get(pet_id)
    if not pet:
        return jsonify({"msg": "Mascota no encontrada"}), 404
    data = request.get_json()
    pet.nombre = data.get("nombre", pet.nombre)
    pet.edad = data.get("edad", pet.edad)
    pet.especie = data.get("especie", pet.especie)
    pet.raza = data.get("raza", pet.raza)
    pet.peso = data.get("peso", pet.peso)
    pet.is_active = data.get("is_active", pet.is_active)
    db.session.commit()
    return jsonify(pet.serialize()), 200
#DESACTIVAR-REACTIVAR MASCOTA
@api.route('/admin/pet/<int:pet_id>/toggle_active', methods=['PATCH'])
@jwt_required()
@admin_required
def admin_toggle_active_pet(pet_id):
    pet = Pet.query.get(pet_id)
    if not pet:
        return jsonify({"msg": "Mascota no encontrada"}), 404
    pet.is_active = not pet.is_active
    db.session.commit()
    return jsonify({"id": pet.id, "is_active": pet.is_active}), 200
#FILTRAR MASCOTA POR USUARIO, ESPECIE, ETC. 
@api.route('/admin/pets/filter', methods=['GET'])
@jwt_required()
@admin_required
def admin_filter_pets():
    user_id = request.args.get("user_id")
    especie = request.args.get("especie")
    raza = request.args.get("raza")
    is_active = request.args.get("is_active")
    query = Pet.query
    if user_id:
        query = query.filter_by(user_id=user_id)
    if especie:
        query = query.filter_by(especie=especie)
    if raza:
        query = query.filter_by(raza=raza)
    if is_active is not None:
        query = query.filter_by(is_active=(is_active.lower() == "true"))
    pets = query.all()
    return jsonify([p.serialize() for p in pets]), 200

#USUARIO VISUALIZA MENSAJES DE "CONTACTANOS"
@api.route('/admin/contact_messages', methods=['GET'])
@jwt_required()
@admin_required
def admin_list_contact_messages():
    messages = ContactMessage.query.order_by(ContactMessage.created_at.desc()).all()
    return jsonify([m.serialize() for m in messages]), 200

    
# _____USERS___#
# RUTA GET ALL USERS
@api.route('/users', methods=['GET'])
def get_users():
    all_users = User.query.all()
    serialized = [u.serialize() for u in all_users]
    return jsonify(serialized), 200

# RUTA REGISTER USER


@api.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    nombre = data.get('nombre')
    apellido = data.get('apellido')
    email = data.get('email')
    password = data.get('password')
    if not nombre or not apellido or not email or not password:
        return jsonify({'msg': 'Todos los campos son obligatorios'}), 400
    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({'msg': 'El usuario ya existe'}), 400
    hashed_password = generate_password_hash(password)
    new_user = User(nombre=nombre, apellido=apellido,
                    email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'msg': 'Usuario registrado correctamente'}), 201

# RUTA LOGIN


@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        raise APIException("Credenciales inválidas", status_code=401)
    access_token = create_access_token(
        identity=str(user.id),  
        expires_delta=timedelta(days=1)
    )
    return jsonify({"token": access_token, "user": user.serialize()}), 200

# RUTA LOGOUT USER


@api.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    jwt_blacklist.add(jti)
    return jsonify({"message": "Logged out and token revoked"}), 200

# RUTA ACTUALIZAR USUARIO
@api.route('/user/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    data = request.get_json()
    current_user_id = int(get_jwt_identity())

    if current_user_id != user_id:
        return jsonify({'msg': 'No tienes permiso para actualizar este usuario'}), 403

    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'msg': 'Usuario no encontrado'}), 404

        if 'nombre' in data:
            user.nombre = data['nombre']
        if 'apellido' in data:
            user.apellido = data['apellido']
        if 'email' in data:
            user.email = data['email']
        if 'password' in data and data['password']:
            user.password = generate_password_hash(data['password'])
        if 'foto' in data:
            user.foto = data['foto']

        db.session.commit()
        return jsonify({'msg': 'Usuario actualizado correctamente', 'user': user.serialize()}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'msg': 'Error al actualizar el usuario', 'error': str(e)}), 500

    # RUTA ELIMINAR USUARIO
@api.route('/user/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    current_user = get_jwt_identity()
    if current_user != user_id:
        return jsonify({'msg': 'No tienes permiso para eliminar este usuario'}), 403
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'msg': 'Usuario no encontrado'}), 404
        db.session.delete(user)
        db.session.commit()
        return jsonify({'msg': 'Usuario eliminado correctamente'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'msg': 'Error al eliminar el usuario', 'error': str(e)}), 500

# RUTA OBTENER USUARIO POR ID
@api.route('/user/<int:user_id>', methods=['GET'])
def get_user_by_id(user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'msg': 'Usuario no encontrado'}), 404
        return jsonify(user.serialize()), 200
    except Exception as e:
        return jsonify({'msg': 'Error al obtener el usuario', 'error': str(e)}), 500

    # ________________MASCOTAS_____________#

# RUTA GET MASCOTAS POR ID DE USUARIO
@api.route('/pets', methods=['GET'])
def get_pets_por_usuario():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({'msg': 'Debes proporcionar id de usuario en la url'}), 400
    try:
        pets = Pet.query.filter_by(user_id=user_id).all()
        return jsonify([pet.serialize() for pet in pets]), 200
    except Exception as e:
        return jsonify({'msg': 'Error, no se pudo obtener mascotas', 'error': str(e)}), 400

    # RUTA OBTENER MASCOTA POR ID / VJ
@api.route('/pet/<int:pet_id>', methods=['GET'])
def get_pet_by_id(pet_id):
    try:
        pet = Pet.query.get(pet_id)
        if not pet:
            return jsonify({'msg': 'Mascota no encontrada'}), 404
        return jsonify(pet.serialize()), 200
    except Exception as e:
        return jsonify({'msg': 'Error al obtener la mascota', 'error': str(e)}), 500

    # RUTA OBTENER TODAS LAS MASCOTAS
@api.route('/all_pets', methods=['GET'])
def get_all_pets():
    try:
        pets = Pet.query.all()
        return jsonify([pet.serialize() for pet in pets]), 200
    except Exception as e:
        return jsonify({'msg': 'Error al obtener las mascotas', 'error': str(e)}), 500

# RUTA REGISTRO DE MASCOTA

@api.route('/pets', methods=['POST'])
def register_pet():
    data = request.get_json()
    nombre = data.get('nombre')
    especie = data.get('especie')
    raza = data.get('raza')
    foto = data.get('foto')
    peso = data.get('peso')
    fecha_nacimiento = data.get('fecha_nacimiento')
    sexo = data.get('sexo')
    user_id = data.get('user_id')

    if not nombre or not especie or not raza or not peso or not fecha_nacimiento or not sexo:
        return jsonify({'msg': 'Todos los campos son obligatorios, excepto la foto'}), 400
    try:
        nueva_mascota = Pet(
            nombre=nombre,
            especie=especie,
            raza=raza,
            foto=foto,
            peso=peso,
            fecha_nacimiento=fecha_nacimiento,
            sexo=sexo,
            user_id=user_id
        )
        db.session.add(nueva_mascota)
        db.session.commit()
        return jsonify({'msg': 'Mascota registrada con éxito :lentes_de_sol:'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'msg': 'Error al registrar la mascota', 'error': str(e)}), 500

# RUTA ACTUALIZAR MASCOTA
@api.route('/pet/<int:pet_id>', methods=['PUT'])
@jwt_required()
def update_pet(pet_id):
    data = request.get_json()
    pet  = Pet.query.get(pet_id)
    if not pet:
        return jsonify({'msg': 'Mascota no encontrada'}), 404

    # Actualiza sólo si viene en el payload
    if 'nombre' in data:
        pet.nombre  = data['nombre']
    if 'peso' in data:
        pet.peso    = data['peso']
    if 'especie' in data:
        pet.especie = data['especie']
    if 'raza' in data:
        pet.raza    = data['raza']
    if 'foto' in data:
        pet.foto    = data['foto']
    if 'fecha_nacimiento' in data:
        pet.fecha_nacimiento = data['fecha_nacimiento']
    if 'sexo' in data:
        pet.sexo = data['sexo']

    try:
        db.session.commit()
        return jsonify({'msg': 'Mascota actualizada correctamente'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'msg': 'Error al actualizar la mascota', 'error': str(e)}), 500


# RUTA ELIMINAR MASCOTA
@api.route('/pet/<int:pet_id>', methods=['DELETE'])
@jwt_required()
def delete_pet(pet_id):
    current_user = get_jwt_identity()
    try:
        pet = Pet.query.get(pet_id)
        print("pet_id:", pet_id)
        if not pet:
            print("Mascota no encontrada")
            return jsonify({'msg': 'Mascota no encontrada'}), 404

        print("pet.user_id:", pet.user_id, type(pet.user_id))
        print("current_user:", current_user, type(current_user))

        if str(pet.user_id) != str(current_user):
            print("No tienes permiso: pet.user_id =", pet.user_id, "current_user =", current_user)
            return jsonify({'msg': 'No tienes permiso para eliminar esta mascota'}), 403

        db.session.delete(pet)
        db.session.commit()
        print("Mascota eliminada correctamente")
        return jsonify({'msg': 'Mascota eliminada correctamente'}), 200
    except Exception as e:
        db.session.rollback()
        print("Error al eliminar mascota:", str(e))
        return jsonify({'msg': 'Error al eliminar la mascota', 'error': str(e)}), 500


    # ________VACUNAS______#

# RUTA VACUNAS 
#GET VACUNAS 
@api.route('/mascotas/<int:mascota_id>/vacunas', methods=['GET'])
@jwt_required()
def get_vacunas(mascota_id):
    vacunas = Vacuna.query.filter_by(mascota_id=mascota_id).all()
    return jsonify([v.serialize() for v in vacunas]), 200
#POST VACUNAS 
@api.route('/mascotas/<int:mascota_id>/vacunas', methods=['POST'])
def add_vacuna(mascota_id):
    """Registra una nueva vacuna para una mascota específica."""
    data = request.get_json()
    if not data.get('nombre') or not data.get('fecha_aplicacion'):
        return jsonify({"msg": "El nombre y la fecha de aplicación son obligatorios"}), 400

    try:
        mascota = Pet.query.get(mascota_id)
        if not mascota:
            return jsonify({'msg': 'Mascota no encontrada'}), 404

        nueva_vacuna = Vacuna(
            nombre=data.get('nombre'),
            descripcion=data.get('descripcion'),
            fecha_aplicacion=data.get('fecha_aplicacion'),
            mascota_id=mascota_id
        )
        db.session.add(nueva_vacuna)
        db.session.commit()
        return jsonify(nueva_vacuna.serialize()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'msg': 'Error al registrar la vacuna', 'error': str(e)}), 500
    
#DELETE VACUNAS 
@api.route('/vacunas/<int:vacuna_id>', methods=['DELETE'])
@jwt_required()
def delete_vacuna(vacuna_id):
    vacuna = Vacuna.query.get(vacuna_id)
    if not vacuna:
        return jsonify({"msg": "Vacuna no encontrada"}), 404
    db.session.delete(vacuna)
    db.session.commit()
    return jsonify({"msg": "Vacuna eliminada correctamente"}), 200

        


#RUTAS VETERINARIAS FAVORITAS 

# GET /favorites
@api.route("/favorites", methods=["GET"])
@jwt_required()
def get_favorites():
    user_id = int(get_jwt_identity())
    favs = Favorite.query.filter_by(user_id=user_id).all()
    return jsonify([f.serialize() for f in favs]), 200

# POST /favorites
@api.route("/favorites", methods=["POST"])
@jwt_required()
def add_favorite():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    fav = Favorite(
        user_id=user_id,
        place_id=data["place_id"],
        name=data["name"],
        address=data.get("address"),
        phone=data.get("phone"),
        website=data.get("website"),
    )
    db.session.add(fav)
    db.session.commit()
    return jsonify(fav.serialize()), 201

# DELETE /favorites/<place_id>
@api.route("/favorites/<place_id>", methods=["DELETE"])
@jwt_required()
def delete_favorite(place_id):
    user_id = int(get_jwt_identity())
    fav = Favorite.query.filter_by(user_id=user_id, place_id=place_id).first()
    if not fav:
        return jsonify({"msg": "No encontrado"}), 404
    db.session.delete(fav)
    db.session.commit()
    return jsonify({"msg": "Eliminado"}), 200


#------------------RUTAS IA-----------------#

# POST
@api.route('/pet/<int:pet_id>/recomendacion', methods=['POST'])
@jwt_required()
def generar_recomendacion_ia(pet_id):
    data = request.get_json()
    pregunta = data.get("pregunta", "")
    user_id = int(get_jwt_identity())

    pet = Pet.query.get(pet_id)
    if not pet or pet.user_id != user_id:
        return jsonify({"msg": "Mascota no encontrada o acceso no autorizado"}), 403

    prompt = (
        f"Nombre: {pet.nombre}\n"
        f"Especie: {pet.especie}\n"
        f"Raza: {pet.raza or 'Desconocida'}\n"
        f"Peso: {pet.peso} kg\n"
        f"Sexo: {pet.sexo}\n"
        f"Fecha de nacimiento: {pet.fecha_nacimiento}\n\n"
        f"Pregunta del usuario: {pregunta}\n\n"
        "Responde de forma útil y concisa en no más de 3 frases. Sé claro, directo y breve, como un experto en bienestar animal que da consejos rápidos:"
    )

    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "Eres un experto en cuidado y bienestar de mascotas."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )
        respuesta = response.choices[0].message.content

        recomendacion = Recomendacion(
            mascota_id=pet_id,
            pregunta=pregunta,
            respuesta=respuesta
        )
        db.session.add(recomendacion)
        db.session.commit()

        return jsonify(recomendacion.serialize()), 201

    except Exception as e:
        return jsonify({"msg": "Error al generar recomendación", "error": str(e)}), 500

# GET
@api.route('/pet/<int:pet_id>/recomendaciones', methods=['GET'])
@jwt_required()
def get_recomendaciones(pet_id):
    pet = Pet.query.get(pet_id)
    if not pet or pet.user_id != int(get_jwt_identity()):
        return jsonify({"msg": "No autorizado"}), 403

    recomendaciones = Recomendacion.query.filter_by(mascota_id=pet_id).order_by(Recomendacion.fecha.desc()).all()
    return jsonify([r.serialize() for r in recomendaciones]), 200


# DELETE
@api.route('/recomendacion/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_recomendacion(id):
    recomendacion = Recomendacion.query.get(id)
    if not recomendacion or recomendacion.mascota.user_id != int(get_jwt_identity()):
        return jsonify({"msg": "No autorizado"}), 403

    db.session.delete(recomendacion)
    db.session.commit()
    return jsonify({"msg": "Recomendación eliminada"}), 200

@api.route('/pets/<int:pet_id>/perfil_medico', methods=['GET'])
@jwt_required()
def get_perfil_medico(pet_id):
    perfil = MedicalProfile.query.filter_by(pet_id=pet_id).first()
    if not perfil:
        return jsonify({"msg": "No hay perfil médico para esta mascota"}), 404
    return jsonify(perfil.serialize()), 200

# POST/PUT para crear o actualizar perfil médico
@api.route('/pets/<int:pet_id>/perfil_medico', methods=['POST', 'PUT'])
@jwt_required()
def save_perfil_medico(pet_id):
    data = request.get_json()
    perfil = MedicalProfile.query.filter_by(pet_id=pet_id).first()
    if not perfil:
        perfil = MedicalProfile(pet_id=pet_id)
        db.session.add(perfil)

    perfil.alergias = data.get('alergias', perfil.alergias)
    perfil.condiciones_previas = data.get('condiciones_previas', perfil.condiciones_previas)
    perfil.medicamentos_actuales = data.get('medicamentos_actuales', perfil.medicamentos_actuales)
    perfil.esterilizado = data.get('esterilizado', perfil.esterilizado)
    perfil.fecha_ultima_revision = data.get('fecha_ultima_revision', perfil.fecha_ultima_revision)
    perfil.veterinario_habitual = data.get('veterinario_habitual', perfil.veterinario_habitual)
    perfil.observaciones = data.get('observaciones', perfil.observaciones)
    perfil.grupo_sanguineo = data.get('grupo_sanguineo', perfil.grupo_sanguineo)
    perfil.microchip = data.get('microchip', perfil.microchip)
    db.session.commit()
    return jsonify(perfil.serialize()), 200

@api.route('/pets/<int:pet_id>/perfil_medico', methods=['DELETE'])
@jwt_required()
def delete_perfil_medico(pet_id):
    perfil = MedicalProfile.query.filter_by(pet_id=pet_id).first()
    if not perfil:
        return jsonify({"msg": "No hay perfil médico para eliminar"}), 404
    db.session.delete(perfil)
    db.session.commit()
    return jsonify({"msg": "Perfil médico eliminado"}), 200

#USUARIO ENVIA FORMULARIO DE CONTACTO Y SE GUARDA EN LA DB 
@api.route('/contact', methods=['POST'])
def send_contact_message():
    data = request.get_json()
    nombre = data.get("nombre")
    email = data.get("email")
    mensaje = data.get("mensaje")
    if not nombre or not email or not mensaje:
        return jsonify({"msg": "Todos los campos son obligatorios"}), 400

    new_msg = ContactMessage(
        nombre=nombre,
        email=email,
        mensaje=mensaje
    )
    db.session.add(new_msg)
    db.session.commit()
    return jsonify({"msg": "Mensaje enviado correctamente"}), 20

#STRIPE PARA DONACIONES 
@api.route('/create-donation-session', methods=['POST'])
@jwt_required()
def create_donation_session():  
    data = request.get_json()
    amount = data.get("amount")
    print("AMOUNT RECIBIDO:", amount)

    try:
        amount = float(amount)
    except Exception as e:
        print("ERROR DE AMOUNT:", e)
        return jsonify({"msg": "Monto inválido"}), 400

    PRICES = {
        2: "price_1RnniJBL5zffqAu9J25OgIsK",
        5: "price_1RnnimBL5zffqAu9F3R13cPi",
        10: "price_1Rnnj0BL5zffqAu98JUs0gwV"
    }
    price_id = PRICES.get(amount)
    if not price_id:
        print("MONTO INVALIDO:", amount)
        return jsonify({"msg": "Monto inválido"}), 400

    try:

        success_url = "https://miniature-tribble-wr56vg579jgrfvj6q-3000.app.github.dev/dashboard?donation=ok"
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[{
                "price": price_id,
                "quantity": 1,
            }],
            mode="payment",
            success_url=success_url,
            cancel_url="https://miniature-tribble-wr56vg579jgrfvj6q-3000.app.github.dev/dashboard",
            metadata={"user_id": get_jwt_identity()},
        )
        print("STRIPE SESSION URL:", session.url)
        return jsonify({"checkout_url": session.url})
    except Exception as e:
        print("STRIPE ERROR:", e)
        return jsonify({"msg": f"Error de Stripe: {str(e)}"}), 500
#STRIPE PARA CARNET DE VACUNACION 
@api.route('/stripe/carnet-checkout', methods=['POST'])
@jwt_required()
def carnet_checkout():
    user_id = get_jwt_identity()
    pet_id = request.json.get("pet_id")
    if not pet_id:
        return jsonify({"msg": "Falta pet_id"}), 400

    success_url = f"https://miniature-tribble-wr56vg579jgrfvj6q-3000.app.github.dev/pets/{pet_id}?carnet_paid=ok"
    cancel_url  = f"https://miniature-tribble-wr56vg579jgrfvj6q-3000.app.github.dev/pets/{pet_id}?carnet_paid=cancel"

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[{
                "price_data": {
                    "currency": "usd",
                    "product_data": {
                        "name": "Carnet digital de vacunas para tu mascota",
                    },
                    "unit_amount": 100,
                },
                "quantity": 1,
            }],
            mode="payment",
            success_url=success_url,
            cancel_url=cancel_url,
            metadata={
                "user_id": user_id,
                "pet_id": pet_id
            }
        )
        return jsonify({"url": session.url})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/pets/<int:pet_id>/carnet-pdf', methods=['GET'])
def descargar_carnet_demo(pet_id):
    return send_from_directory('static', 'bongo.pdf', as_attachment=True)


