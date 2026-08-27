import requests
from datetime import datetime


def get_weather(latitude, longitude):

    url = "https://api.open-meteo.com/v1/forecast"

    params = {
        "latitude": latitude,
        "longitude": longitude,

        "hourly": ",".join([
            "precipitation",
            "precipitation_probability",
            "rain"
        ]),

        "forecast_days": 2,

        "timezone": "auto"
    }

    response = requests.get(
        url,
        params=params,
        timeout=15
    )

    response.raise_for_status()

    data = response.json()

    hourly = data["hourly"]

    precipitation = hourly["precipitation"]
    probability = hourly["precipitation_probability"]

    now = datetime.now()

    rain_next_24 = precipitation[:24]

    probability_next_24 = probability[:24]

    rainfall_24h = sum(rain_next_24)

    max_probability = max(
        probability_next_24
    ) if probability_next_24 else 0

    rainy_hours = sum(
        1 for value in rain_next_24
        if value > 0.1
    )

    total_rain_hours = len(
        [
            value for value in rain_next_24
            if value > 0.1
        ]
    )

    rainfall_duration = rainy_hours

    return {

        "rainfall_24h": round(
            rainfall_24h,
            2
        ),

        "rainfall_72h": round(
            sum(precipitation[:72]),
            2
        ),

        "max_rain_probability": round(
            max_probability,
            1
        ),

        "rain_duration_hours": rainfall_duration,

        "hourly_rainfall": [
            round(x, 2)
            for x in rain_next_24
        ],

        "hourly_probability": [
            round(x, 1)
            for x in probability_next_24
        ],

        "timezone": data.get(
            "timezone",
            "auto"
        )
    }