from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt, get_jwt_identity, jwt_required

from db import execute, query_all


interview_bp = Blueprint("interview", __name__)


def _require_student():
    claims = get_jwt()
    if claims.get("role") != "student":
        return jsonify({"message": "Forbidden"}), 403
    return None


@interview_bp.post("/interview")
@jwt_required()
def add_interview():
    forbid = _require_student()
    if forbid:
        return forbid

    user_id = int(get_jwt_identity())
    data = request.get_json(silent=True) or {}

    company = data.get("company")
    interview_date = data.get("date") or data.get("interview_date") or data.get("interviewDate")
    round_name = data.get("round")
    result = data.get("result", "Pending")
    feedback = data.get("feedback")

    if not company or not interview_date or not round_name or not result:
        return jsonify({"message": "Missing required fields"}), 400

    iv_id = execute(
        """
        INSERT INTO interviews (user_id, company, interview_date, round, result, feedback)
        VALUES (%s, %s, %s, %s, %s, %s)
        """,
        (user_id, company, interview_date, round_name, result, feedback),
    )
    return jsonify({"message": "Interview logged", "id": iv_id}), 201


@interview_bp.get("/interviews")
@jwt_required()
def get_interviews():
    forbid = _require_student()
    if forbid:
        return forbid

    user_id = int(get_jwt_identity())
    rows = query_all(
        """
        SELECT id, company, interview_date AS date, round, result, feedback
        FROM interviews
        WHERE user_id=%s
        ORDER BY interview_date DESC, id DESC
        """,
        (user_id,),
    )
    for r in rows:
        r["_id"] = r["id"]
    return jsonify(rows)


