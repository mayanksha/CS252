function submitForm(){
	let form = document.getElementById('strForm');
	let formValues = Object.values(form).reduce((obj,field) => { 
		obj[field.name] = field.value; return obj 
	}, {})
	let string = formValues.string.replace(/ /g, '+');
	console.log(string);
	const serverAddr = `http://127.0.0.1:8000/?string=${string}`;

	fetch(serverAddr)
		.then(e => e.json())
		.then(console.log)
		.catch(console.error)
}
/*window.onload()*/
