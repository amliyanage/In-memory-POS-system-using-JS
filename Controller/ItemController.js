import { saveItem } from '../model/ItemModel.js';
import { getAllItems } from '../model/ItemModel.js';
import { deleteItem } from '../model/ItemModel.js';
import { updateItem } from '../model/ItemModel.js';

document.querySelector('#ItemManage #ItemForm').addEventListener('submit', function(event){
    event.preventDefault();
});

$(document).ready(function(){
    refresh();
});

var itemId ;
var itemName;
var itemQty;
var itemPrice;

$('#ItemManage .saveBtn').click(function(){
    
        itemId = $('#ItemManage .itemId').val();
        itemName = $('#ItemManage .itemName').val();
        itemQty = $('#ItemManage .itemQty').val();
        itemPrice = $('#ItemManage .itemPrice').val();
    
        let item = {
            itemId : itemId,
            itemName : itemName,
            itemQty : itemQty,
            itemPrice : itemPrice
        }

        if(validate(item)){
            saveItem(item);
            refresh();
        }

});

function validate(item){
        
        let valid = true;
        
        if((/^I0[0-9]+$/).test(item.itemId)){
            $('#ItemManage .invalidCode').text('');
            valid = true;
        }
        else{
            $('#ItemManage .invalidCode').text('Invalid Item Id');
            valid = false;
        }
        
        if((/^(?:[A-Z][a-z]*)(?: [A-Z][a-z]*)*$/).test(item.itemName)){
            $('#ItemManage .invalidName').text('');
                
            if(valid){
                valid = true;
            }
        }
        
        else{
            $('#ItemManage .invalidName').text('Invalid Item Name');
            valid = false;
        }

        if(item.itemQty != null && item.itemQty > 0){
            $('#ItemManage .invalidQty').text('');
            if(valid){
                valid = true;
            }
        }
        else{
            $('#ItemManage .invalidQty').text('Invalid Item Quantity');
            valid = false;
        }

        if(item.itemPrice != null && item.itemPrice > 0){
            $('#ItemManage .invalidPrice').text('');
            if(valid){
                valid = true;
            }
        }

        else{
            $('#ItemManage .invalidPrice').text('Invalid Item Price');
            valid = false;
        }

        let items = getAllItems();

        for(let i = 0; i < items.length; i++){
            if(items[i].itemId === item.itemId){
                $('#ItemManage .invalidCode').text('Item Id already exists');
                valid = false;
                return valid;
            }
        }

        return valid;
        
}

function extractNumber(id){
    var match = id.match(/I0(\d+)/);
    if(match && match.length > 1){
        return match[1];
    }
    return null;
}


function refresh(){
    $('#ItemManage .itemId').val(generateId());
    $('#ItemManage .itemName').val('');
    $('#ItemManage .itemQty').val('');
    $('#ItemManage .itemPrice').val('');
    loadTable();
}

function generateId(){
    let items = getAllItems();

    if(!items || items.length == 0){
        return 'I01';
    }
    else{
        let lastItem = items[items.length - 1];
        console.log(lastItem);
        let number = extractNumber(lastItem.itemId);
        console.log(number);
        number++;
        return 'I0' + number;
    }
}

function loadTable(){
    let items = getAllItems();
    $('#ItemManage .tableRow').empty();
    for(let i = 0; i < items.length; i++){
        $('#ItemManage .tableRow').append(
            '<tr> ' +
                '<td>' + items[i].itemId + '</td>' +
                '<td>' + items[i].itemName + '</td>' +
                '<td>' + items[i].itemQty + '</td>' +
                '<td>' + items[i].itemPrice + '</td>' +
            '</tr>' 
        );
    }
}

$('#ItemManage .tableRow').on('click', 'tr', function(){
    let id = $(this).children('td:eq(0)').text();
    let name = $(this).children('td:eq(1)').text();
    let qty = $(this).children('td:eq(2)').text();
    let price = $(this).children('td:eq(3)').text();

    $('#ItemManage .itemId').val(id);
    $('#ItemManage .itemName').val(name);
    $('#ItemManage .itemQty').val(qty);
    $('#ItemManage .itemPrice').val(price);
});

$('#ItemManage .deleteBtn').click(function(){
    let id = $('#ItemManage .itemId').val();
    let items = getAllItems();
    let item = items.findIndex(item => item.itemId === id);
    if(item >= 0){
        deleteItem(item);
        refresh();
    }
    else{
        $('#ItemManage .invalidCode').text('Item Id does not exist');
    }
});

$('#ItemManage .updateBtn').click(function(){
    alert('Update');
    let item = {
        itemId : 'I00',
        itemName : $('#ItemManage .itemName').val(),
        itemQty : $('#ItemManage .itemQty').val(),
        itemPrice : $('#ItemManage .itemPrice').val()
    }

    let valid = validate(item);

    item.itemId = $('#ItemManage .itemId').val();

    if(valid){
        let items = getAllItems();
        let index = items.findIndex(i => i.itemId === item.itemId);
        updateItem(index, item);
        refresh();
    }
});

$('#ItemManage .clearBtn').click(function(){
    refresh();
});

$('#ItemManage .searchBtn').click(function(){
    let id = $('#ItemManage .itemId').val();
    let items = getAllItems();
    let item = items.find(item => item.itemId === id);
    if(item){
        $('#ItemManage .itemName').val(item.itemName);
        $('#ItemManage .itemQty').val(item.itemQty);
        $('#ItemManage .itemPrice').val(item.itemPrice);
    }
    else{
        $('#ItemManage .invalidCode').text('Item Id does not exist');
    }
});