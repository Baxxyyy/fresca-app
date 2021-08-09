// let ip = "http://46.137.133.17:8000/login/"       // aws ip
let ip = "http://127.0.0.1:8000/login/"        // local ip

const hasAuth = async (username,token) => {
	let result;
	await fetch(ip, {
		method: 'POST',
		headers: { 
		       'Accept': 'application/json',
		       'Content-Type': 'application/json' 
		       },
		body: JSON.stringify({username:username,token:token})
		})
		.then((response) => response.json()) 
		.then((data) => {
			if (data[1] == "1") {
				result=true;
			} else {
				result=false;
			}
		})
	.catch((err) => { console.log(err); });
	return result
}


export default hasAuth