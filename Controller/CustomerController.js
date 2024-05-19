import { saveCustomer } from '../model/CustomerModel.js';
import { getAllCustomers } from '../model/CustomerModel.js';
import { updateCustomer } from '../model/CustomerModel.js';
import { deleteCustomer } from '../model/CustomerModel.js';

$(document).ready(function(){
    refresh();
});

document.querySelector('#CustomerManage #customerForm').addEventListener('submit', function(event){
    event.preventDefault();
});

var custId ;
var custName;
var custAddress;
var custSalary;

$('#CustomerManage .saveBtn').click(function(){

    custId = $('#CustomerManage .custId').val();
    custName = $('#CustomerManage .custName').val();
    custAddress = $('#CustomerManage .custAddress').val();
    custSalary = $('#CustomerManage .custSalary').val();

    let customer = {
        custId : custId,
        custName : custName,
        custAddress : custAddress,
        custSalary : custSalary
    }

    let validResult = validate(customer);

    if(validResult){
        saveCustomer(customer);
        refresh();
    }

});


function validate(customer){

    let valid = true;

    if((/^C0[0-9]+$/).test(customer.custId)){
        $('#CustomerManage .invalidCustId').text('');
        valid = true;
    }
    else{
        $('#CustomerManage .invalidCustId').text('Invalid Customer Id');
        valid = false;
    }

    if((/^(?:[A-Z][a-z]*)(?: [A-Z][a-z]*)*$/).test(customer.custName)){
        $('#CustomerManage .invalidCustName').text('');
        
        if(valid){
            valid = true;
        }
    }

    else{
        $('#CustomerManage .invalidCustName').text('Invalid Customer Name');
        valid = false;
    }

    if((/^[A-Z][a-z, ]+$/).test(customer.custAddress)){
        $('#CustomerManage .invalidCustAddress').text('');
        
        if(valid){
            valid = true;
        }
    }

    else{
        $('#CustomerManage .invalidCustAddress').text('Invalid Customer Address');
        valid = false;
    }

    if(customer.custSalary != null && customer.custSalary > 0){
        $('#CustomerManage .invalidCustSalary').text('');
        if(valid){
            valid = true;
        }
    }
    
    else{
        $('#CustomerManage .invalidCustSalary').text('Invalid Customer Salary');
        valid = false;
    }

    let customers = getAllCustomers();
    for(let i = 0; i < customers.length; i++){
        if(customers[i].custId === customer.custId){
            $('#CustomerManage .invalidCustId').text('Customer Id Already Exists');
            valid = false;
        }
    }

    return valid;
}

function loadTable(customer){
    $('#CustomerManage .tableRow').append(
        '<tr> ' +
            '<td>' + customer.custId + '</td>' +
            '<td>' + customer.custName + '</td>' +
            '<td>' + customer.custAddress + '</td>' +
            '<td>' + customer.custSalary + '</td>' +
        '</tr>' 
    );
}

function extractNumber(id) {
    var match = id.match(/C0(\d+)/);
    if (match && match.length > 1) {
        return parseInt(match[1]);
    }
    return null;
}

function createCustomerId() {
    let customers = getAllCustomers();
    
    if (!customers || customers.length === 0) {
        return 'C01';
    } else {
        let lastCustomer = customers[customers.length - 1];
        let id = lastCustomer && lastCustomer.custId ? lastCustomer.custId : 'C00';
        
        let number = extractNumber(id);
        number++;
        return 'C0' + number;
    }
}

function refresh(){
    $('#CustomerManage .custId').val(createCustomerId());
    $('#CustomerManage .custName').val('');
    $('#CustomerManage .custAddress').val('');
    $('#CustomerManage .custSalary').val('');
    $('#CustomerManage .invalidCustId').text('');
    $('#CustomerManage .invalidCustName').text('');
    $('#CustomerManage .invalidCustAddress').text('');

    reloadTable();
}

$('#CustomerManage .cleatBtn').click(function(){
    refresh();
});

$('#CustomerManage .searchBtn').click(function(){
    let customer = searchCustomer($('#CustomerManage .custId').val());
    if(customer){
        $('#CustomerManage .custName').val(customer.custName);
        $('#CustomerManage .custAddress').val(customer.custAddress);
        $('#CustomerManage .custSalary').val(customer.custSalary);
    }
    else{
        alert('Customer Not Found');
    }
});

function searchCustomer(id){
    let customers = getAllCustomers();
    let customer = customers.find(c => c.custId === id);
    return customer;
}

$('#CustomerManage .updateBtn').click(function(){
    
    let UpdateCustomer = {
        custId : 'C00',
        custName : $('#CustomerManage .custName').val(),
        custAddress : $('#CustomerManage .custAddress').val(),
        custSalary : $('#CustomerManage .custSalary').val()
    }

    let validResult = validate(UpdateCustomer);

    UpdateCustomer.custId = $('#CustomerManage .custId').val();
    
    if(validResult){
        let customers = getAllCustomers();
        let index = customers.findIndex(c => c.custId === UpdateCustomer.custId);
        updateCustomer(index, UpdateCustomer);
        refresh();
    }

});

function reloadTable(){
    let customers = getAllCustomers();
    $('#CustomerManage .tableRow').empty();
    customers.forEach(c => {
        loadTable(c);
    });
}

$('#CustomerManage .removeBtn').click(function(){
    let customers = getAllCustomers();
    let id = $('#CustomerManage .custId').val();

    let index = customers.findIndex(c => c.custId === id);
    if(index >= 0){
        deleteCustomer(index);
        refresh();
    }
    else{
        alert('Customer Not Found');
    }
});

$('#CustomerManage .tableRow').on('click', 'tr', function(){
    let id = $(this).children('td:eq(0)').text();
    let name = $(this).children('td:eq(1)').text();
    let qty = $(this).children('td:eq(2)').text();
    let price = $(this).children('td:eq(3)').text();

    $('#CustomerManage .custId').val(id);
    $('#CustomerManage .custName').val(name);
    $('#CustomerManage .custAddress').val(qty);
    $('#CustomerManage .custSalary').val(price);
});

