from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Integer, ForeignKey, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import date

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

    user_id: Mapped[int] = mapped_column(
        db.ForeignKey("users.id"), nullable=False)
    raza_id: Mapped[int] = mapped_column(
        db.ForeignKey("razas.id"), nullable=True)
    vacunas: Mapped[list["Vacuna"]] = relationship(
        "Vacuna", back_populates="mascota")

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
            "raza": self.raza
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
