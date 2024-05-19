import { Items } from '../db/DB.js';

export function saveItem(item) {
    Items.push(item);
    console.log(Items);
}

export function getAllItems() {
    return Items;
}