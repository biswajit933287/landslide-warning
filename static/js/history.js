// Kerala SDMA, Sikkim SDMA, Wikipedia, ReliefWeb,
// Down To Earth, ScienceDirect (peer-reviewed)


const historyData = [
    {
        year: 1990,
        date: "4-10 May 1990",
        state: "Andhra Pradesh",
        location: "Coastal AP (Machilipatnam, Krishna, Godavari districts)",
        type: "Cyclone & Flood",
        deaths: 967,
        injured: 0,
        duration_days: 6,
        details: "Super cyclonic storm, 235 km/h winds, made landfall near Machilipatnam. Worst disaster in South India since 1977. Over 2.6 million people affected, 100,000+ animals died. Source: IMD/Wikipedia."
    },
    {
        year: 1998,
        date: "16-21 August 1998",
        state: "Uttarakhand",
        location: "Malpa village, Pithoragarh district",
        type: "Landslide",
        deaths: 221,
        injured: 0,
        duration_days: 6,
        details: "Rockfall started 16 Aug, main slide hit 18 Aug 3:00 AM, continued till 21 Aug. Wiped out the entire village of Malpa on the Kailash Mansarovar Yatra route, including 60 pilgrims. One of the worst landslides in Indian history; 18 August is observed as Landslide Memorial Day. Source: Wikipedia."
    },
    {
        year: 1999,
        date: "25 October - 4 November 1999",
        state: "Odisha",
        location: "Coastal Odisha (Jagatsinghpur, Kendrapara, Ganjam)",
        type: "Cyclone & Flood",
        deaths: 9887,
        injured: 3300,
        duration_days: 11,
        details: "Super Cyclone (Paradip Cyclone) formed 25 Oct, made landfall 29 Oct as category 5-equivalent with 260 km/h winds, dissipated 4 Nov. Storm surge of 5-6m went up to 35km inland. Official IMD toll 9,887; unofficial estimates go up to 30,000. Deadliest cyclone in India in the 20th century. Source: IMD/Wikipedia."
    },
    {
        year: 2013,
        date: "14-17 June 2013",
        state: "Uttarakhand",
        location: "Kedarnath valley, Chorabari Lake (Rudraprayag district)",
        type: "Flash Flood & Landslide",
        deaths: 5700,
        injured: 0,
        duration_days: 4,
        details: "Cloudburst caused Chorabari glacier lake to breach, flooding the Kedarnath valley; rescue operations (Operation Rahat) ran for weeks after. Uttarakhand govt figure: 5,700 presumed dead (incl. 934 locals); official confirmed bodies 169 + ~4,021 missing presumed dead. Worst Himalayan disaster since 2004. Source: NIDM report/Wikipedia."
    },
    {
        year: 2014,
        date: "July 2014",
        state: "Maharashtra",
        location: "Malin village, Pune district",
        type: "Landslide",
        deaths: 151,
        injured: 0,
        duration_days: 1,
        details: "Single-event landslide buried the entire village of Malin during monsoon rains; rescue/recovery continued about a week. One of the deadliest single-village landslide disasters in India. Source: peer-reviewed studies (Patil & Gopale 2018)."
    },
    {
        year: 2015,
        date: "9 November - 17 December 2015",
        state: "Tamil Nadu",
        location: "Chennai and suburbs",
        type: "Flood",
        deaths: 400,
        injured: 0,
        duration_days: 38,
        details: "Northeast monsoon rains from 9 Nov, worst on 1 Dec (345-494mm in 24hrs, heaviest since 1901), rains finally stopped 17 Dec. Over 18 lakh people displaced; airport shut for 5 days. Death toll varies by source: 280 (govt confirmed) to 400+ (including indirect deaths). Source: Wikipedia/NASA/Reuters."
    },
    {
        year: 2018,
        date: "August 2018",
        state: "Kerala",
        location: "Statewide (Idukki, Wayanad, Malappuram worst hit)",
        type: "Flood & Landslide",
        deaths: 483,
        injured: 0,
        duration_days: 12,
        details: "Worst floods/landslides in Kerala in a century, roughly 8-19 Aug. Triggered an estimated 4,728 landslides across the state (mostly Idukki, Palakkad, Malappuram). Source: ScienceDirect peer-reviewed study."
    },
    {
        year: 2023,
        date: "3-5 October 2023",
        state: "Sikkim",
        location: "North Sikkim, Teesta river basin (Chungthang, Mangan, Pakyong)",
        type: "Flash Flood (Glacial Lake Outburst)",
        deaths: 92,
        injured: 26,
        duration_days: 3,
        details: "South Lhonak Lake glacial lake outburst flood (GLOF) triggered by moraine collapse. Destroyed the 1200-MW Teesta III dam and 15 bridges; search operations continued for weeks after. Source: Wikipedia/Science journal"
    },
    {
        year: 2024,
        date: "30 July 2024",
        state: "Kerala",
        location: "Wayanad (Mundakkai, Chooralmala, Punjirimattom)",
        type: "Landslide",
        deaths: 420,
        injured: 397,
        duration_days: 1,
        details: "2:17-4:30 AM single-event landslide, Kerala's deadliest disaster in two decades. Chooralmala received 578mm rainfall in 48 hours before the slide. ~47 people remained missing, ~10,000 displaced; rescue ops ran for weeks. Source: GSI/Wikipedia."
    }
];


// ------------------------------------
// Chat elements
// ------------------------------------

const chatMessages =
    document.getElementById("chatMessages");

const chatInput =
    document.getElementById("chatInput");

const chatSendBtn =
    document.getElementById("chatSendBtn");


// ------------------------------------
// Add a message to chat window
// ------------------------------------

function addMessage(text, sender) {

    const emptyState = document.getElementById("emptyState");
    if (emptyState) {
        emptyState.remove();
    }

    const wrapper = document.createElement("div");
    wrapper.className = sender === "user" ? "msg-row msg-row-user" : "msg-row msg-row-bot";

    const avatar = document.createElement("div");
    avatar.className = "msg-avatar";
    avatar.innerText = sender === "user" ? "🧑" : "🤖";

    const msgDiv = document.createElement("div");
    msgDiv.className =
        sender === "user"
            ? "chat-msg chat-msg-user"
            : "chat-msg chat-msg-bot";
    msgDiv.innerText = text;

    if (sender === "user") {
        wrapper.appendChild(msgDiv);
        wrapper.appendChild(avatar);
    } else {
        wrapper.appendChild(avatar);
        wrapper.appendChild(msgDiv);
    }

    chatMessages.appendChild(wrapper);

    chatMessages.scrollTop = chatMessages.scrollHeight;
}


// ------------------------------------
// Hinglish/Hindi helper words - inhe
// ignore karenge query se taaki sirf
// asli keywords (state, saal, type)
// bachein match karne ke liye
// ------------------------------------

const stopWords = [
    "mein", "me", "ka", "ki", "ke", "hua", "hui", "hue",
    "kab", "kahan", "kaha", "sabse", "zyada", "the",
    "was", "in", "at", "on", "the", "a", "an", "of",
    "kitne", "kitni", "log", "logo", "logon", "kya",
    "hai", "tha", "thi", "the", "aur", "ya", "please",
    "batao", "bata", "do", "mujhe"
];

const greetings = [
    "hello", "hi", "hey", "namaste", "namaskar",
    "good morning", "good afternoon", "good evening"
];

// Type ke liye Hindi/English synonyms - taaki
// "bhuskhalan" ya "baadh" jaise words bhi
// "Landslide" / "Flood" se match ho jaye

const typeSynonyms = {
    "landslide": ["landslide", "bhuskhalan", "pahad", "dhas", "dhasakna"],
    "flood": ["flood", "baadh", "baarish", "seelab", "flash flood"],
    "flash flood (glacial lake outburst)": ["glof", "glacial", "lake", "flash flood", "baadh"]
};


// ------------------------------------
// Tokenize + clean query
// ------------------------------------

function tokenize(query) {

    return query
        .toLowerCase()
        .replace(/[?!.,]/g, "")
        .split(/\s+/)
        .filter(function(word) {
            return word.length >= 3 && stopWords.indexOf(word) === -1;
        });
}


// ------------------------------------
// Check if a single token matches an entry
// (partial/substring match dono directions mein)
// ------------------------------------

function tokenMatchesEntry(token, entry) {

    const fields = [
        String(entry.year),
        entry.state.toLowerCase(),
        entry.location.toLowerCase(),
        entry.type.toLowerCase(),
        (entry.date || "").toLowerCase()
    ];

    const directMatch = fields.some(function(field) {
        return field.includes(token) || token.includes(field);
    });

    if (directMatch) {
        return true;
    }

    // Synonym match for type (landslide/flood etc.)
    for (const key in typeSynonyms) {
        if (entry.type.toLowerCase().includes(key)) {
            if (typeSynonyms[key].indexOf(token) !== -1) {
                return true;
            }
        }
    }

    return false;
}


// ------------------------------------
// Search function (token-based fuzzy match,
// ranked by number of matching tokens)
// ------------------------------------

function searchHistory(query) {

    const cleanQuery = query.trim().toLowerCase();

    // Developer credit easter egg - "biswajit" kisi
    // bhi case mein (upper/lower/mixed) ho, match ho jaye

    if (cleanQuery.includes("biswajit")) {
        return "👨‍💻 Developer: Biswajit Maity\nRole: Landslide Risk Monitoring System - Backend & Frontend Developer";
    }
    if(cleanQuery.includes("abhijit")) {
        return "👨🏻‍💻 Developer: Abhijit Biswas\nRole: Landslide Risk Monitoring System - Frontend Developer";
    }

    if (greetings.indexOf(cleanQuery) !== -1) {
        return "Namaste! Mujhse India ke landslide/rainfall/storm/flood history ke baare mein poochho - jaise koi saal (e.g. 2018) ya state (e.g. Kerala) ka naam.";
    }

    if (isYearOnlyQuery(query)) {
        return searchByYear(query.trim());
    }

    const tokens = tokenize(query);

    if (tokens.length === 0) {
        return "Hello thoda specific likhein - jaise state, saal, ya jagah ka naam.";
    }

    const scored = historyData.map(function(entry) {

        const matchCount = tokens.filter(function(token) {
            return tokenMatchesEntry(token, entry);
        }).length;

        return { entry: entry, score: matchCount };
    });

    const matches = scored
        .filter(function(item) {
            return item.score > 0;
        })
        .sort(function(a, b) {
            return b.score - a.score;
        })
        .map(function(item) {
            return item.entry;
        });

    if (matches.length === 0) {
        return "Is query ke liye abhi data available nahi hai. (Data collection process chal raha hai)";
    }

    let response = "";

    matches.forEach(function(entry) {

        response +=
            `📍 ${entry.location}, ${entry.state} (${entry.year})\n` +
            `Date: ${entry.date || entry.year}\n` +
            `Type: ${entry.type}\n` +
            `Deaths: ${entry.deaths} | Injured: ${entry.injured}\n` +
            `Duration: ${entry.duration_days ? entry.duration_days + " din" : "N/A"}\n` +
            `${entry.details}\n\n`;
    });

    return response;
}


// ------------------------------------
// Send button click
// ------------------------------------

chatSendBtn.addEventListener(
    "click",
    function() {

        const query =
            chatInput.value.trim();

        if (query === "") {
            return;
        }

        addMessage(query, "user");

        const answer =
            searchHistory(query);

        addMessage(answer, "bot");

        chatInput.value = "";
    }
);


// Enter key se bhi send ho jaye

chatInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {
            chatSendBtn.click();
        }
    }
);