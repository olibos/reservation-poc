import { asyncable } from 'svelte-asyncable';
import { db } from './db';
import type { FirebaseFirestore } from '@firebase/firestore-types';
import type { Building } from './models';

export const buildings = asyncable(async ($db: Promise<FirebaseFirestore>) =>
{
    const db = await $db;
    const buildings = await db.collection('buildings').get();
    return buildings.docs.map(d => ({id: d.id, ...d.data()} as Building));
}, null, [db]);
