import { asyncable } from 'svelte-asyncable';
import { db } from './db';
import type { FirebaseFirestore } from '@firebase/firestore-types';

export const admins = asyncable(async ($db: Promise<FirebaseFirestore>) =>
{

    const db = await $db;
    try
    {
        const buildings = await db.collection('admins').get();
        return buildings.docs.map(d => d.id);
    }
    catch (error)
    {
        console.info('Not Admin ;-)');
        return [];
    }
}, null, [db]);
