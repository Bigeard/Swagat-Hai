// db.ts
import { openDB, IDBPDatabase } from 'idb';
import { DataWordListType, WordType } from '../types';

const DB_NAME = 'ListWordsDB';
let dbPromise: Promise<IDBPDatabase>;

function getDb() {
    if (!dbPromise) {
        dbPromise = openDB(DB_NAME, 2, {
            upgrade(db) {
                if (!db.objectStoreNames.contains('listMeta')) {
                    db.createObjectStore('listMeta', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('listWords')) {
                    db.createObjectStore('listWords', { keyPath: 'listId' });
                }
            },
        });
    }
    return dbPromise;
}

// Save list (splits into meta (id and name) + words)
export async function addList(dataWordList: DataWordListType): Promise<void> {
    const db = await getDb();
    const tx = db.transaction(['listMeta', 'listWords'], 'readwrite');
    await tx.objectStore('listMeta').put({ id: dataWordList.id, name: dataWordList.name });
    await tx.objectStore('listWords').put({ listId: dataWordList.id, listWords: dataWordList.listWords });
    await tx.done;
}

// Get all list meta
export async function getAllMeta(): Promise<{ id: string; name: string }[]> {
    const db = await getDb();
    return db.getAll('listMeta');
}

// Get full word list when selected
export async function getListWords(id: string): Promise<WordType[] | undefined> {
    const db = await getDb();
    const entry = await db.get('listWords', id);
    return entry?.listWords;
}

export async function deleteList(id: string): Promise<void> {
    const db = await getDb();
    const tx = db.transaction(['listMeta', 'listWords'], 'readwrite');
    await tx.objectStore('listMeta').delete(id);
    await tx.objectStore('listWords').delete(id);
    await tx.done;
}