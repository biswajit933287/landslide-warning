let map;

let userMarker;

let accuracyCircle;

let currentLocation = null;

/*function showInfoPopup(message) {
    document.getElementById('infoPopupText').textContent = message;
    document.getElementById('infoPopup').classList.add('active');
}

function closeInfoPopup() {
    document.getElementById('infoPopup').classList.remove('active');
}*/

// ------------------------------------
// Initialize map
// ------------------------------------

function initMap() {

    map = L.map("map").setView(
        [25.67, 94.10],
        6
    );


    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors'
        }
    ).addTo(map);
}


initMap();


// ------------------------------------
// Location
// ------------------------------------

function requestLocation() {

    if (!navigator.geolocation) {

        alert(
            "Geolocation is not supported by this browser."
        );

        return;
    }


    navigator.geolocation.getCurrentPosition(

        function(position) {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;

            const accuracy =
                position.coords.accuracy;


            currentLocation = {
                latitude,
                longitude
            };


            showLocation(
                latitude,
                longitude,
                accuracy
            );


            runAnalysis(
                latitude,
                longitude
            );

        },

        function(error) {

            let message =
                "Location permission was not granted.";

            if (error.code === 1) {

                message =
                    "Location access was denied.";

            } else if (error.code === 2) {

                message =
                    "Location could not be determined.";

            } else if (error.code === 3) {

                message =
                    "Location request timed out.";
            }


            alert(message);

        },

        {
            enableHighAccuracy: true,

            timeout: 10000,

            maximumAge: 0
        }
    );
}


// ------------------------------------
// Display user location
// ------------------------------------

function showLocation(
    latitude,
    longitude,
    accuracy
) {

    if (userMarker) {

        map.removeLayer(userMarker);
    }


    if (accuracyCircle) {

        map.removeLayer(
            accuracyCircle
        );
    }


    userMarker =
        L.marker([
            latitude,
            longitude
        ])
        .addTo(map)
        .bindPopup(
            "📍 Your current location"
        )
        .openPopup();


    // Cap the circle radius so it never
    // covers the whole map when accuracy
    // value is very large (e.g. IP-based
    // location can be several km off)
    const displayRadius = Math.min(accuracy, 40);

    accuracyCircle =
        L.circle(
            [
                latitude,
                longitude
            ],
            {
                radius: displayRadius,
                color: "#14b8a6",
                fillColor: "#14b8a6",
                fillOpacity: 0.08,
                weight: 1.5
            }
        )
        .addTo(map);


    map.setView(
        [
            latitude,
            longitude
        ],
        13
    );


    document.getElementById(
        "locationText"
    ).innerText =
        `Lat ${latitude.toFixed(4)}
         | Lon ${longitude.toFixed(4)}`;

    fetchPlaceName(latitude, longitude);
}


// ------------------------------------
// Run backend analysis
// ------------------------------------

async function runAnalysis(
    latitude,
    longitude
) {

    document.getElementById(
        "startBtn"
    ).innerText =
        "Analyzing...";


    try {

        const response =
            await fetch(
                "/api/analyze",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        latitude,
                        longitude
                    })
                }
            );


        const data =
            await response.json();


        if (!data.success) {

            throw new Error(
                data.error
            );
        }


        updateDashboard(data);


    } catch (error) {

        console.error(error);

        alert(
            "Analysis failed: " +
            error.message
        );

    } finally {

        document.getElementById(
            "startBtn"
        ).innerText =
            "Refresh Analysis";
    }
}

//new line add-------------------------------01.09.26
function animateNumber(id, target) {
    const el = document.getElementById(id);
    let current = 0;
    const step = Math.max(1, Math.round(target / 30));
    const interval = setInterval(function() {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(interval);
        }
        el.innerText = current;
    }, 20);
}

// ------------------------------------
// Update dashboard
// ------------------------------------

function updateDashboard(data) {

    const weather =
        data.weather;

    const risk =
        data.risk;


    // Weather

    document.getElementById(
        "rainfall"
    ).innerText =
        weather.rainfall_24h;


    document.getElementById(
        "rainDuration"
    ).innerText =
        weather.rain_duration_hours;


    document.getElementById(
        "rainProbability"
    ).innerText =
        weather.max_rain_probability;


    // Risk

    animateNumber(
        "riskScore",
        risk.risk_score
    );


    document.getElementById(
        "riskLevel"
    ).innerText =
        risk.risk_level;


    document.getElementById(
        "riskBadge"
    ).innerText =
        risk.risk_level;
// New cards
    document.getElementById(
        "cardrainfall"
    ).innerText =
        weather.rainfall_24h;

    document.getElementById(
        "cardterrain"
    ).innerText =
        risk.factors.terrain;

    document.getElementById(
        "cardhistorical"
    ).innerText =
        risk.factors.historical_landslides;

    document.getElementById(
        "cardsusceptibility"
    ).innerText =
        risk.factors.susceptibility;

    document.getElementById(
        "cardai"
    ).innerText = 92;

    document.getElementById(
        "cardriskscore"
    ).innerText =
        risk.risk_score;

    document.getElementById(
        "cardalert"
    ).innerText =
        risk.risk_level;

    document.getElementById(
        "gaugeTerrain"
    ).style.setProperty(
        "--pct",
        risk.factors.terrain
    );

    document.getElementById(
        "gaugeRisk"
    ).style.setProperty(
        "--pct",
        risk.risk_score
    );

    document.getElementById(
        "gaugeAlert"
    ).style.setProperty(
        "--pct",
        risk.risk_score
    );

    updateFactor(
        "rainFactor",
        "rainProgress",
        risk.factors.rainfall
    );

    updateFactor(
        "terrainFactor",
        "terrainProgress",
        risk.factors.terrain
    );


    updateFactor(
        "historyFactor",
        "historyProgress",
        risk.factors.historical_landslides
    );


    updateFactor(
        "susceptibilityFactor",
        "susceptibilityProgress",
        risk.factors.susceptibility
    );

    generateExplanation(
        risk.factors
    );


    updateAlert(
        risk.risk_score,
        risk.risk_level
    );
}


// ------------------------------------
// Factors
// ------------------------------------

function updateFactor(
    textId,
    progressId,
    value
) {

    document.getElementById(
        textId
    ).innerText =
        `${value}%`;


    document.getElementById(
        progressId
    ).style.width =
        `${value}%`;
}


// ------------------------------------
// Explainable biwajit
// ------------------------------------

function generateExplanation(
    factors
) {

    const container =
        document.getElementById(
            "explanation"
        );


    const entries = [

        [
            "🌧️ Rainfall",
            factors.rainfall
        ],

        [
            "💧 Accumulated Rainfall",
            factors.accumulated_rainfall
        ],

        [
            "⛰️ Terrain",
            factors.terrain
        ],

        [
            "📚 Historical Landslides",
            factors.historical_landslides
        ],

        [
            "🗺️ Susceptibility",
            factors.susceptibility
        ]

    ];


    container.innerHTML = "";


    entries.forEach(
        function(item) {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "explanation-item";


            div.innerHTML = `

                <span>
                    ${item[0]}
                </span>

                <strong>
                    ${item[1]}%
                </strong>

            `;


            container.appendChild(div);
        }
    );
}


// ------------------------------------
// Early warning
// ------------------------------------

function updateAlert(
    score,
    level
) {

    const panel =
        document.getElementById(
            "alertPanel"
        );


    const text =
        document.getElementById(
            "alertText"
        );


    if (level === "CRITICAL") {

        panel.style.borderLeft =
            "6px solid #d32f2f";

        text.innerText =
            "Critical prototype risk level detected. Monitor official disaster advisories and avoid vulnerable areas where authorities advise.";

    }

    else if (level === "HIGH") {

        panel.style.borderLeft =
            "6px solid #f57c00";

        text.innerText =
            "High prototype risk level detected. Increased rainfall and environmental factors require closer monitoring.";

    }

    else if (level === "MODERATE") {

        panel.style.borderLeft =
            "6px solid #fbc02d";

        text.innerText =
            "Moderate prototype risk level. Continue monitoring rainfall and official advisories.";

    }

    else {

        panel.style.borderLeft =
            "6px solid #388e3c";

        text.innerText =
            "Low prototype risk level based on the current inputs.";
    }
}


// ------------------------------------
// Buttons
// ------------------------------------

document.getElementById(
    "locationBtn"
).addEventListener(
    "click",
    requestLocation
);


document.getElementById(
    "startBtn"
).addEventListener(
    "click",
    function() {

        if (!currentLocation) {

            requestLocation();

        } else {

            runAnalysis(
                currentLocation.latitude,
                currentLocation.longitude
            );
        }
    }
);

// ------------------------------------
// Search
// ------------------------------------

document.getElementById("searchBtn").addEventListener("click", doSearch);

document.getElementById("searchBox").addEventListener("keydown", function(e) {
    if (e.key === "Enter") doSearch();
});


function quickSearch(placeName) {
    document.getElementById("searchBox").value = placeName;
    doSearch();
}


async function doSearch() {

    const q = document.getElementById("searchBox").value.trim();

    if (!q) return;

    try {

        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`
        );

        const data = await res.json();

        if (data.length === 0) {
            alert("Place not found.");
            return;
        }

        const latitude = parseFloat(data[0].lat);
        const longitude = parseFloat(data[0].lon);

        currentLocation = { latitude, longitude };

        showLocation(latitude, longitude, 500); // 500 = approx accuracy in meters for a searched place

        runAnalysis(latitude, longitude);

    } catch (e) {
        alert("search failed - try again.");
    }
}

// ------------------------------------
// Workflow clickable cards
// ------------------------------------

document
    .querySelectorAll(
        ".workflow-card"
    )
    .forEach(
        function(card) {

            card.addEventListener(
                "click",
                function() {

                    const step =
                        card.dataset.step;


                    explainWorkflow(
                        step
                    );
                }
            );
        }
    );


function explainWorkflow(step) {

    const messages = {

        rainfall:
            "Live 24-hour rainfall forecast and precipitation probability.",

        terrain:
            "Terrain represents elevation, slope and other geographic factors.",

        historical:
            "Historical landslide information helps identify locations with previous events.",

        susceptibility:
            "Susceptibility represents the baseline tendency of terrain to experience landslides.",

        ai:
            "The AI risk engine combines the input features into a prototype risk estimate.",

        risk:
            "Risk score is represented from 0 to 100 and categorized into four levels.",

        alert:
            "The warning panel converts the risk level into an understandable action-oriented message."
    };


    alert(
        messages[step]
    );
}


// ------------------------------------
// Language
// ------------------------------------

const translations = {

    en: {
        title:
            "Landslide Risk Monitoring for Northeast India"
    },

    hi: {
        title:
            "पूर्वोत्तर भारत के लिए भूस्खलन जोखिम निगरानी"
    },

    bn: {
        title:
            "উত্তর-পূর্ব ভারতের জন্য ভূমিধস ঝুঁকি পর্যবেক্ষণ"
    },

    as: {
        title:
            "উত্তৰ-পূৰ্বাঞ্চলৰ বাবে ভূমিস্খলন বিপদ নিৰীক্ষণ"
    },

    ne: {
        title:
            "उत्तरपूर्वी भारतका लागि पहिरो जोखिम निगरानी"
    }

};


document.getElementById(
    "language"
).addEventListener(
    "change",
    function(event) {

        const language =
            event.target.value;


        document.querySelector(
            ".hero h1"
        ).innerText =
            translations[
                language
            ].title;
    }
);
const stateDropdownBtn = document.getElementById("stateDropdownBtn");
const stateMenu = document.getElementById("stateMenu");
const closeStateMenu = document.getElementById("closeStateMenu");

stateDropdownBtn.addEventListener("click", function() {
    stateMenu.classList.toggle("open");
});

closeStateMenu.addEventListener("click", function() {
    stateMenu.classList.remove("open");
});

const stateCoords = {
    "Sikkim": { lat: 27.57, lon: 88.48 },
    "Gangtok": { lat: 27.34, lon: 88.61 },
    "Arunachal Pradesh": { lat: 28.04, lon: 94.68 },
    "Assam": { lat: 26.2006, lon: 92.9376 },
    "Tripura": { lat: 23.9408, lon: 91.9882 },
    "Meghalaya": { lat: 25.4670, lon: 91.3662 },
    "Manipur": { lat: 24.6637, lon: 93.9063 },
    "Nagaland": { lat: 26.1584, lon: 94.5624 },
    "Mizoram": { lat: 23.1645, lon: 92.9376 }
};

document.querySelectorAll(".state-item").forEach(function(item) {
    item.addEventListener("click", function() {
        const stateName = item.dataset.state;
        const coords = stateCoords[stateName];

        if (!coords) return;

        currentLocation = { latitude: coords.lat, longitude: coords.lon };

        document.getElementById("locationText").innerText = stateName;
        stateMenu.classList.remove("open");

        showLocation(coords.lat, coords.lon, 5000);
        runAnalysis(coords.lat, coords.lon);
    });
});

const historyBtn = document.getElementById("historyChatBtn");

if (historyBtn) {
    historyBtn.addEventListener("click", function() {
        window.location.href = "/history";
    });
} else {
    console.log("historyChatBtn NOT FOUND when script ran!");
}

async function fetchPlaceName(latitude, longitude) {

    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
        );

        const data = await res.json();

        const address = data.address || {};

        const placeName =
            address.village ||
            address.town ||
            address.city ||
            address.county ||
            address.state_district ||
            address.state ||
            "Nearby area name not found";

        document.getElementById(
            "locationText"
        ).innerText =
            `${placeName} — Lat ${latitude.toFixed(4)} | Lon ${longitude.toFixed(4)}`;

    } catch (e) {
        console.log("Reverse geocoding failed:", e);
    }
}