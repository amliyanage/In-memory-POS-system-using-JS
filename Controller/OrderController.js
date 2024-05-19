import { getAllOrders } from "../model/OrderModel.js";
import { getAllCustomers } from "../model/CustomerModel.js";
import { getAllItems } from "../model/ItemModel.js";

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
    loadItems();
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

function loadItems(){
    let cmb = $('#OrderManage .itemCmb');
    cmb.empty();
    let option = [];
    let items = getAllItems();

    for (let i = 0; i < items.length; i++) {
        option.push(items[i].itemId);
    }

    $.each(option, function (index, value) {
        cmb.append($('<option>').val(value).text(value));
    });
}

$('#OrderManage .itemCmb').change(function(){
    let item = getAllItems().find(i => i.itemId === $(this).val());
    $('#OrderManage .itemCode').val(item.itemId);
    $('#OrderManage .itemName').val(item.itemName);
    $('#OrderManage .itemQty').val(item.itemQty);
    $('#OrderManage .itemPrice').val(item.itemPrice);
});

let getItems = [];

$('#OrderManage .addBtn').click(function(){
    let getItem = {
        itemCode : $('#OrderManage .itemCode').val(),
        getItems : $('#OrderManage .itemName').val(),
        itemPrice : $('#OrderManage .itemPrice').val(),
        itemQty : $('#OrderManage .orderQty').val(),
        total : $('#OrderManage .itemPrice').val() * $('#OrderManage .orderQty').val()
    }

    getItems.push(getItem);
    loadTable();
});


function loadTable(){
    $('#OrderManage .tableRow').empty();
    for(let i = 0; i < getItems.length; i++){
        $('#OrderManage .tableRows').append(
            '<div> ' +
                '<div>' + getItems[i].itemCode + '</div>' +
                '<div>' + getItems[i].getItems + '</div>' +
                '<div>' + getItems[i].itemPrice + '</div>' +
                '<div>' + getItems[i].itemQty + '</div>' +
                '<div>' + getItems[i].total + '</div>' +
            '</tr>' 
        );
    }
}

// $('#orderManage .itemCmb')