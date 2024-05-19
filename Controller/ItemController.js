import { saveItem } from '../model/ItemModel.js';
import { getAllItems } from '../model/ItemModel.js';

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