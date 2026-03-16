from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt, get_jwt_identity, jwt_required

from db import execute, query_all, query_one


student_bp = Blueprint("student", __name__)


def _require_student():
    claims = get_jwt()
    if claims.get("role") != "student":
        return jsonify({"message": "Forbidden"}), 403
    return None


@student_bp.get("/profile")
@jwt_required()
def get_profile():
    forbid = _require_student()
    if forbid:
        return forbid

    user_id = int(get_jwt_identity())
    user = query_one(
        "SELECT id, name, email, phone, department, year, skills, role FROM users WHERE id=%s",
        (user_id,),
    )
    if not user:
        return jsonify({"message": "User not found"}), 404
    user["_id"] = user["id"]
    return jsonify(user)


@student_bp.put("/profile")
@jwt_required()
def update_profile():
    forbid = _require_student()
    if forbid:
        return forbid

    user_id = int(get_jwt_identity())
    data = request.get_json(silent=True) or {}

    # Only allow these fields
    name = data.get("name")
    phone = data.get("phone")
    department = data.get("department")
    year = data.get("year")
    skills = data.get("skills")

    if not name:
        return jsonify({"message": "Name is required"}), 400

    execute(
        """
        UPDATE users
        SET name=%s, phone=%s, department=%s, year=%s, skills=%s
        WHERE id=%s
        """,
        (name, phone, department, year, skills, user_id),
    )
    return jsonify({"message": "Profile updated"})


@student_bp.post("/preparation")
@jwt_required()
def add_preparation():
    forbid = _require_student()
    if forbid:
        return forbid

    user_id = int(get_jwt_identity())
    data = request.get_json(silent=True) or {}
    topic = data.get("topic")
    platform = data.get("platform")
    problems_solved = data.get("problemsSolved") or data.get("problems_solved")
    date = data.get("date")

    if not topic or not platform or not problems_solved or not date:
        return jsonify({"message": "Missing required fields"}), 400

    try:
        problems_solved = int(problems_solved)
    except Exception:
        return jsonify({"message": "problemsSolved must be a number"}), 400

    log_id = execute(
        """
        INSERT INTO preparation_logs (user_id, topic, platform, problems_solved, date)
        VALUES (%s, %s, %s, %s, %s)
        """,
        (user_id, topic, platform, problems_solved, date),
    )
    return jsonify({"message": "Log added", "id": log_id}), 201


@student_bp.get("/preparation")
@jwt_required()
def get_preparations():
    forbid = _require_student()
    if forbid:
        return forbid

    user_id = int(get_jwt_identity())
    logs = query_all(
        """
        SELECT id, topic, platform, problems_solved AS problemsSolved, date
        FROM preparation_logs
        WHERE user_id=%s
        ORDER BY date DESC, id DESC
        """,
        (user_id,),
    )
    for l in logs:
        l["_id"] = l["id"]
    return jsonify(logs)


@student_bp.get("/dashboard")
@jwt_required()
def dashboard_stats():
    forbid = _require_student()
    if forbid:
        return forbid

    user_id = int(get_jwt_identity())

    total_interviews = query_one("SELECT COUNT(*) AS c FROM interviews WHERE user_id=%s", (user_id,))["c"]
    total_preps = query_one("SELECT COUNT(*) AS c FROM preparation_logs WHERE user_id=%s", (user_id,))["c"]
    total_mock = query_one("SELECT COUNT(*) AS c FROM test_results WHERE user_id=%s", (user_id,))["c"]
    avg_mock = query_one("SELECT AVG(score) AS a FROM test_results WHERE user_id=%s", (user_id,))["a"]

    avg_mock_score = None if avg_mock is None else int(round(float(avg_mock)))
    return jsonify({
        "totalInterviews": int(total_interviews),
        "totalPreparations": int(total_preps),
        "totalMockTests": int(total_mock),
        "avgMockScore": avg_mock_score,
    })


