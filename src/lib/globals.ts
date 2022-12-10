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
    setLocalStorage('photoUrl', newPhotoUrl)
    return newPhotoUrl
}

const photoUrl = getPhotoUrl()

export { photoUrl, setLocalStorage, getLocalStorage }