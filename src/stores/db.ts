import firebase from '@firebase/app';
import type { FirebaseOptions } from '@firebase/app-types';
import type { OAuthCredential } from '@firebase/auth-types';
import '@firebase/auth';
import '@firebase/firestore';
import { asyncable } from 'svelte-asyncable';

if (firebase.apps && !firebase.apps.length)
{
    const firebaseConfig: FirebaseOptions = {
        apiKey: 'AIzaSyAu1z4-f9_Ng9ni83-kFw-YNTyd8t63j_4',
        authDomain: 'reservation-321106.firebaseapp.com',
        projectId: 'reservation-321106',
        storageBucket: 'reservation-321106.appspot.com',
        messagingSenderId: '179848159322',
        appId: '1:179848159322:web:02e7a3803a6224fecc7863',
        measurementId: 'G-FK0PL2EFEM'
    };

    firebase.initializeApp(firebaseConfig);
}

export const db = asyncable(async () =>
{
    const result = await firebase.auth().getRedirectResult();
    const credential = result.credential as OAuthCredential;
    if (!credential) {
        const provider = new firebase.auth.OAuthProvider('microsoft.com');
        provider.setCustomParameters({
            tenant: '22bdce7a-e492-4cb7-aca9-e796609f238b'
        });
        await firebase.auth().signInWithRedirect(provider);
        return;
    }

    return firebase.firestore();
});