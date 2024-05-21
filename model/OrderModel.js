import { Orders } from "../db/DB.js";

export function getAllOrders() {
    return Orders;
}

export function saveOrder(order){
    Orders.push(order);
}