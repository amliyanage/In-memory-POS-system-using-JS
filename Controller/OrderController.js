import { getAllOrders } from "../model/OrderModel.js";
import { getAllCustomers } from "../model/CustomerModel.js";
import { getAllItems } from "../model/ItemModel.js";
import { saveOrder } from "../model/OrderModel.js";

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
    var match = id.match(/OD(\d+)/);
    if(match && match.length > 1){
        return match[1];
    }
    return null;
}

function generateId(){
    let orders = getAllOrders();

    alert(orders.length);
    
    if(orders.length === 0){
        return 'OD01';
    }
    else{
        alert('awa');
        let orderId = orders[orders.length - 1].orderId;
        let number = extractNumber(orderId);
        number++;
        alert('OD0' + number);
        return 'OD0' + number;
    }
}

function loadCustomer(){
    let cmb = $('#OrderManage .customers');
    cmb.empty();
    let option = [];
    let customers = getAllCustomers();
    option.unshift('');
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

    option.unshift('');

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

function clear(tableCount){
    if(tableCount === 1){
        $('#OrderManage .itemCode').val('');
        $('#OrderManage .itemName').val('');
        $('#OrderManage .itemPrice').val('');
        $('#OrderManage .itemQty').val('');
        $('#OrderManage .orderQty').val('');
        $('#OrderManage .SubTotal').text('');
        $('#OrderManage .Cash').val('');
        $('#OrderManage .Total').text('');
        $('#OrderManage .Discount').val('');
        $('#OrderManage .itemCmb').val('');

    }
    else{
        $('#OrderManage .custId').val('');
        $('#OrderManage .custName').val('');
        $('#OrderManage .custAddress').val('');
        $('#OrderManage .custSalary').val('');
        $('#OrderManage .itemCode').val('');
        $('#OrderManage .itemName').val('');
        $('#OrderManage .itemPrice').val('');
        $('#OrderManage .itemQty').val('');
        $('#OrderManage .orderQty').val('');
    }
}

$('#OrderManage .addBtn').click(function(){
    let getItem = {
        itemCode: $('#OrderManage .itemCode').val(),
        getItems: $('#OrderManage .itemName').val(),
        itemPrice: parseFloat($('#OrderManage .itemPrice').val()),
        itemQty: parseInt($('#OrderManage .orderQty').val(), 10),
        total: parseFloat($('#OrderManage .itemPrice').val()) * parseInt($('#OrderManage .orderQty').val(), 10)
    };

    let itemQty = parseInt($('#OrderManage .itemQty').val(), 10);
    let orderQty = parseInt($('#OrderManage .orderQty').val(), 10);

    if(itemQty >= orderQty){
        if($('#OrderManage .custId').val() !== '' && $('#OrderManage .custName').val() !== null){
            if(orderQty > 0){
                getItems.push(getItem);
                loadTable();
                clear(1);
                setTotal();
            } else {
                alert('Invalid Quantity');
            }
        } else {
            alert('Invalid Customer');
        }
    } else {
        alert('Not Enough Quantity');
    }
});



function loadTable(){
    $('#OrderManage .tableRows').empty();
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

function setTotal(){
    let total = 0;
    for(let i = 0; i < getItems.length; i++){
        total += getItems[i].total;
    }
    $('#OrderManage .Total').text(total);
}

$('#OrderManage .placeOrder').click(function(){
    let cash = parseFloat($('#OrderManage .Cash').val());
    let total = parseFloat($('#OrderManage .Total').text());
    let discount = parseFloat($('#OrderManage .Discount').val());

    alert(cash + ' ' + total + ' ' + discount);

    if(cash >= total){
        if(discount >= 0 && discount <= 100){
            let subTotal = total - (total * discount / 100);
            $('#OrderManage .SubTotal').text(subTotal.toFixed(2));
            let balance = cash - subTotal;
            $('#OrderManage .Balance').val(balance.toFixed(2));

            let Order = {
                orderId : $('#OrderManage .orderId').val(),
                orderDate : $('#OrderManage .orderDate').val(),
                custId : $('#OrderManage .custId').val(),
                items : getItems,
                total : total,
                discount : discount,
                subTotal : subTotal,
                cash : cash,
                balance : balance
            }

            saveOrder(Order);

            getItems = [];
            loadTable();
            clear(2);
            refresh();
        } else {
            alert('Invalid Discount');
        }
    } else {
        alert('Not Enough Cash');
    }
});


// $('#orderManage .itemCmb')