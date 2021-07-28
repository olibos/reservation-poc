import { db } from './db';
import { selectedBuilding } from './selectedBuilding';
import { selectedFloor } from './selectedFloor';
import type { FirebaseFirestore } from '@firebase/firestore-types';
import { asyncable } from 'svelte-asyncable';
import type { Floor } from './models';

export const floors = asyncable(async ($db: Promise<FirebaseFirestore>, $selectedBuilding: string) =>
{
    if (!$selectedBuilding)
    {
        selectedFloor.set(undefined);
        return [];
    }

    const db = await $db;
    const floors = await db.collection(`buildings/${$selectedBuilding}/floors`).get();
    return floors.docs.map(d => ({ id: d.id, ...d.data() } as Floor));
}, null, [db, selectedBuilding]);