import os


class Config:
    # Flask
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-change-me")

    # JWT
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jwt-dev-secret-change-me")
    JWT_ACCESS_TOKEN_EXPIRES = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES", "86400"))  # seconds

    # CORS
    CLIENT_ORIGIN = os.getenv("CLIENT_ORIGIN", "http://localhost:5173")

    # MySQL
    DB_HOST = os.getenv("DB_HOST", "localhost")
    DB_USER = os.getenv("DB_USER", "root")
    DB_PASSWORD = os.getenv("DB_PASSWORD", "")
    DB_NAME = os.getenv("DB_NAME", "placement_app")
    DB_PORT = int(os.getenv("DB_PORT", "3306"))

    # Server
    PORT = int(os.getenv("PORT", "5000"))


