let ip = require('../ip.json')
ip = JSON.stringify(ip)
ip = ip.substring(7)
ip = ip.substring(0,ip.length-2)
ip = ip + "/register/"

const register = async (username,email,password,conPassword) => {
	let result;

	await fetch(ip, {
		method: 'POST',
		headers: { 
		       'Accept': 'application/json',
		       'Content-Type': 'application/json' 
		       },
		body: JSON.stringify({
			username:username,
			email:email,
			password:password,
			conPassword:conPassword})
		})
		.then((response) => response.json()) 
		.then((data) => {
			data = JSON.parse(data)
			result = data
		})
	.catch((err) => { console.log("ERROR: ",err); 
	});
	return result;
}

export default register;