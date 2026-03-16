from flask import Flask, jsonify
from flask_cors import CORS

from config import Config
from db import init_db_pool
from extensions import bcrypt, jwt

from routes.auth_routes import auth_bp
from routes.student_routes import student_bp
from routes.admin_routes import admin_bp
from routes.mocktest_routes import mocktest_bp
from routes.interview_routes import interview_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Extensions
    bcrypt.init_app(app)
    jwt.init_app(app)
    # CORS for React dev server (allow localhost/127.0.0.1 on any port during development)
    CORS(
        app,
        resources={r"/api/*": {"origins": ["http://localhost:*", "http://127.0.0.1:*", Config.CLIENT_ORIGIN]}},
        supports_credentials=True,
    )

    # DB
    init_db_pool()

    # Blueprints
    app.register_blueprint(auth_bp, url_prefix="/api")
    app.register_blueprint(student_bp, url_prefix="/api")
    app.register_blueprint(interview_bp, url_prefix="/api")
    app.register_blueprint(mocktest_bp, url_prefix="/api")
    app.register_blueprint(admin_bp, url_prefix="/api")

    @app.get("/api/health")
    def health():
        return jsonify({"status": "ok"})

    @app.errorhandler(404)
    def not_found(_):
        return jsonify({"message": "Not found"}), 404

    @app.errorhandler(500)
    def server_error(err):
        return jsonify({"message": "Internal server error"}), 500

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=Config.PORT, debug=True)


