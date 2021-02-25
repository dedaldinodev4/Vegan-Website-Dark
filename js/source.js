
//**  LocalStorage **//
/**
 * @author Dedaldino Daniel
 * @version 0.0.1
 * @package Vegan App
 */

const StorageCtrl = (function(){

    return {
        storageItem: function(item){
            let items = [];
            let flag = 0;

            if(localStorage.getItem('items') === null){
                items = [];

                items.push(item);

                localStorage.setItem('items', JSON.stringify(items));

            }else{

                items = JSON.parse(localStorage.getItem('items'));

                items.forEach(function(itemId, index ){
                    if(item.id === itemId.id) {
                        flag = 1;
                        items[index].amount += 1; 
                    }
                });

                if(!flag){
                    items.push(item);            
                }

                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        AddAllItemsFromStorage: function(item, amountItem) {
            let flag = 0;
            let items = [];
            let amount = parseInt(amountItem);


            if(localStorage.getItem('items') === null){
                items = [];
                item.amount = amount;
                items.push(item);

                localStorage.setItem('items', JSON.stringify(items));

            } else{

                let items = JSON.parse(localStorage.getItem('items'));

                items.forEach(function(itemId, index ){
                    if(item.id === itemId.id) {
                        flag = 1;
                        let num = parseInt(items[index].amount) + amount
                        items[index].amount = num; 
                    }
                });

                if(!flag){
                    item.amount = amount;
                    items.push(item);            
                }

                localStorage.setItem('items', JSON.stringify(items));
            }
            
        },
        getItemsFromStorage: function(){
            let items ;

            if(localStorage.getItem('items') === null){
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }

            return items;
        },
        removeItemFromStorage: function(id){
            let items = localStorage.getItem('items');

            items.forEach(function(item, index){
                if(item.id === id) {
                    items.splice(index, 1);
                }
            });

            localStorage.setItem('items', JSON.stringify(items));
        },
        clearAllItemsFromStorage: function(){
            localStorage.removeItem('items');
        },
        lengthItemsFromStorage: function() {
            let items = localStorage.getItem('items');
            return items.length;
        }
        
    }
})();

const ItemCtrl = (function(){

    const Item = function(id, name,price, id_cliente){
        this.id     = id;
        this.name   = name;
        this.price  = price;
        this.amount = 1;
        this.id_cliente = id_cliente;
    }
  
    const dataStructure = {
        items: StorageCtrl.getItemsFromStorage(),
        totalItems : 0
    }
    

  return {
    getItems: function(){
        return dataStructure.items;
    },

    addItem: function(id,id_cliente, name,price){
        //* Create Item *//
        let flag = 0;
        new_item = new Item(id, name,price, id_cliente);

        dataStructure.items.forEach(function(item, index){
            if(item.id === new_item.id){
                flag = 1;
                dataStructure.items[index].amount += 1;
            }
        });

        if(!flag) {
            dataStructure.items.push(new_item);
        }
        
        return new_item;        
    },

    AddAllItems: function(id, name, price, id_cliente, amount){
        //* Create Item *//
        let flag = 0;
        new_item = new Item(id, name,price, id_cliente);

        dataStructure.items.forEach(function(item, index){
            if(item.id === new_item.id){
                flag = 1;
                dataStructure.items[index].amount += amount;
            }
        });

        if(!flag) {
            new_item.amount = amount;
            dataStructure.items.push(new_item);
        }
        
        return new_item;
    },

    getItemById: function(id){
        let found  = null;

        dataStructure.items.forEach(item =>{
            if(item.id ===  id){
                found = item;
            }
        });
        return found;
    },

    getTotalItems: function() {
        let total = 0;
        
        if(dataStructure.items.length != 0){
            total = dataStructure.items.length;
        }

        dataStructure.totalItems = total;

        return dataStructure.totalItems;
       
    },
    getLogData: function(){
        return dataStructure;
    }

  }

})();



 
const UICtrl = (function(){
    const UISelecctor = {
        itemId: '#id-cont',
        itemPrice: '#price-cont',
        itemName: '#name-cont',
        itemCollection : '.collection-item',
        addBtn: '.add-prod',
        cuponBtn : '#btn-coupon',
        addCartBtn : '#btn-add-single',
        clearBtn: 'btn-delete',
        removeBtn: '.btn-remove',
        prodCartId : '.details-single',
        prodCartName : '#name-single',
        prodCartPrice: '#price-single',
        amountInput: '#amount-single',
        totalItems: '.badge',
        tableBody: '#table-body'
    }
    
    //* Public method  *//
    return {
        getSelectors: function(){
          return UISelecctor;
        },
        getItemData: function(){
            return {
                id: document.querySelector(UISelecctor.itemId).textContent,
                name: document.querySelector(UISelecctor.itemName).textContent,
                price: document.querySelector(UISelecctor.itemPrice).textContent
            }
        },

        getSingleItem: function(){
            return {
                name_product: document.querySelector(UISelecctor.prodCartName).textContent,
                price_product: document.querySelector(UISelecctor.prodCartPrice).textContent,
                amount_product: document.querySelector(UISelecctor.amountInput).value
            }
        },
       showTotalItems: function(total) {
            document.querySelector(UISelecctor.totalItems).textContent = total;
        },
        HideItemTable: function(){
            document.querySelector(UISelecctor.tableBody).innerHTML = '';
        }

    }
  
})();


const App = (function(ItemCtrl,StorageCtrl ,UICtrl){

    const loadListeners = function(){

        //* Get All Selector *//
        const UISelectors = UICtrl.getSelectors();

        //* Get Items from table *//
        document.addEventListener('DOMContentLoaded', getItemsFromTable);

        //*  Add Click Button *//
        $(UISelectors.addBtn).click(itemAddList);

        //* Add Button to Cart *//
        document.querySelector(UISelectors.addCartBtn).addEventListener('click', itemCartAdd);

        //* delete Button to cart *//
        document.querySelector(UISelectors.removeBtn).addEventListener('click', removeItemFromTable);

        //* clear all items *//
        document.getElementById(UISelectors.clearBtn).addEventListener('click', clearItemsFromTable);


        
    }

    const itemAddList = function(e) {

        let details_id  = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;

        let details = details_id.querySelector(".detals-price");

        const detailsItems = details.getElementsByClassName('collection-item');

        let id = details.id;

        id = id.split('-');
        id = id[1];

        const name = detailsItems[1].textContent;
        let price = detailsItems[0].textContent;
        const id_cliente = detailsItems[2].textContent;

        price = price.split(' ');
        price = parseFloat(price[1]);
    
        new_item = ItemCtrl.addItem(id,id_cliente,name, price);

        //* Storage in localStorage *//
        StorageCtrl.storageItem(new_item);

        //* Get total Items *//
        const totalItems = ItemCtrl.getTotalItems();

        //* Add total calories from UI *//
        UICtrl.showTotalItems(totalItems);

        e.preventDefault();
    }

    const itemCartAdd = function(e) {

        const UISelectors = UICtrl.getSelectors();


        let ID = document.querySelector(UISelectors.prodCartId).id;
        ID = ID.split('-');
        ID = ID[1];
        ID = parseInt(ID);

        let name = UICtrl.getSingleItem().name_product;
        let amount = UICtrl.getSingleItem().amount_product;
        let price = UICtrl.getSingleItem().price_product;
        price = price.split(' ');
        price = parseFloat(price[1]);


        new_item = ItemCtrl.AddAllItems(ID,name,price, 23, amount);

        //* Storage in localStorage *//
        StorageCtrl.AddAllItemsFromStorage(new_item, amount);

        //* Get total Items *//
        const totalItems = ItemCtrl.getTotalItems();

        //* Add total calories from UI *//
        UICtrl.showTotalItems(totalItems);

        e.preventDefault();
    }

    const getItemsFromTable = function(){

        const UISelectors = UICtrl.getSelectors();

        const body = document.querySelector(UISelectors.tableBody);

        if(body) {
            const items = StorageCtrl.getItemsFromStorage();

            if(items === null) {
                console.warn('Empty Table');
            } else {

                items.forEach(function(item){
            
                    let total = parseInt(item.price) * parseInt(item.amount);
                    let html = `
                    <tr>
                        <td class="thumbnail-img">
                            <a href="#">
                                <img class="img-fluid" src="images/prods/img-pro-01.jpg" alt="" />
                            </a>
                        </td>
                        <td class="name-pr">
                            <a href="#">
                                ${item.name}
                            </a>
                        </td>
                        <td class="price-pr">
                            <p>$ ${item.price}.00</p>
                        </td>
                        <td class="quantity-box">
                            <input type="number" size="4" value="${item.amount}" min="0" step="1" class="c-input-text qty text">
                        </td>
                        <td class="total-pr">
                            <p>$ ${total}.00</p>
                        </td>
                        <td class="remove-pr">
                            <a class="${item.id}" id="btn-remove">
                                <i class="fa fa-times"></i>
                            </a>
                        </td>
                    
                    </tr>
                    `;
        
                    body.innerHTML += html;
                });

            }

        
        }

        
    }

    const removeItemFromTable = function(e) {

        const id = e.target.parentNode;

        alert(id);
        

        e.preventDefault();
    }

    const clearItemsFromTable = function(e) {

        StorageCtrl.clearAllItemsFromStorage();

        //* Get total Items *//
        const totalItems = ItemCtrl.getTotalItems();

        //* Add total items from UI *//
        UICtrl.showTotalItems(totalItems);

        e.preventDefault();
    }

    return {
        init: function(){

            //* Get total Items *//
            const totalItems = ItemCtrl.getTotalItems();

            //* Add total items from UI *//
            UICtrl.showTotalItems(totalItems);

            loadListeners();
        }
    }
})(ItemCtrl,StorageCtrl ,UICtrl);

App.init();






