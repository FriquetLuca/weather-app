document.cookie = "openweather=api; SameSite=None; Secure";
class SYSTEM {
    static typeof(data)
    {
        if(Array.isArray(data))
        {
            return 'array';
        }
        return typeof data;
    }
}
//SYSTEM.typeof(monElement);
class TeleportAPI {
    static autoCompletionChoicePath(value)
    {
        return `https://api.teleport.org/api/cities/?search=${value}`;
    }
    static async fetch(path, execute)
    {
        const fetchResult = await fetch(path);
        const jsonData = await fetchResult.json();
        execute(jsonData);
    }
}
class OpenWeatherMapAPI {
    static currentKey = 'f885e592c15a6704ad60be0fe52b2556';
    static icon(id)
    {
        return `http://openweathermap.org/img/wn/${id}@2x.png`;
    }
    static getTodayFrom(city)
    {
        return `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.currentKey}`;
    }
    static get30DaysFrom(city)
    {
        return `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${this.currentKey}`;
    }
    static geographicalTodayPath(lat, long)
    {
        return `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${this.currentKey}`;
    }
    static geographical30DaysPath(lat, long)
    {
        return `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${this.currentKey}`;
    }
    static async fetch(path, execute)
    {
        const fetchResult = await fetch(path);
        const jsonData = await fetchResult.json();
        execute(jsonData);
    }
}
class Menu {
    static showBurger = true;
    static showSlidebar = false;
    static searchBar = document.querySelector('.citysearch_search');
    static slidebar = document.querySelector('.menu_slidebar');
    static toggleSlidebar()
    {
        this.showSlidebar = !this.showSlidebar;
        if(this.showSlidebar)
        {
            this.showSlidebar();
        }
        else
        {
            this.hideSlidebar();
        }
    }
    static showSlidebar()
    {

    }
    static hideSlidebar()
    {
        
    }
    static updateAutocompletion()
    {
        TeleportAPI.fetch(TeleportAPI.autoCompletionChoicePath(Menu.searchBar.value), (data) => {
            const result = data._embedded['city:search-results'];
            const cities = document.querySelector('#cities');
            cities.innerHTML = '';
            let uniqueKeys = [];
            for(const r of result)
            {
                const txt = r.matching_full_name.split(',')[0];
                if(!uniqueKeys.includes(txt))
                {
                    uniqueKeys.push(txt);
                }
            }
            for(let i = 0; i < 10 && i < uniqueKeys.length; i++)
            {
                const city = document.createElement('option');
                city.setAttribute('value', uniqueKeys[i]);
                cities.appendChild(city);
            }
        });
    }
}
class CityWeather {
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
        Menu.searchBar.value = '';
    }
    static async defaultFetch(today, nextDays)
    {
        await OpenWeatherMapAPI.fetch(today, (data) => {
            CityWeather.cityName.innerHTML = data.name;
            CityWeather.temperature.innerHTML = Math.round(data.main.temp - 273.15);
            CityWeather.wind.innerHTML = Math.round(data.wind.speed * 3.6);
            CityWeather.temperatureIcon.setAttribute('src', OpenWeatherMapAPI.icon(data.weather[0].icon));
            CityWeather.temperatureIcon.setAttribute('alt', data.weather[0].description);
        });
        await OpenWeatherMapAPI.fetch(nextDays, (data) => {
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
            const newCity = document.createElement('li');
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
function start()
{
    Menu.hideSlidebar();
    CityWeather.geoLocation();
    Menu.searchBar.addEventListener('keyup', (e) => {
        if(e.key === 'Enter')
        {
            CityWeather.cityFetch(Menu.searchBar.value);
        }
        else
        {
            Menu.updateAutocompletion();
        }
    });
    const burgerMenu = document.querySelector('.burgermenu');
    burgerMenu.addEventListener('click', () => {
        Menu.showSlidebar = !Menu.showSlidebar;
        Menu.toggleSlidebar();
    });
}

start();