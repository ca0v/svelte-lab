import { PhotoDB } from "./indexdb"

const photoDB = new PhotoDB();
await photoDB.initialize();

let client_id = await getLocalStorage('clientId');

export function range(size: number) {
    return new Array(size).fill(0).map((_, i) => i);
}

// read data from localstorage
async function getLocalStorage(key: string) {
    key = `svelte_lab.${key}`
    let data = await photoDB.getGlobal<any>(key);
    if (data) {
        return data.value;
    }
    data = localStorage.getItem(key)
    if (data) {
        return JSON.parse(data)
    }
    return null
}

// write data to localstorage
const setLocalStorage = (key: string, data: any) => {
    key = `svelte_lab.${key}`
    //localStorage.setItem(key, JSON.stringify(data));
    photoDB.putGlobal(key, data)
}

// prompt user for value
const promptUser = (message: string) => {
    return prompt(message)
}

// get the photo url or prompt user for it
const getPhotoUrl = async () => {
    const photoUrl = await getLocalStorage('photoServerUrl')
    if (photoUrl) {
        return photoUrl
    }

    while (true) {
        const newPhotoUrl = promptUser('Please enter your photo url')
        if (!newPhotoUrl) return;
        newPhotoUrl && setLocalStorage('photoServerUrl', newPhotoUrl)

        // verify the url by getting the client id
        try {
            client_id = "";
            client_id = await getClientId();
            return newPhotoUrl
        } catch (ex) {
            reportError(ex);
        }
    }
}

export async function getClientId() {
    if (!client_id) {
        const photoUrl = await getPhotoUrl();
        const response = await fetch(`${photoUrl}/client_id`, { credentials: "include" });
        client_id = (await response.json()).client_id;
    }
    setLocalStorage('clientId', client_id)
    return client_id
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

export { setLocalStorage, getLocalStorage, getPhotoUrl }