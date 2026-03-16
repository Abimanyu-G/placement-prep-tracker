from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt, jwt_required

from db import execute, query_all


admin_bp = Blueprint("admin", __name__)


def _require_admin():
    claims = get_jwt()
    if claims.get("role") != "admin":
        return jsonify({"message": "Forbidden"}), 403
    return None


@admin_bp.get("/admin/students")
@jwt_required()
def admin_students():
    forbid = _require_admin()
    if forbid:
        return forbid

    rows = query_all(
        """
        SELECT id, name, email, phone, department, year, skills, role
        FROM users
        WHERE role='student'
        ORDER BY id DESC
        """
    )
    for r in rows:
        r["_id"] = r["id"]
    return jsonify(rows)


@admin_bp.get("/admin/interviews")
@jwt_required()
def admin_interviews():
    forbid = _require_admin()
    if forbid:
        return forbid

    rows = query_all(
        """
        SELECT i.id, u.name AS studentName, i.company, i.interview_date AS date, i.round, i.result
        FROM interviews i
        JOIN users u ON u.id = i.user_id
        ORDER BY i.interview_date DESC, i.id DESC
        """
    )
    for r in rows:
        r["_id"] = r["id"]
    return jsonify(rows)


@admin_bp.post("/admin/mocktest")
@jwt_required()
def add_mock_question():
    forbid = _require_admin()
    if forbid:
        return forbid

    data = request.get_json(silent=True) or {}
    required = ["question", "optionA", "optionB", "optionC", "optionD", "correctAnswer"]
    if any(not data.get(k) for k in required):
        return jsonify({"message": "Missing required fields"}), 400

    qid = execute(
        """
        INSERT INTO mocktests (question, optionA, optionB, optionC, optionD, correct_answer)
        VALUES (%s, %s, %s, %s, %s, %s)
        """,
        (
            data.get("question"),
            data.get("optionA"),
            data.get("optionB"),
            data.get("optionC"),
            data.get("optionD"),
            data.get("correctAnswer"),
        ),
    )
    return jsonify({"message": "Question added", "id": qid}), 201


@admin_bp.get("/admin/dashboard")
@jwt_required()
def admin_dashboard():
    forbid = _require_admin()
    if forbid:
        return forbid

    total_students = query_all("SELECT COUNT(*) AS c FROM users WHERE role='student'")[0]["c"]
    total_interviews = query_all("SELECT COUNT(*) AS c FROM interviews")[0]["c"]
    total_mocktests = query_all("SELECT COUNT(*) AS c FROM test_results")[0]["c"]

    return jsonify({
        "totalStudents": int(total_students),
        "totalInterviews": int(total_interviews),
        "totalMockTests": int(total_mocktests),
    })


