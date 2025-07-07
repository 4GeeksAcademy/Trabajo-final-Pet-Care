"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Pet, Vacuna
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

from flask_swagger import swagger
from flask_jwt_extended import create_access_token, jwt_required, get_jwt, get_jwt_identity
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import timedelta


api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


jwt_blacklist = set()

# RUTA LOGIN
@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):
        raise APIException("Credenciales inválidas", status_code=401)

    access_token = create_access_token(
        identity=str(user.id), expires_delta=timedelta(days=1)
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


#RUTA GET ALL USERS
@api.route('/users', methods=['GET'])
def get_users():
    all_users = User.query.all()
    serialized = [u.serialize() for u in all_users]
    return jsonify(serialized), 200


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



#RUTA REGISTRO DE VACUNAS
@api.route('/mascotas/<int:mascota_id>/vacunas', methods=['POST'])
def add_vacuna(mascota_id):
    data = request.get_json()

    nueva_vacuna = Vacuna(
        nombre=data.get('nombre'),
        descripcion=data.get('descripcion'),
        fecha_aplicacion=data.get('fecha_aplicacion'),
        mascota_id=mascota_id
    )

    db.session.add(nueva_vacuna)
    db.session.commit()

    return jsonify({"msg": "Vacuna agregada exitosamente", "vacuna": nueva_vacuna.serialize()}), 20
  
#RUTA GET MASCOTAS POR ID DE USUARIO
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


