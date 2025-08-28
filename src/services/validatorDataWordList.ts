import { DataWordListType, WordType } from '../types';

const isWord = (obj: any): obj is WordType => {
    return (
        obj &&
        typeof obj.answer === 'string' &&
        typeof obj.guess === 'string' &&
        typeof obj.translation === 'string'
    );
}

export const isWordList = (obj: any): obj is DataWordListType => {
    return (
        obj &&
        typeof obj.id === 'string' &&
        typeof obj.name === 'string' &&
        Array.isArray(obj.listWords) &&
        obj.listWords.every(isWord)
    );
}
