from flask import Flask
import os

app = Flask(__name__)

HOST = os.getenv("HOST") or "0.0.0.0"
PORT = os.getenv("PORT") or 5000


@app.get("/")
def heartbeat():
    return {
        "message": f"The app is alive at {HOST}/{PORT}",
        "ok": True,
    }


@app.post("/visitor")
def increment_counter():
    return {
        "message": f"This endpoint is still under construction",
        "ok": True
    }


if __name__ == '__main__':
    app.run(
        host=HOST,
        port=PORT,
        # auto reload on code change
        debug=True
    )

# See PyCharm help at https://www.jetbrains.com/help/pycharm/
