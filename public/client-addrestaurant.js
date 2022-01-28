function add(){
	//create new restaurant object
	let newR = {};
	newR.name = document.getElementById("name").value;
	newR.delivery_fee = Number(document.getElementById("fee").value);
	newR.min_order = Number(document.getElementById("min").value);
	//sent new restaurant to server
	let req = new XMLHttpRequest();
	req.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
			//if response is empty, alert user
			if(this.responseText == ""){
				alert("Incorrect fields!");
				document.getElementById("name").value = "";
				document.getElementById("fee").value = "";
				document.getElementById("min").value = "";
				return;
			}
			//if adding was successful, redirect to page
			let data = JSON.parse(this.responseText);
			window.location.href = '/restaurant/'+data.id;
		}
	}
	req.open("POST", "/restaurants");
	req.setRequestHeader("Content-Type", "application/json");
	req.send(JSON.stringify(newR));
}