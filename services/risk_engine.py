import numpy as np
import requests


def normalize(value, minimum, maximum):

    if maximum == minimum:
        return 0

    score = (
        (value - minimum)
        /
        (maximum - minimum)
    )

    return float(
        np.clip(score, 0, 1)
    )


# --------------------------------
# Real terrain (slope) via elevation API
# --------------------------------

def get_terrain_score(latitude, longitude):

    offset = 0.01  # roughly 1.1 km

    points = [
        (latitude, longitude),
        (latitude + offset, longitude),
        (latitude - offset, longitude),
        (latitude, longitude + offset),
        (latitude, longitude - offset),
    ]

    locations = "|".join(
        f"{lat},{lon}" for lat, lon in points
    )

    try:
        response = requests.get(
            "https://api.open-elevation.com/api/v1/lookup",
            params={"locations": locations},
            timeout=10
        )
        response.raise_for_status()
        results = response.json()["results"]

        elevations = [r["elevation"] for r in results]
        center = elevations[0]

        # Max elevation difference to neighbors, over ~1.1km
        max_diff = max(abs(center - e) for e in elevations[1:])

        # Rough slope angle in degrees
        distance_m = 1100
        slope_degrees = np.degrees(np.arctan(max_diff / distance_m))

        # Normalize: 0-35 degrees covers gentle to very steep
        score = normalize(slope_degrees, 0, 35)

        return score, round(center, 1), round(slope_degrees, 1)

    except Exception:
        # Fallback if elevation API is unreachable
        return 0.5, None, None


# --------------------------------
# Region-based historical + susceptibility
# (approximate zonation based on known NE India
# landslide-prone belts; replace with GSI dataset
# if/when you get access to it)
# --------------------------------

REGION_RISK = [
    # name, lat_min, lat_max, lon_min, lon_max, historical, susceptibility
    ("Sikkim",              27.0, 28.2, 88.0, 88.9, 0.80, 0.85),
    ("Darjeeling hills",    26.7, 27.2, 88.0, 88.5, 0.78, 0.82),
    ("Meghalaya",           25.0, 26.2, 89.8, 92.8, 0.70, 0.75),
    ("Mizoram",             21.9, 24.6, 92.2, 93.5, 0.72, 0.78),
    ("Manipur hills",       23.8, 25.7, 93.0, 94.8, 0.68, 0.72),
    ("Nagaland",            25.1, 27.0, 93.3, 95.3, 0.65, 0.70),
    ("Arunachal Pradesh",   26.6, 29.5, 91.5, 97.4, 0.60, 0.68),
    ("Assam (hills/valley)",24.0, 27.0, 89.7, 96.0, 0.40, 0.45),
    ("Tripura",             22.9, 24.5, 91.1, 92.3, 0.45, 0.50),
]

DEFAULT_HISTORICAL = 0.35
DEFAULT_SUSCEPTIBILITY = 0.40


def get_region_risk(latitude, longitude):

    for name, lat_min, lat_max, lon_min, lon_max, hist, susc in REGION_RISK:
        if lat_min <= latitude <= lat_max and lon_min <= longitude <= lon_max:
            return hist, susc, name

    return DEFAULT_HISTORICAL, DEFAULT_SUSCEPTIBILITY, "Outside mapped NE India zone"


def calculate_risk(
    rainfall_24h,
    rainfall_72h,
    latitude,
    longitude
):

    # --------------------------------
    # Rainfall score (real, from Open-Meteo)
    # --------------------------------

    rainfall_score = normalize(
        rainfall_24h,
        0,
        150
    )

    accumulated_score = normalize(
        rainfall_72h,
        0,
        300
    )

    # --------------------------------
    # Real terrain via elevation/slope
    # --------------------------------

    terrain_score, elevation_m, slope_deg = get_terrain_score(
        latitude, longitude
    )

    # --------------------------------
    # Region-based historical + susceptibility
    # --------------------------------

    historical_score, susceptibility_score, region_name = get_region_risk(
        latitude, longitude
    )

    # --------------------------------
    # Weighted risk model
    # --------------------------------

    risk_score = (
        rainfall_score * 0.35
        +
        accumulated_score * 0.20
        +
        terrain_score * 0.15
        +
        historical_score * 0.15
        +
        susceptibility_score * 0.15
    )

    risk_score = round(
        risk_score * 100,
        1
    )

    # --------------------------------
    # Risk classification
    # --------------------------------

    if risk_score < 25:
        level = "LOW"
    elif risk_score < 50:
        level = "MODERATE"
    elif risk_score < 75:
        level = "HIGH"
    else:
        level = "CRITICAL"

    return {

        "risk_score": risk_score,

        "risk_level": level,

        "region": region_name,

        "elevation_m": elevation_m,

        "slope_degrees": slope_deg,

        "factors": {

            "rainfall": round(rainfall_score * 100, 1),

            "accumulated_rainfall": round(accumulated_score * 100, 1),

            "terrain": round(terrain_score * 100, 1),

            "historical_landslides": round(historical_score * 100, 1),

            "susceptibility": round(susceptibility_score * 100, 1)
        }
    }