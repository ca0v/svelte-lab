export function extractId(href: string): string {
    return href.substring(href.lastIndexOf("id=") + 3)
}


export function range(size: number) {
    return new Array(size).fill(0).map((_, i) => i);
}

// read data from localstorage
const getLocalStorage = (key: string) => {
    const data = localStorage.getItem(`svelte_lab.${key}`)
    if (data) {
        return JSON.parse(data)
    }
    return null
}

// write data to localstorage
const setLocalStorage = (key: string, data: any) => {
    localStorage.setItem(`svelte_lab.${key}`, JSON.stringify(data));
}

// prompt user for value
const promptUser = (message: string) => {
    return prompt(message)
}

// get the photo url or prompt user for it
const getPhotoUrl = () => {
    const photoUrl = getLocalStorage('photoServerUrl')
    if (photoUrl) {
        return photoUrl
    }
    const newPhotoUrl = promptUser('Please enter your photo url')
    newPhotoUrl && setLocalStorage('photoServerUrl', newPhotoUrl)
    return newPhotoUrl
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

export { setLocalStorage, getLocalStorage, getPhotoUrl }