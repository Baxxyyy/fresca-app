let ip = require('./ip.json')
ip = JSON.stringify(ip)
ip = ip.substring(7)
ip = ip.substring(0,ip.length-2)
ip = ip + "/login/"

const hasAuth = async (username,token) => {
	let result;
	await fetch(ip, {
		method: 'POST',
		headers: { 
		       'Accept': 'application/json',
		       'Content-Type': 'application/json' 
		       },
		data: JSON.stringify({username:username,token:token})
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