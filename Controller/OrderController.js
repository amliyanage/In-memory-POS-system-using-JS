import { getAllOrders } from "../model/OrderModel.js";
import { getAllCustomers } from "../model/CustomerModel.js";

$(document).ready(function () {
    refresh();
});

$('.orderManageBtn').click(function(){
    refresh();
});

function refresh(){
    $('#OrderManage .orderId').val(generateId());
    $('#OrderManage .orderDate').val(new Date().toISOString().split('T')[0]);
    loadCustomer();
}

function extractNumber(id){
    var match = id.match(/I0(\d+)/);
    if(match && match.length > 1){
        return match[1];
    }
    return null;
}

function generateId(){
    let orders = getAllOrders();
    
    if(!orders || orders.length === 0){
        return 'OD001';
    }
    else{
        let orderId = orders[orders.length - 1].orderId;
        let number = extractNumber(orderId);
        number++;
        return 'OD' + number;
    }
}

function loadCustomer(){
    let cmb = $('#OrderManage .customers');
    cmb.empty();
    let option = [];
    let customers = getAllCustomers();

    for (let i = 0; i < customers.length; i++) {
        option.push(customers[i].custId);
    }

    $.each(option, function (index, value) {
        cmb.append($('<option>').val(value).text(value));
    });
}

$('#OrderManage .customers').change(function(){
    let customer = getAllCustomers().find(c => c.custId === $(this).val());
    $('#OrderManage .custId').val(customer.custId);
    $('#OrderManage .custName').val(customer.custName);
    $('#OrderManage .custAddress').val(customer.custAddress);
    $('#OrderManage .custSalary').val(customer.custSalary);
});


