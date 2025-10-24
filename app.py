from flask import Flask, g
import os
import redis
from urllib.parse import urlparse

app = Flask(__name__)

HOST = os.getenv("HOST") or "0.0.0.0"
PORT = os.getenv("PORT") or 5000

is_local = os.environ.get("ENV") or "prod"
local_redis_url = os.environ.get("REDIS_URL") or "http://localhost:6379"
app.config['REDIS_URL'] = local_redis_url if is_local else os.environ.get("REDISCLOUD_URL")


def get_redis():
    """Get Redis client from Flask's g object"""
    if 'redis' not in g:
        redis_url = urlparse(app.config['REDIS_URL'])
        g.redis = redis.Redis(
            host=redis_url.hostname,
            port=redis_url.port,
            decode_responses=True if is_local else False,
            password=None if is_local else redis_url.password
        )
    return g.redis


@app.teardown_appcontext
def close_redis(error):
    """Close the Redis connection after request"""
    redis_client = g.pop('redis', None)

    if redis_client is not None:
        redis_client.close()

@app.get("/")
def heartbeat():
    return {
        "message": f"The app is alive at {HOST}/{PORT}",
        "ok": True,
    }


@app.post("/visitor")
def increment_counter():
    redis_client = get_redis()

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
        port=PORT,
        # auto reload on code change
        debug=True
    )
