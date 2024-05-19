import { Items } from '../db/DB.js';

export function saveItem(item) {
    Items.push(item);
    console.log(Items);
}

export function getAllItems() {
    return Items;
}

export function deleteItem(index){
    Items.splice(index, 1);
}

export function updateItem(index, item){
    Items[index] = item;
}