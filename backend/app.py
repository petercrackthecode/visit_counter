from flask import Flask, jsonify
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_cors import CORS
import os
import redis
from urllib.parse import urlparse

app = Flask(__name__)
# allow all origins for now. Must be fixed in production
CORS(app)

HOST: str = os.getenv("HOST") or "0.0.0.0"
PORT: str = os.getenv("PORT") or 5000
is_local: bool = os.environ.get("ENV", "local") == "local"

local_redis_url: str = os.environ.get("REDIS_URL") or "redis://localhost:6379"
app.config["REDIS_URL"] = local_redis_url if is_local else os.environ.get("REDISCLOUD_URL")
# use Redis for the rate limiter
app.config["RATELIMIT_STORAGE_URI"] = app.config["REDIS_URL"]

limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=['1/30 minutes'],
    strategy="moving-window"
)

redis_url = urlparse(app.config['REDIS_URL'])
redis_pool = redis.ConnectionPool(
    host=redis_url.hostname,
    port=redis_url.port,
    username=redis_url.username,
    password=redis_url.password,
    max_connections=20
)

def get_redis():
    """Get Redis client from the connection pool"""
    return redis.Redis(connection_pool=redis_pool)

@app.get("/")
@limiter.exempt
def heartbeat():
    return {
        "message": f"The app is alive at {HOST}/{PORT}",
        "ok": True,
    }


@app.post("/visitor")
def increment_counter():
    redis_client = get_redis()

    redis_client.setnx("visitor", 0)
    new_visitors_cnt = redis_client.incr("visitor", amount=1)

    return jsonify({
        "visitors": new_visitors_cnt,
        "ok": True
    }), 200


@app.get("/visitor")
@limiter.exempt
def get_counter():
    redis_client = get_redis()

    redis_client.setnx("visitor", 0)
    visitor_cnt = redis_client.get("visitor")

    try:
        return jsonify({
            "visitors": int(visitor_cnt),
            "ok": True
        }), 200
    except TypeError:
        return jsonify({
            "errorMessage": "Internal server error: failed to fetch the visitor count",
            "ok": False,
        }), 500

@app.errorhandler(429)
def ratelimit_handler(_):
    return jsonify({
        "errorMessage": "Too many requests",
        "ok": False,
    }), 429


if __name__ == '__main__':
    app.run(
        host=HOST,
        port=int(PORT),
        # auto reload on code change
        debug=True
    )
