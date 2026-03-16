from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token

from db import execute, query_one
from extensions import bcrypt


auth_bp = Blueprint("auth", __name__)


def _public_user(user_row):
    if not user_row:
        return None
    # Provide `_id` for frontend compatibility (some pages use Mongo-style ids)
    return {
        "_id": user_row["id"],
        "id": user_row["id"],
        "name": user_row["name"],
        "email": user_row["email"],
        "phone": user_row.get("phone"),
        "department": user_row.get("department"),
        "year": user_row.get("year"),
        "skills": user_row.get("skills"),
        "role": user_row.get("role"),
    }


@auth_bp.post("/register")
def register():
    data = request.get_json(silent=True) or {}
    required = ["name", "email", "password"]
    if any(not data.get(k) for k in required):
        return jsonify({"message": "Missing required fields"}), 400

    existing = query_one("SELECT id FROM users WHERE email=%s", (data["email"],))
    if existing:
        return jsonify({"message": "Email already registered"}), 409

    pw_hash = bcrypt.generate_password_hash(data["password"]).decode("utf-8")
    user_id = execute(
        """
        INSERT INTO users (name, email, password, phone, department, year, skills, role)
        VALUES (%s, %s, %s, %s, %s, %s, %s, 'student')
        """,
        (
            data.get("name"),
            data.get("email"),
            pw_hash,
            data.get("phone"),
            data.get("department"),
            data.get("year"),
            data.get("skills"),
        ),
    )

    return jsonify({"message": "Registered successfully", "id": user_id}), 201


@auth_bp.post("/login")
def login_student():
    data = request.get_json(silent=True) or {}
    email = data.get("email")
    password = data.get("password")
    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    user = query_one("SELECT * FROM users WHERE email=%s AND role='student'", (email,))
    if not user or not bcrypt.check_password_hash(user["password"], password):
        return jsonify({"message": "Invalid email or password"}), 401

    token = create_access_token(identity=str(user["id"]), additional_claims={"role": "student"})
    return jsonify({"token": token, "user": _public_user(user)})


@auth_bp.post("/admin/login")
def login_admin():
    data = request.get_json(silent=True) or {}
    username = data.get("username")
    password = data.get("password")
    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400

    # For simplicity: admin "username" maps to admin email OR name (commonly "admin")
    admin = query_one(
        "SELECT * FROM users WHERE role='admin' AND (email=%s OR name=%s) LIMIT 1",
        (username, username),
    )
    if not admin or not bcrypt.check_password_hash(admin["password"], password):
        return jsonify({"message": "Invalid credentials"}), 401

    token = create_access_token(identity=str(admin["id"]), additional_claims={"role": "admin"})
    admin_public = _public_user(admin)
    return jsonify({"token": token, "admin": admin_public})


