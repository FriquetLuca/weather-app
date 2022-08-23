export class SYSTEM {
    static typeof(data)
    {
        if(Array.isArray(data))
        {
            return 'array';
        }
        return typeof data;
    }
    static async fetchJSON(path, execute, error = (e) => console.error(e))
    {
        try {
            const fetchResult = await fetch(path);
            const jsonData = await fetchResult.json();
            execute(jsonData);
        }
        catch(e)
        {
            error(e);
        }
    }
}