from flask import Flask, render_template, request, jsonify
import sqlite3
import os

from services.weather import get_weather
from services.risk_engine import calculate_risk

app = Flask(__name__)

DATABASE = "landsafe.db"


def init_db():
    conn = sqlite3.connect(DATABASE)

    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS analyses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            latitude REAL,
            longitude REAL,
            rainfall_24h REAL,
            rainfall_72h REAL,
            risk_score REAL,
            risk_level TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    conn.commit()
    conn.close()


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/analyze", methods=["POST"])
def analyze():

    try:

        data = request.get_json()

        latitude = float(data["latitude"])
        longitude = float(data["longitude"])

        weather = get_weather(latitude, longitude)

        risk = calculate_risk(
            rainfall_24h=weather["rainfall_24h"],
            rainfall_72h=weather["rainfall_72h"],
            latitude=latitude,
            longitude=longitude
        )

        conn = sqlite3.connect(DATABASE)

        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO analyses
            (
                latitude,
                longitude,
                rainfall_24h,
                rainfall_72h,
                risk_score,
                risk_level
            )
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            latitude,
            longitude,
            weather["rainfall_24h"],
            weather["rainfall_72h"],
            risk["risk_score"],
            risk["risk_level"]
        ))

        conn.commit()
        conn.close()

        return jsonify({
            "success": True,
            "location": {
                "latitude": latitude,
                "longitude": longitude
            },
            "weather": weather,
            "risk": risk
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route("/api/history")
def history():

    conn = sqlite3.connect(DATABASE)

    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            latitude,
            longitude,
            rainfall_24h,
            rainfall_72h,
            risk_score,
            risk_level,
            created_at
        FROM analyses
        ORDER BY id DESC
        LIMIT 20
    """)

    rows = cursor.fetchall()

    conn.close()

    results = []

    for row in rows:

        results.append({
            "latitude": row[0],
            "longitude": row[1],
            "rainfall_24h": row[2],
            "rainfall_72h": row[3],
            "risk_score": row[4],
            "risk_level": row[5],
            "created_at": row[6]
        })

    return jsonify(results)


if __name__ == "__main__":

    init_db()

    app.run(
        debug=True,
        host="0.0.0.0",
        port=5000
    )
    