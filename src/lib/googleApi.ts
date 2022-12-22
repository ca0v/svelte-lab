import { getClientId, getPhotoUrl } from "./globals"

const SCOPES = "https://www.googleapis.com/auth/photoslibrary.readonly"
const DISCOVERY_DOC = "https://www.googleapis.com/discovery/v1/apis/photoslibrary/v1/rest";

let signedIn = false;

/**
 * obtains a google access token to the photos library
 */
async function useGooglePhotos(): Promise<{ access_token: string, expires_at: number }> {
    const client_id = await getClientId();

    return new Promise((resolve, reject) => {
        const tokenClient = google.accounts.oauth2.initTokenClient({
            client_id,
            scope: SCOPES,
            callback: async (response: any) => {
                if (response.error) {
                    reject(response.error);
                    return;
                }
                // expires_in is in seconds
                const expires_at = (Date.now() + 1000 * parseInt(response.expires_in));
                resolve({ expires_at, ...response });
            },
            error_callback: (error: any) => {
                console.error(error);
                reject(error);
            }
        })

        // token is always null on refresh but why prompt for identity?        
        tokenClient.requestAccessToken({ prompt: "" });

    });

}

/**
 * 1. obtains the user's google account id
 * 2. and uses it to sign into the stories server
 * 3. initializes the gapi client to use the photos library
 */
async function useGapi() {
    return new Promise<void>(async (good, bad) => {
        const client_id = await getClientId();
        const photoUrl = await getPhotoUrl();
        google.accounts.id.initialize({
            client_id,
            auto_select: true,
            callback: async (result) => {
                const { credential } = result;
                // sign into the photo server
                const response = await fetch(`${photoUrl}/login`, {
                    method: 'POST',
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ credential }),
                });
                const responseData = await response.json();

                gapi.load("client", async () => {
                    await gapi.client.init({
                        apiKey: responseData.apiKey,
                        discoveryDocs: [DISCOVERY_DOC],
                    })
                    good();

                })
            }
        })
        initializeGoogleAccount();
    })
}

function initializeGoogleAccount() {
    google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed()) {
            switch (notification.getNotDisplayedReason()) {
                case "invalid_client":
                    alert("The client ID provided is not valid.");
                    break;
                case "unknown_reason":
                    alert("Unknown reason for not displaying the prompt.");
                    break;
                default:
                    alert(notification.getNotDisplayedReason());
                    break;
            }
        }
        else if (notification.isSkippedMoment()) {
            switch (notification.getSkippedReason()) {
                case "user_cancel":
                    prompt("Alright, we'll ask you again later.");
                    break;
                default:
                    alert(notification.getSkippedReason());
                    break;
            }
        }
    })
}

export async function signin() {
    if (signedIn) throw "already signed in";
    await useGapi();
    await useGooglePhotos();
    signedIn = true;
}

export async function signout() {
    if (!signedIn) throw "not signed in";
    signedIn = false;
}