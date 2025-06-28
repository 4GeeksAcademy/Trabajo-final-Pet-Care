"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

from flask_swagger import swagger
from flask_jwt_extended import create_access_token
from werkzeug.security import check_password_hash
from datetime import timedelta


api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


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
        identity=str(user.id), expires_delta=timedelta(days=1))

    return jsonify({"token": access_token, "user": user.serialize()}), 200


    return jsonify(response_body), 200



@api.route('/logout', methods=['POST'])
def logout():
    return jsonify({"message": "Logged out successfully"}), 200
  
user_bp = Blueprint('user', __name__)

@user_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    if not username or not email or not password:
        return jsonify({'msg': 'Todos los campos son obligatorios'}), 400
    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({'msg': 'El usuario ya existe'}), 400

    hashed_password = generate_password_hash(password)
    new_user = User(username=username, email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'msg': 'Usuario registrado correctamente'}), 201


