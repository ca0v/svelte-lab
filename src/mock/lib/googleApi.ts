let signedIn = false;

async function signin() {
    if (signedIn) throw "already signed in";
    signedIn = true;
}

async function signout() {
    if (!signedIn) throw "not signed in";
    signedIn = false;
}

export { signin, signout }