from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt, get_jwt_identity, jwt_required

from db import execute, query_all, query_one


mocktest_bp = Blueprint("mocktest", __name__)


def _require_student():
    claims = get_jwt()
    if claims.get("role") != "student":
        return jsonify({"message": "Forbidden"}), 403
    return None


@mocktest_bp.get("/mocktests")
@jwt_required()
def get_questions():
    # Student-only (matches UI flow)
    forbid = _require_student()
    if forbid:
        return forbid

    rows = query_all(
        """
        SELECT id, question, optionA, optionB, optionC, optionD
        FROM mocktests
        ORDER BY id DESC
        """
    )
    for r in rows:
        r["_id"] = r["id"]
    return jsonify(rows)


@mocktest_bp.post("/mocktest/submit")
@jwt_required()
def submit_mocktest():
    forbid = _require_student()
    if forbid:
        return forbid

    user_id = int(get_jwt_identity())
    data = request.get_json(silent=True) or {}
    answers = data.get("answers") or []
    if not isinstance(answers, list) or len(answers) == 0:
        return jsonify({"message": "Answers are required"}), 400

    # Compute score by looking up correct answers
    score = 0
    total = len(answers)

    for a in answers:
        qid = a.get("questionId")
        selected = a.get("selected")
        if qid is None or not selected:
            return jsonify({"message": "Invalid answers payload"}), 400

        try:
            qid_int = int(qid)
        except Exception:
            # If frontend sends a string, still try
            return jsonify({"message": "Invalid questionId"}), 400

        row = query_one("SELECT correct_answer FROM mocktests WHERE id=%s", (qid_int,))
        if row and row.get("correct_answer") == selected:
            score += 1

    # Persist result
    execute(
        "INSERT INTO test_results (user_id, score, test_date) VALUES (%s, %s, CURDATE())",
        (user_id, score),
    )

    return jsonify({"score": score, "total": total})


@mocktest_bp.get("/mocktest/results")
@jwt_required()
def get_results():
    forbid = _require_student()
    if forbid:
        return forbid

    user_id = int(get_jwt_identity())
    rows = query_all(
        """
        SELECT id, score, test_date
        FROM test_results
        WHERE user_id=%s
        ORDER BY test_date DESC, id DESC
        """,
        (user_id,),
    )
    for r in rows:
        r["_id"] = r["id"]
        r["date"] = r.pop("test_date")
    return jsonify(rows)


