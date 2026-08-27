import numpy as np

from sklearn.ensemble import RandomForestRegressor


class LandslideRiskModel:

    def __init__(self):

        self.model = RandomForestRegressor(
            n_estimators=100,
            random_state=42,
            max_depth=8
        )

        self.train_model()


    def train_model(self):

        rng = np.random.default_rng(42)

        X = []

        y = []

        for _ in range(2000):

            rainfall = rng.uniform(
                0,
                150
            )

            rainfall_72 = rng.uniform(
                0,
                300
            )

            slope = rng.uniform(
                0,
                1
            )

            historical = rng.uniform(
                0,
                1
            )

            susceptibility = rng.uniform(
                0,
                1
            )

            risk = (

                rainfall / 150 * 0.35

                +

                rainfall_72 / 300 * 0.20

                +

                slope * 0.15

                +

                historical * 0.15

                +

                susceptibility * 0.15
            )

            X.append([
                rainfall,
                rainfall_72,
                slope,
                historical,
                susceptibility
            ])

            y.append(
                risk * 100
            )

        self.model.fit(
            np.array(X),
            np.array(y)
        )


    def predict(
        self,
        rainfall,
        rainfall_72,
        slope,
        historical,
        susceptibility
    ):

        prediction = self.model.predict([
            [
                rainfall,
                rainfall_72,
                slope,
                historical,
                susceptibility
            ]
        ])

        return round(
            float(prediction[0]),
            2
        )


risk_model = LandslideRiskModel()