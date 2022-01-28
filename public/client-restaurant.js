//global variables
let myRest = {};	//restaurant object
let restID; 		// current restaurants ID
let itemIDarray = [];	// all current item IDs
let maxItems = 100;	//maximum number of items in menu. Can be changed.

//get restaurant object and id from server
function init(){
	//get restaurant json
	restID = document.getElementById("restID").innerText;
	let req = new XMLHttpRequest();
	req.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
			//create current restaurant object
			myRest = JSON.parse(this.responseText);
			//count number of IDs
			for(let category in myRest.menu){
				for(let item in myRest.menu[category]){
					itemIDarray.push(Number(item));
				}
			}
		}
	}
	req.open("GET", "/restaurant/"+restID);
	req.setRequestHeader("Accept", "application/json");
	req.send();
}

function addCat(){
	let newCat = document.getElementById("newCat").value;
	//check if valid vategory
	if(newCat == "" || document.getElementById(newCat)){
		alert("Invalid category.")
		return;
	}
	//clear textbox
	document.getElementById("newCat").value = "";
	//add category to menu display
	let menu = document.getElementById("menu");
	let div = document.createElement("div");
	div.id = newCat;
	let div2 = document.createElement("div");
	div2.className = "category";
	let text = document.createTextNode(newCat+": ");
	let br = document.createElement("br");
	div2.appendChild(text);
	div.appendChild(div2);
	div.appendChild(br);
	menu.appendChild(div);
	//add item to dropdown
	let select = document.getElementById("categories");
	let option = document.createElement("option");
	let newOp = document.createTextNode(newCat);
	option.appendChild(newOp);
	select.appendChild(option);
	//add category to object
	myRest.menu[newCat] = {};
}

function addItem(){
	//get info from new item form
	let newCat = document.getElementById("categories").value;
	let newName = document.getElementById("newItemName").value;
	let newPrice = document.getElementById("newItemPrice").value;
	let newDes = document.getElementById("newItemDescription").value;
	//check if valid data
	if(newName == "" || isNaN(Number(newPrice)) || newDes == ""){
		alert("Invalid item!");
		return;
	}
	//clear fields
	document.getElementById("newItemName").value = "";
	document.getElementById("newItemPrice").value = "";
	document.getElementById("newItemDescription").value = "";
	//ensure the items ID is unique
	let itemID = Math.floor(Math.random() * maxItems);
	while(itemIDarray.includes(itemID)) itemID = Math.floor(Math.random() * maxItems);
	itemIDarray.push(itemID);
	if(itemIDarray.length == maxItems) maxItems *= 2;
	//get html elements to manipulate DOM
	let menu = document.getElementById("menu");
	let cat = document.getElementById(newCat);
	let div1 = document.createElement("div");
	let div2 = document.createElement("div");
	let div3 = document.createElement("div");
	let div4 = document.createElement("div");
	let text1 = document.createTextNode("ID: " + itemID);
	let text2 = document.createTextNode(newName);
	let text3 = document.createTextNode(newDes);
	let text4 = document.createTextNode("$"+newPrice);
	let br = document.createElement("br");
	div1.appendChild(text1);
	div2.appendChild(text2);
	div3.appendChild(text3);
	div4.appendChild(text4);
	cat.appendChild(div1);
	cat.appendChild(div2);
	cat.appendChild(div3);
	cat.appendChild(div4);
	cat.appendChild(br);
	//add item to object
	myRest.menu[newCat][itemID] = {};
	myRest.menu[newCat][itemID].name = newName;
	myRest.menu[newCat][itemID].price = Number(newPrice);
	myRest.menu[newCat][itemID].description = newDes;
	itemID++;
}

function save(){
	//update restaurant object
	myRest.name = document.getElementById("name").value;
	myRest.min_order = Number(document.getElementById("min").value);
	myRest.delivery_fee = Number(document.getElementById("fee").value);
	//check if valid data
	if(myRest.name == "" || isNaN(myRest.min_order) || isNaN(myRest.delivery_fee)){
		alert("Cannot save!");
	}
	//send request
	let req = new XMLHttpRequest();
	req.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
			alert("Changes have been saved on the server!");
			//refresh page with saved data
			window.location.href = '/restaurant/'+restID;
		}
	}
	req.open("PUT", "/restaurant/"+restID);
	req.setRequestHeader("Content-Type", "application/json");
	req.send(JSON.stringify(myRest));
}










