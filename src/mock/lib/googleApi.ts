let signedIn = false;

async function signin() {
    signedIn = true;
    return signedIn
}

async function signout() {
    signedIn = false;
    return signedIn
}

export { signin, signout }