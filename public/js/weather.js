class Info {
    // do web requests
    static async getResponse(url) {
        let resp = await fetch(url),
            json = await resp.json();
        return json;
    }
    // get users approximate city, latitude, and longitude based on IP
    static async getIpLoc() {
        let data = await this.getResponse(`https://notsus1.herokuapp.com/fetch/_aHR0cDovL2lwLWFwaS5jb20=_/json/${ip}`);
        let latlon = `${data.lat},${data.lon}`,
            city = data.city;
        console.log(latlon);
        return { latlon, city };
    }
    // get weather.gov zone (not needed)
    static async getZone(latlon) {
        let data = await this.getResponse(`https://api.weather.gov/points/${latlon}`);

        return data.properties.forecastZone;
    }
    // return array of city, latlon, and weather.gov zone
    static async getNearestZone() {
        let { city, latlon } = await this.getIpLoc(),
            zone = await this.getZone(latlon);

        return { city, latlon, zone };
    }
}
class Weather {
    // gets weather and returns the current.
    static async getCurrents(latlon) {
        let data = await Info.getResponse(`https://forecast.weather.gov/MapClick.php?&lat=${latlon.replace(',', '&lon=')}&FcstType=json`),
            temp = data.currentobservation.Temp,
            pop = data.data.pop[0],
            weather = data.data.weather[0],
            icn = data.data.iconLink[0],
            zone = data.location.zone,
            alert = data.data.hazard;
        return { temp, pop, weather, icn, zone, alert };
    }
    // gets extended weather data and returns it.
    static async getExtended(latlon) {
        let data = await Info.getResponse(`https://forecast.weather.gov/MapClick.php?&lat=${latlon.replace(',', '&lon=')}&FcstType=json`),
            temp = data.data.temperature,
            pop = data.data.pop,
            weather = data.data.weather,
            icn = data.data.iconLink,
            zone = data.location.zone,
            alert = data.data.hazard;
        return { temp, pop, weather, icn, zone, alert };
    }
}
async function doStuff() {
    ipdat = await Info.getIpLoc();
    weather = await Weather.getCurrents(ipdat.latlon);
    document.getElementById('winfo').innerHTML = `${weather.temp}&degF in ${ipdat.city}`;
    console.log(weather.alert.length);
    if (!weather.alert.length == 0) {
        document.getElementById('alerts').setAttribute('onclick', `location.href = 'https://notsus1.herokuapp.com/fetch/_aHR0cHM6Ly9mb3JlY2FzdC53ZWF0aGVyLmdvdg==_/MapClick.php?&lat=${ipdat.latlon.replace(',', '&lon=')}'`);
    } else {
        return;
    };
}
window.onload = () => {
    doStuff();
  };
  /*
example
await Weather.getCurrents('33.6528,-85.8417') 
*/
