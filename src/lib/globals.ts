let dummy: HTMLElement;

class PhotoDB {
    getGlobal<T>(key: string) {
        const result = localStorage.getItem(`global.${key}`)
        if (!result) return null;
        return { value: <T>JSON.parse(result) }
    }

    putGlobal<T>(key: string, value: T) {
        localStorage.setItem(`global.${key}`, JSON.stringify(value))
        return value;
    }
}

const photoDB = new PhotoDB()

export function range(size: number) {
    return new Array(size).fill(0).map((_, i) => i);
}

// read data from localstorage
export async function getLocalStorage<T>(key: string, defaultValue: T): Promise<T>
export async function getLocalStorage<T>(key: string): Promise<T | null>
export async function getLocalStorage<T>(key: string, defaultValue?: T) {
    key = `svelte_lab.${key}`
    let data = await photoDB.getGlobal<T>(key);
    return data?.value || defaultValue;
}

// write data to localstorage
export function setLocalStorage(key: string, data: any) {
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
        return newPhotoUrl
    }
}

export function getEffectiveTransform(transform: string) {
    if (!dummy) {
        dummy = document.createElement("div")
        document.body.appendChild(dummy)
    }
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

