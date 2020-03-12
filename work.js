/*
City Databases:
- https://geobytes.com/freeservices/
- https://en.populationdata.net/
- https://simplemaps.com/data/world-cities

*/

async function werkWerkWerk() {

    // TODO: change this to const
    const dbFile = chrome.runtime.getURL("database.json");
    const db = await getJsonFile(dbFile);

    var elementSelector = [
        "#host > div.header > div > div:nth-child(2) > div > div > h2 > span:nth-child(2)", // page position
        "a[href*='/positions/']>p", // page home
        "a[href*='/positions/'] div.info_holder > p > span:nth-child(2)", // page search
        "div.slick-track > div dl > dd:nth-child(1)" // page search slide
    ];

    elementSelector.forEach((seletor) =>
        document.querySelectorAll(seletor).forEach(
            (el) => el.textContent = findRegion(el.textContent, db)
        )
    );
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

werkWerkWerk();