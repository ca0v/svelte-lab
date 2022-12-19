const SCOPES = "https://www.googleapis.com/auth/photoslibrary.readonly"
const DISCOVERY_DOC = "https://www.googleapis.com/discovery/v1/apis/photoslibrary/v1/rest";

const callbackMap = {
    "google+gapi": [],
}

/**
 * @param {string} key
 */
function getFromLocalStorage(key: string) {
    const result = localStorage.getItem(key);
    if (result == null) return null;
    return JSON.parse(result);
}

/**
 * @param {string} key
 * @param {any} value
 */
function setInLocalStorage(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
}

/**
 * @param {string} message
 */
async function promptForValue(message: string) {
    let result = getFromLocalStorage(message);
    if (result) return result;
    return new Promise((resolve, reject) => {
        result = prompt(message);
        if (result) {
            setInLocalStorage(message, result);
            resolve(result);
        }
        reject(new Error('No value provided'));
    })
}

async function useGoogle() {
    console.log("useGoogle")
    if (!gapi) throw "gapi not loaded"
    if (!gapi.client) throw "gapi.client not loaded"
    const clientId = await promptForValue('YOUR_CLIENT_ID');
    return new Promise((resolve, reject) => {
        const tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: clientId,
            scope: SCOPES,
            callback: (response: any) => {
                if (response.error) {
                    reject(response.error);
                    return;
                }
                console.log("tokenClient", response)
                // expires_in is in seconds
                const expires_at = (Date.now() + 1000 * parseInt(response.expires_in));
                setInLocalStorage('google', { ...response, expires_at });
                resolve(response);
            },
            error_callback: (error: any) => {
                console.error(error);
                setInLocalStorage('YOUR_CLIENT_ID', null);
                reject(error);
            }
        })

        // token is always null on refresh but why prompt for identity?        
        const token = gapi.client.getToken();
        if (token === null) {
            if (getFromLocalStorage('google') === null) {
                tokenClient.requestAccessToken({ prompt: "consent" });
            } else {
                const accessTokenInfo = getFromLocalStorage('google');
                if (accessTokenInfo.expires_at > Date.now()) {
                    console.log("reusing token", accessTokenInfo)
                    gapi.client.setToken({ access_token: accessTokenInfo.access_token });
                    resolve(accessTokenInfo);
                } else {
                    tokenClient.requestAccessToken({ prompt: "" });
                }
            }
        } else {
            tokenClient.requestAccessToken({ prompt: "" });
        }

    });

}

async function useGapi() {
    console.log("useGapi")
    if (!gapi) throw "gapi not loaded"
    return new Promise<void>((resolve, reject) => {
        gapi.load("client", async () => {
            try {
                const apiKey = await promptForValue('YOUR_API_KEY');
                await gapi.client.init({
                    apiKey: apiKey,
                    discoveryDocs: [DISCOVERY_DOC],
                })
                resolve();
            } catch (error) {
                console.error(error);
                setInLocalStorage('YOUR_API_KEY', null);
                reject();
            }
        });
    });
}

/**
 * @param {string} api
 */
function loaded(api: string) {

    const keys = Object.keys(callbackMap).filter(k => k.split("+").includes(api));
    if (!keys.length) return;
    keys.forEach(async key => {
        const requiredApis = key.split("+");
        const availableApis = requiredApis.filter(k => !!window[k]);
        if (availableApis.length !== requiredApis.length) return;
        const callbacks = callbackMap[key];
        if (!callbacks) return;
        await Promise.all(callbacks.map((/** @type {() => any} */ c: () => any) => c()))
    })

}

{
    // <script async defer src="https://apis.google.com/js/api.js" onload="loaded('gapi')"></script>
    // <script async defer src="https://accounts.google.com/gsi/client" onload="loaded('google')"></script>
    /**
     * @param {string} src
     * @param {string} id
     */
    function injectScript(src: string, id: string) {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.defer = true;
        script.onload = () => loaded(id);
        document.body.appendChild(script);
    }

    injectScript('https://apis.google.com/js/api.js', 'gapi');
    injectScript('https://accounts.google.com/gsi/client', 'google');
}

let signedIn = false;

export async function signin() {
    console.log("signin")
    if (signedIn) return console.log("already signed in");
    await useGapi();
    await useGoogle();
    signedIn = true;
    console.log({ signedIn });
}

export async function signout() {
    console.log("signout")
    if (!signedIn) return console.log("not signed in");
    const token = gapi.client.getToken()
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token)
        gapi.client.setToken(null)
        setInLocalStorage('google', null);
    }
    signedIn = false;
    console.log({ signedIn });
}
