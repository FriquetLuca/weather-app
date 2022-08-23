import { TeleportAPI } from "./teleportAPI.js";
import { SYSTEM } from "./system.js";

export class Menu {
    static show = {
        Burger: true,
        Slidebar: false
    };
    static searchBar = document.querySelector('.citysearch_search');
    static slidebar = document.querySelector('.menu_slidebar');
    static toggleSlidebar()
    {
        this.show.Slidebar = !this.show.Slidebar;
        if(this.show.Slidebar)
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
        this.slidebar.style.left = '0px';
    }
    static hideSlidebar()
    {
        this.slidebar.style.left = '-120px';
    }
    static updateAutocompletion()
    {
        SYSTEM.fetchJSON(TeleportAPI.autoCompletionChoicePath(this.searchBar.value), (data) => {
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