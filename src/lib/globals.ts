import { PhotoDB } from "./indexdb"

const photoDB = new PhotoDB();
await photoDB.initialize();

export function range(size: number) {
    return new Array(size).fill(0).map((_, i) => i);
}

// read data from localstorage
async function getLocalStorage<T>(key: string, defaultValue?: T) {
    key = `svelte_lab.${key}`
    let data = await photoDB.getGlobal<any>(key);
    if (data) {
        return <T>data.value;
    }
    data = localStorage.getItem(key)
    if (data) {
        log("WARNING: still reading from localstorage", key)
        return <T>JSON.parse(data)
    }
    return defaultValue
}

// write data to localstorage
const setLocalStorage = (key: string, data: any) => {
    key = `svelte_lab.${key}`
    //localStorage.setItem(key, JSON.stringify(data));
    photoDB.putGlobal(key, data)
}

// prompt user for value
export function promptUser(message: string) {
    return prompt(message)
}

// get the photo url or prompt user for it
export async function getPhotoUrl() {
    const photoUrl = await getLocalStorage<string>('photoServerUrl')
    if (photoUrl) {
        return photoUrl
    }

    while (true) {
        const newPhotoUrl = promptUser('This is an alpha version of Just Be Collage.  Please check back later.  If you must continue, the answer is "../..",  but we are not ready for you.')
        if (!newPhotoUrl) return;
        newPhotoUrl && setLocalStorage('photoServerUrl', newPhotoUrl)

        // verify the url by getting the client id
        try {
            this.client_id = "";
            this.client_id = await this.getClientId();
            return newPhotoUrl
        } catch (ex) {
            reportError(ex);
        }
    }
}

const dummy = document.createElement("div")
document.body.appendChild(dummy)

export function getEffectiveTransform(transform: string) {
    dummy.style.transform = transform
    const result = getComputedStyle(dummy).transform
    return result === "none" ? "" : result
}

export function addDays(yyyy_mm_dd: string, days: number): string {
    if (!yyyy_mm_dd) return yyyy_mm_dd
    const currentDate = new Date(yyyy_mm_dd)
    currentDate.setDate(currentDate.getDate() + days)
    return currentDate.toISOString().split("T")[0]
}

export function dow(yyyymmdd: string) {
    const [year, month, day] = yyyymmdd.split("-").map((v) => parseInt(v))
    const result = new Date(year, month - 1, day).getDay()
    return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][result]
}

export function hasFocus(container: HTMLElement | SVGElement) {
    const result =
        container &&
        (document.activeElement === container ||
            container.contains(document.activeElement))
    return result
}


export function log(...args: any[]) {
    console.log(...args)
}

export { setLocalStorage, getLocalStorage }