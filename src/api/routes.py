from flask import request, jsonify, Blueprint
from flask_jwt_extended import (
    create_access_token, jwt_required, get_jwt, get_jwt_identity
)
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import timedelta
from .models import db, User, Pet, Vacuna
from .utils import APIException

api = Blueprint('api', __name__)

jwt_blacklist = set()

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
        identity=user.id, expires_delta=timedelta(days=1)
    )
    return jsonify({"token": access_token, "user": user.serialize()}), 200

# RUTA LOGOUT
@api.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    jwt_blacklist.add(jti)
    return jsonify({"message": "Logged out and token revoked"}), 200

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

# RUTA REGISTRO DE MASCOTA
@api.route('/pets', methods=['POST'])
def register_pet():
    data = request.get_json()
    nombre = data.get('nombre')
    especie = data.get('especie')
    raza = data.get('raza')
    foto = data.get('foto')
    peso = data.get('peso')
    user_id = data.get('user_id')
    if not nombre or not especie or not raza or not peso:
        return jsonify({'msg': 'Todos los campos son obligatorios, excepto la foto 🥰'}), 400
    try:
        nueva_mascota = Pet(
            nombre=nombre,
            especie=especie,
            raza=raza,
            foto=foto,
            peso=peso,
            user_id=user_id
        )
        db.session.add(nueva_mascota)
        db.session.commit()
        return jsonify({'msg': 'Mascota registrada con éxito 😎'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'msg': 'Error al registrar la mascota', 'error': str(e)}), 500

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

# RUTA OBTENER TODAS LAS MASCOTAS
@api.route('/all_pets', methods=['GET'])
def get_all_pets():
    try:
        pets = Pet.query.all()
        return jsonify([pet.serialize() for pet in pets]), 200
    except Exception as e:
        return jsonify({'msg': 'Error al obtener las mascotas', 'error': str(e)}), 500

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

# RUTA ACTUALIZAR USUARIO
@api.route('/user/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    data = request.get_json()
    nombre = data.get('nombre')
    apellido = data.get('apellido')
    email = data.get('email')
    password = data.get('password')
    current_user = get_jwt_identity()
    if current_user != user_id:
        return jsonify({'msg': 'No tienes permiso para actualizar este usuario'}), 403
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'msg': 'Usuario no encontrado'}), 404
        user.nombre = nombre
        user.apellido = apellido
        user.email = email
        if password:
            user.password = generate_password_hash(password)
        db.session.commit()
        return jsonify({'msg': 'Usuario actualizado correctamente'}), 200
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

# RUTA OBTENER MASCOTA POR ID
@api.route('/pet/<int:pet_id>', methods=['GET'])
def get_pet_by_id(pet_id):
    try:
        pet = Pet.query.get(pet_id)
        if not pet:
            return jsonify({'msg': 'Mascota no encontrada'}), 404
        return jsonify(pet.serialize()), 200
    except Exception as e:
        return jsonify({'msg': 'Error al obtener la mascota', 'error': str(e)}), 500

# RUTA ACTUALIZAR MASCOTA
@api.route('/pet/<int:pet_id>', methods=['PUT'])
@jwt_required()
def update_pet(pet_id):
    data = request.get_json()
    nombre = data.get('nombre')
    especie = data.get('especie')
    raza = data.get('raza')
    foto = data.get('foto')
    peso = data.get('peso')
    user_id = data.get('user_id')
    try:
        pet = Pet.query.get(pet_id)
        if not pet:
            return jsonify({'msg': 'Mascota no encontrada'}), 404
        pet.nombre = nombre
        pet.especie = especie
        pet.raza = raza
        pet.foto = foto
        pet.peso = peso
        pet.user_id = user_id
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
        if not pet:
            return jsonify({'msg': 'Mascota no encontrada'}), 404
        if pet.user_id != current_user:
            return jsonify({'msg': 'No tienes permiso para eliminar esta mascota'}), 403
        db.session.delete(pet)
        db.session.commit()
        return jsonify({'msg': 'Mascota eliminada correctamente'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'msg': 'Error al eliminar la mascota', 'error': str(e)}), 500

# RUTA REGISTRO DE VACUNA
@api.route('/mascotas/<int:mascota_id>/vacunas', methods=['POST'])
def add_vacuna(mascota_id):
    """Registra una nueva vacuna para una mascota específica."""
    data = request.get_json()
    if not data.get('nombre') or not data.get('fecha_aplicacion'):
        return jsonify({"msg": "El nombre y la fecha de aplicación son obligatorios"}), 400

    nueva_vacuna = Vacuna(
        nombre=data.get('nombre'),
        descripcion=data.get('descripcion'),
        fecha_aplicacion=data.get('fecha_aplicacion'),
        mascota_id=mascota_id
    )

    db.session.add(nueva_vacuna)
    db.session.commit()

    return jsonify({"msg": "Vacuna agregada exitosamente", "vacuna": nueva_vacuna.serialize()}), 201
