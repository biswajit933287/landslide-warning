import numpy as np


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


def calculate_risk(
    rainfall_24h,
    rainfall_72h,
    latitude,
    longitude
):

    # --------------------------------
    # Rainfall score
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
    # Prototype terrain factor
    # --------------------------------

    # In the hackathon prototype,
    # terrain susceptibility is simulated.
    #
    # Replace this later with DEM/GIS
    # derived slope and susceptibility.

    terrain_score = 0.65

    historical_score = 0.55

    susceptibility_score = 0.70

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

        "factors": {

            "rainfall": round(
                rainfall_score * 100,
                1
            ),

            "accumulated_rainfall": round(
                accumulated_score * 100,
                1
            ),

            "terrain": terrain_score * 100,

            "historical_landslides":
                historical_score * 100,

            "susceptibility":
                susceptibility_score * 100
        }
    }