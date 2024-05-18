import { Customers } from '../db/DB.js';

export function saveCustomer(customer) {
    Customers.push(customer);
}

export function getAllCustomers() {
    return Customers;
}