function submitForm(){
	let form = document.getElementById('strForm');
	let formValues = Object.values(form).reduce((obj,field) => { 
		obj[field.name] = field.value; return obj 
	}, {})
	let string = formValues.string.replace(/ /g, '+');
	console.log(string);
	const serverAddr = `http://127.0.0.1:8000/?string=${string}`;
	var myNode = document.getElementById("images");
	while (myNode.firstChild) {
		myNode.removeChild(myNode.firstChild);
	}
	fetch(serverAddr)
		.then(e => e.json())
		.then((obj) => {
			let arr = Object.keys(obj);
			arr.forEach((e) => {
				let div = document.getElementById('images')
				for (let i = 0; i< obj[e]; i++){
					let di = document.createElement('div');
					let elem = document.createElement('img');
					elem.setAttribute("src", `images/${e}${i+1}.jpg`);
					/*di.innerHTML = `${e}${i+1}`;*/
					elem.setAttribute("height", "200");
					elem.setAttribute("alt", "Flower");
					elem.classList.add("foo");
					di.appendChild(elem);
					div.appendChild(di);
					console.log(obj);	
				}
			})
		})
		.catch(console.error)
}
/*window.onload()*/
