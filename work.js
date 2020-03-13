/*
City Databases:
- https://geobytes.com/freeservices/
- https://en.populationdata.net/
- https://simplemaps.com/data/world-cities

*/

async function werkWerkWerk() {

    // each method here is a feature
    includeHostRegion();
    linkHostInReview();
    showReviewCount();
}

async function includeHostRegion() {
    const dbFile = chrome.runtime.getURL("database.json");
    const db = await getJsonFile(dbFile);

    var elementSelector = [
        "#host > div.header > div > div:nth-child(2) > div > div > h2 > span:nth-child(2)", // page position
        "a[href*='/positions/']>p", // page home
        "a[href*='/positions/'] div.info_holder > p > span:nth-child(2)", // page search
        "div.slick-track > div dl > dd:nth-child(1)" // page search slide
    ];

    elementSelector.forEach((seletor) =>
        document.querySelectorAll(seletor).forEach((el) =>
            el.textContent = findRegion(el.textContent, db)
        )
    );
}

async function linkHostInReview() {
    const hostBaseUrl = 'https://www.worldpackers.com/locations/';

    document.querySelectorAll("#profile-volunteer-experience > div.volunteer-experience > div.box_header div.info_holder > h4").forEach(el => {
        var hostName = el.innerText;
        var hostHref = hostBaseUrl + hostName.toLowerCase().split(' ').join('-');

        var hostImage = el.parentElement.parentElement.parentElement.parentElement.querySelector("div.volunteer-experience__review:nth-child(2) > img");
        var hostLink = document.createElement('a');
        hostLink.href = hostHref;
        hostImage.parentNode.insertBefore(hostLink, hostImage);
        hostLink.appendChild(hostImage);
    });
}

async function showReviewCount() {
    document.querySelectorAll('a.main-thumb').forEach(el => {
        fetch(el.href).then(response => response.text()).then(html => {
            const htmlDocument = new DOMParser().parseFromString(html, "text/html");
            const rating = htmlDocument.documentElement.querySelectorAll('span.rating_count');
            if (rating.length != 1)
                return;

            const hostInfo = el.querySelectorAll('div.info_holder > p');
            if (hostInfo.length != 1)
                return;

            var reviewSpan = document.createElement('span');
            reviewSpan.className = "text small";
            reviewSpan.innerText = rating[0].innerText;

            hostInfo[0].appendChild(reviewSpan);
        });
    });
}

async function getJsonFile(file) {
    var result;
    await fetch(file)
        .then((response) => response.json())
        .then((json) => result = json);
    return result;
}

function findRegion(city_country, db) {
    var cityCountry = city_country.split(",").map(el => el.trim());

    if (cityCountry.length != 2)
        return city_country;

    var paises = db.countries.filter((country) => country.names.includes(cityCountry[1]));
    if (paises.length != 1)
        return city_country;

    var estados = paises[0].regions.filter((regiao) => regiao.cities.includes(cityCountry[0]));
    if (estados.length != 1)
        return city_country;

    return `${cityCountry[0]}, ${estados[0].name}, ${cityCountry[1]}`;
}

function log(qq) {
    console.log(qq);
}

werkWerkWerk();