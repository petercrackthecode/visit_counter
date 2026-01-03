from flask import Flask, g
import os
import redis
from urllib.parse import urlparse

app = Flask(__name__)

HOST: str = os.getenv("HOST") or "0.0.0.0"
PORT: str = os.getenv("PORT") or 5000
is_local: bool = os.environ.get("ENV", "local") == "local"

local_redis_url: str = os.environ.get("REDIS_URL") or "http://localhost:6379"
app.config['REDIS_URL'] = local_redis_url if is_local else os.environ.get("REDISCLOUD_URL")

redis_url = urlparse(app.config['REDIS_URL'])
redis_pool = redis.ConnectionPool(
    host=redis_url.hostname,
    port=redis_url.port,
    username=redis_url.username,
    password=redis_url.password,
    max_connections=20
)

def get_redis():
    """Get Redis client from Flask's g object"""
    return redis.Redis(connection_pool=redis_pool)

@app.get("/")
def heartbeat():
    return {
        "message": f"The app is alive at {HOST}/{PORT}",
        "ok": True,
    }


@app.post("/visitor")
def increment_counter():
    redis_client = get_redis()

    print(f"\n\napp.config['REDIS_URL'] = {app.config['REDIS_URL']}\n\n")
    print(f'\n\nredis_client = {redis_client}\n\n')

    redis_client.setnx("visitor", 0)
    visitors_count = redis_client.incr("visitor", amount=1)

    return {
        "visitors": visitors_count,
        "ok": True
    }


if __name__ == '__main__':
    app.run(
        host=HOST,
        port=int(PORT),
        # auto reload on code change
        debug=True
    )
