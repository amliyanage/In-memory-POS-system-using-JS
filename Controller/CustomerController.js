import { saveCustomer } from '../model/CustomerModel.js';
import { getAllCustomers } from '../model/CustomerModel.js';

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
        loadTable(customer);
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

// function table(cus){
//     $('#CustomerManage .tableRow tr').each(function() {
        
//     });
// }

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

