from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from datetime import date


db = SQLAlchemy()

 
class User(db.Model):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(30), nullable=False)
    apellido: Mapped[str] = mapped_column(String(30), nullable=False)
    email: Mapped[str] = mapped_column(String(80), nullable=False, unique=True)
    password: Mapped[str] = mapped_column(String(500), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "apellido": self.apellido,
            "email": self.email
        }
    

class Pet(db.Model):
    __tablename__ = "pets"
    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(30), nullable=False)
    especie: Mapped[str] = mapped_column(String(30), nullable=False)
    raza: Mapped[str] = mapped_column(String(30), nullable=False)
    foto: Mapped[str] = mapped_column(String(300)) # <-- url de la foto... creo...
    peso: Mapped[int] = mapped_column(nullable=False)

    user_id: Mapped[int] = mapped_column(db.ForeignKey("users.id"), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "especie": self.especie,
            "raza": self.raza,
            "foto": self.foto, # <-- ???
            "peso": self.peso
        }

class Vacuna(db.Model):
    __tablename__ = "vacunas"
    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(80), nullable=False)
    descripcion: Mapped[str] = mapped_column(String(250))
    fecha_aplicacion: Mapped[date] = mapped_column(nullable=True)
    
    mascota_id: Mapped[int] = mapped_column(db.ForeignKey("pets.id"), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "descripcion": self.descripcion,
            "fecha_aplicacion": self.fecha_aplicacion.isoformat() if self.fecha_aplicacion else None,
            "mascota_id": self.mascota_id
        }
   
    
