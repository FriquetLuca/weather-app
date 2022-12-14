import { SYSTEM } from "./system.js";
import { Menu } from "./menu.js";
import { OpenWeatherMapAPI } from './openWeatherAPI.js'

export class CityWeather {
    static cityAlreadySearched = [];
    static cityName = document.querySelector('.cityweather_name');
    static temperature = document.querySelector('.cityweather_weather_temp_actualtemp');
    static wind = document.querySelector('.cityweather_wind_speed_actualspeed');
    static temperatureIcon = document.querySelector('.cityweather_weather_icon');
    static nextDaysSection = document.querySelector('.citynextweather');
    static createWeatherSection(day, temperature, src, alt = "")
    {
        const sec = document.createElement('section');
        sec.classList.add('citynextweather_item');
        sec.innerHTML = `
        <h1 class="citynextweather_item_day">${day}</h1>
        <p class="citynextweather_item_temp"><span class="citynextweather_item_weather_temp_actualtemp">${temperature}</span>°C</p>
        <img class="citynextweather_item_icon" src="${src}" alt="${alt}">
        `;
        return sec;
    }
    static async cityFetch(cityName = 'Brussels')
    {
        await this.defaultFetch(OpenWeatherMapAPI.getTodayFrom(cityName), OpenWeatherMapAPI.get30DaysFrom(cityName));
        const unsplashLoc = `https://api.unsplash.com/search/photos?query=${cityName}&client_id=Iq674kosw5fpRE2mO9yKv_16zaoD0OSXBx2ALjwWN6s`;
        await SYSTEM.fetchJSON(unsplashLoc, (data) => {
            document.body.style.backgroundImage = `url(${data.results[0].urls.full})`;
        });
        Menu.searchBar.value = '';
    }
    static async defaultFetch(today, nextDays)
    {
        await SYSTEM.fetchJSON(today, (data) => {
            CityWeather.cityName.innerHTML = data.name;
            CityWeather.temperature.innerHTML = Math.round(data.main.temp - 273.15);
            CityWeather.wind.innerHTML = Math.round(data.wind.speed * 3.6);
            CityWeather.temperatureIcon.setAttribute('src', OpenWeatherMapAPI.icon(data.weather[0].icon));
            CityWeather.temperatureIcon.setAttribute('alt', data.weather[0].description);
        });
        await SYSTEM.fetchJSON(nextDays, (data) => {
            let dateList = data.list.map((date) => {
                    let newD = new Date(date.dt_txt);
                    if(newD.getHours() >= 14 && newD.getHours() <= 16)
                    {
                        date.dt_txt = `${date.dt_txt.split(' ')[0]} 12:00:00`;
                        return date;
                    }
                    return null;
                })
                .filter(e => e !== null);
            let uniqueDateObjects = [];
            let uniqueDateKeys = [];
            for(const d of dateList)
            {
                if(!uniqueDateKeys.includes(d.dt_txt))
                {
                    uniqueDateObjects.push(d);
                    uniqueDateKeys.push(d.dt_txt);
                }
            }
            const day = [
                'Sun',
                'Mon',
                'Tue',
                'Wed',
                'Thu',
                'Fri',
                'Sat'
            ];
            this.nextDaysSection.innerHTML = "";
            for(let i = 1; i < uniqueDateObjects.length; i++)
            {
                const child = uniqueDateObjects[i];
                const date = new Date(child.dt_txt);
                // child.
                this.nextDaysSection.appendChild(this.createWeatherSection(`${day[date.getDay()]} ${date.getDate()}`,
                Math.round(child.main.temp - 273.15), OpenWeatherMapAPI.icon(child.weather[0].icon), child.weather[0].description));
            }
        });
        if(!this.cityAlreadySearched.includes(CityWeather.cityName.innerHTML))
        {
            this.cityAlreadySearched.push(CityWeather.cityName.innerHTML);
            const newCity = document.createElement('p');
            newCity.classList.add('menu_slidebar_item');
            newCity.innerText = CityWeather.cityName.innerHTML;
            newCity.addEventListener('click', () => {
                Menu.searchBar.value = newCity.innerText;
            });
            Menu.slidebar.appendChild(newCity);
        }
    }
    static async geoLocation()
    {
        await this.cityFetch();
        if(navigator.geolocation)
        {
            navigator.geolocation.getCurrentPosition(pos => {
                this.defaultFetch(OpenWeatherMapAPI.geographicalTodayPath(pos.coords.latitude, pos.coords.longitude),
                OpenWeatherMapAPI.geographical30DaysPath(pos.coords.latitude, pos.coords.longitude));
            });
        }
    }
}