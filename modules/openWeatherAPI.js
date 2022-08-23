export class OpenWeatherMapAPI {
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
}