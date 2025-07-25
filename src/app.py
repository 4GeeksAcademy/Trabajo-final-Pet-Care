"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
import stripe
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from flask_jwt_extended import JWTManager           
from api.utils import APIException, generate_sitemap
from api.models import db
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from dotenv import load_dotenv
load_dotenv()
from api.models import User
from werkzeug.security import generate_password_hash

# from models import Person


ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../dist/')
app = Flask(__name__)
app.url_map.strict_slashes = False

# database configuration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)


app.config["JWT_SECRET_KEY"] = "super-secret-key"
jwt = JWTManager(app)

jwt_blacklist = set()

@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    jti = jwt_payload["jti"]
    return jti in jwt_blacklist

# add the admin
setup_admin(app)

# add the commands
setup_commands(app)

# Add all endpoints from the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints
@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response

# carga de usuarios
def carga_usuarios_admin():
    admin_email_1 = os.getenv('ADMIN_EMAIL_1')
    admin_password_1 = os.getenv('ADMIN_PASSWORD_1')
    admin_nombre_1 = os.getenv('ADMIN_NOMBRE_1')
    admin_apellido_1 = os.getenv('ADMIN_APELLIDO_1')
    admin_email_2 = os.getenv('ADMIN_EMAIL_2')
    admin_password_2 = os.getenv('ADMIN_PASSWORD_2')
    admin_nombre_2 = os.getenv('ADMIN_NOMBRE_2')
    admin_apellido_2 = os.getenv('ADMIN_APELLIDO_2')

    usuarios_a_crear = []

    if not User.query.filter_by(email=admin_email_1).first():
        password_hash_1 = generate_password_hash(admin_password_1)
        new_user_1 = User(
            nombre=admin_nombre_1,
            apellido=admin_apellido_1,
            email=admin_email_1,
            password=password_hash_1,
            is_admin = True
        )
        usuarios_a_crear.append(new_user_1)
    else:
        print(f"[INFO] Ya existe un usuario con el email {admin_email_1}, no se crea.")

    if not User.query.filter_by(email=admin_email_2).first():
        password_hash_2 = generate_password_hash(admin_password_2)
        new_user_2 = User(
            nombre=admin_nombre_2,
            apellido=admin_apellido_2,
            email=admin_email_2,
            password=password_hash_2,
            is_admin = True
        )
        usuarios_a_crear.append(new_user_2)
    else:
        print(f"[INFO] Ya existe un usuario con el email {admin_email_2}, no se crea.")

    if usuarios_a_crear:
        db.session.add_all(usuarios_a_crear)
        db.session.commit()
        print(f"[OK] Se crearon {len(usuarios_a_crear)} usuario(s) admin.")
    else:
        print("[OK] Todos los usuarios admin ya existen. No se agregó ninguno nuevo.")



with app.app_context():
    carga_usuarios_admin()

# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
