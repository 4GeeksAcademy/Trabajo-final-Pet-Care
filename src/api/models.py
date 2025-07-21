from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Integer, ForeignKey, Boolean, Date, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import date, datetime

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(30), nullable=False)
    apellido: Mapped[str] = mapped_column(String(30), nullable=False)
    email: Mapped[str] = mapped_column(String(80), nullable=False, unique=True)
    password: Mapped[str] = mapped_column(String(500), nullable=False)

    favorites: Mapped[list["Favorite"]] = relationship(
        "Favorite",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "apellido": self.apellido,
            "email": self.email
        }


class Raza(db.Model):
    __tablename__ = "razas"
    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(80), nullable=False)
    descripcion: Mapped[str] = mapped_column(String(250))

    # Relación inversa ➜ ver todas las mascotas de esta raza
    mascotas: Mapped[list["Pet"]] = relationship("Pet", back_populates="razas")

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "descripcion": self.descripcion
        }


class Pet(db.Model):
    __tablename__ = "pets"
    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(30), nullable=False)
    especie: Mapped[str] = mapped_column(String(30), nullable=False)
    foto: Mapped[str] = mapped_column(String(300))
    peso: Mapped[int] = mapped_column(nullable=False)
    raza: Mapped[str] = mapped_column(String(300))
    fecha_nacimiento: Mapped[date] = mapped_column(nullable=False)
    sexo: Mapped[str] = mapped_column(String(10), nullable=False)

    user_id: Mapped[int] = mapped_column(
        db.ForeignKey("users.id"), nullable=False)
    raza_id: Mapped[int] = mapped_column(
        db.ForeignKey("razas.id"), nullable=True)
    vacunas: Mapped[list["Vacuna"]] = relationship(
        "Vacuna", back_populates="mascota")
    recomendaciones: Mapped[list["Recomendacion"]] = relationship(
        "Recomendacion", back_populates="mascota", cascade="all, delete-orphan")
   

    # Relación ➜ cada mascota "apunta" a una raza
    razas: Mapped["Raza"] = relationship("Raza", back_populates="mascotas")

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "especie": self.especie,
            "foto": self.foto,
            "peso": self.peso,
            "user_id": self.user_id,
            # "raza": self.raza.serialize() if self.raza else None
            "raza": self.raza,
            "fecha_nacimiento": self.fecha_nacimiento.isoformat(),
            "sexo": self.sexo
        }


class Vacuna(db.Model):
    __tablename__ = "vacunas"
    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(80), nullable=False)
    descripcion: Mapped[str] = mapped_column(String(250))
    fecha_aplicacion: Mapped[date] = mapped_column(nullable=True)

    mascota_id: Mapped[int] = mapped_column(
        db.ForeignKey("pets.id"), nullable=False)
    mascota: Mapped["Pet"] = relationship("Pet", back_populates="vacunas")

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "descripcion": self.descripcion,
            "fecha_aplicacion": self.fecha_aplicacion.isoformat() if self.fecha_aplicacion else None,
            "mascota_id": self.mascota_id
        }


#MODELO FAVORITOS 
class Favorite(db.Model):
    __tablename__ = "favorites"

    id:       Mapped[int]    = mapped_column(primary_key=True)
    user_id:  Mapped[int]    = mapped_column(ForeignKey("users.id"), nullable=False)
    place_id: Mapped[str]    = mapped_column(String(100), nullable=False)
    name:     Mapped[str]    = mapped_column(String(200), nullable=False)
    address:  Mapped[str]    = mapped_column(String(300), nullable=True)
    phone:    Mapped[str]    = mapped_column(String(50),  nullable=True)
    website:  Mapped[str]    = mapped_column(String(200), nullable=True)

    user:     Mapped["User"] = relationship("User", back_populates="favorites")

    def serialize(self):
        return {
            "id":       self.id,
            "user_id":  self.user_id,
            "place_id": self.place_id,
            "name":     self.name,
            "address":  self.address,
            "phone":    self.phone,
            "website":  self.website,
        }

class Recomendacion(db.Model):
    __tablename__ = "recomendaciones"
    id: Mapped[int] = mapped_column(primary_key=True)
    pregunta: Mapped[str] = mapped_column(String(500), nullable=False)
    respuesta: Mapped[str] = mapped_column(String(2000), nullable=False)
    fecha: Mapped[date] = mapped_column(default=date.today)

    mascota_id: Mapped[int] = mapped_column(ForeignKey("pets.id"), nullable=False)
    mascota: Mapped["Pet"] = relationship("Pet", back_populates="recomendaciones")

    def serialize(self):
        return {
            "id": self.id,
            "pregunta": self.pregunta,
            "respuesta": self.respuesta,
            "fecha": self.fecha.isoformat(),
            "mascota_id": self.mascota_id
        }
    
class MedicalProfile(db.Model):
    __tablename__ = "medical_profiles"
    id: Mapped[int] = mapped_column(primary_key=True)
    pet_id: Mapped[int] = mapped_column(db.ForeignKey("pets.id"), nullable=False, unique=True)

    alergias: Mapped[str] = mapped_column(String(300), default="", nullable=True)
    condiciones_previas: Mapped[str] = mapped_column(String(500), default="", nullable=True)
    medicamentos_actuales: Mapped[str] = mapped_column(String(250), default="", nullable=True)
    esterilizado: Mapped[bool] = mapped_column(Boolean, default=False)
    fecha_ultima_revision: Mapped[date] = mapped_column(Date, nullable=True)
    veterinario_habitual: Mapped[str] = mapped_column(String(100), default="", nullable=True)
    observaciones: Mapped[str] = mapped_column(String(800), default="", nullable=True)
    grupo_sanguineo: Mapped[str] = mapped_column(String(20), default="", nullable=True)
    microchip: Mapped[str] = mapped_column(String(100), default="", nullable=True)

    pet: Mapped["Pet"] = relationship("Pet", backref="perfil_medico", uselist=False)

    def serialize(self):
        return {
            "id": self.id,
            "pet_id": self.pet_id,
            "alergias": self.alergias,
            "condiciones_previas": self.condiciones_previas,
            "medicamentos_actuales": self.medicamentos_actuales,
            "esterilizado": self.esterilizado,
            "fecha_ultima_revision": self.fecha_ultima_revision.isoformat() if self.fecha_ultima_revision else None,
            "veterinario_habitual": self.veterinario_habitual,
            "observaciones": self.observaciones,
            "grupo_sanguineo": self.grupo_sanguineo,
            "microchip": self.microchip
        }

