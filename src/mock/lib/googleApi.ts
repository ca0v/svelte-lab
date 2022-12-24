let signedIn = false;

async function signin() {
    signedIn = true;
}

async function signout() {
    signedIn = false;
}

export { signin, signout }