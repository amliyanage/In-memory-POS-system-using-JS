import { Customers } from '../db/DB.js';

export function saveCustomer(customer) {
    Customers.push(customer);
}

export function getAllCustomers() {
    return Customers;
}

export function updateCustomer(updateCustomer){
    let index = Customers.findIndex(c => c.custId === updateCustomer.custId);
    Customers[index] = updateCustomer;
}