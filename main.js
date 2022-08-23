import { CityWeather } from './modules/cityWeather.js';
import { Menu } from './modules/menu.js';

document.cookie = "openweather=api; SameSite=None; Secure";

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
        Menu.toggleSlidebar();
    });
}

start();