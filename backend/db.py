import mysql.connector
from mysql.connector import pooling

from config import Config


_pool = None


def init_db_pool():
    global _pool
    if _pool is not None:
        return _pool

    _pool = pooling.MySQLConnectionPool(
        pool_name="placement_pool",
        pool_size=10,
        host=Config.DB_HOST,
        user=Config.DB_USER,
        password=Config.DB_PASSWORD,
        database=Config.DB_NAME,
        port=Config.DB_PORT,
        autocommit=False,
    )
    return _pool


def get_conn():
    if _pool is None:
        init_db_pool()
    return _pool.get_connection()


def query_one(sql, params=None):
    conn = get_conn()
    try:
        cur = conn.cursor(dictionary=True)
        cur.execute(sql, params or ())
        row = cur.fetchone()
        conn.commit()
        return row
    finally:
        try:
            cur.close()
        except Exception:
            pass
        conn.close()


def query_all(sql, params=None):
    conn = get_conn()
    try:
        cur = conn.cursor(dictionary=True)
        cur.execute(sql, params or ())
        rows = cur.fetchall()
        conn.commit()
        return rows
    finally:
        try:
            cur.close()
        except Exception:
            pass
        conn.close()


def execute(sql, params=None):
    conn = get_conn()
    try:
        cur = conn.cursor()
        cur.execute(sql, params or ())
        last_id = cur.lastrowid
        conn.commit()
        return last_id
    except Exception:
        conn.rollback()
        raise
    finally:
        try:
            cur.close()
        except Exception:
            pass
        conn.close()


