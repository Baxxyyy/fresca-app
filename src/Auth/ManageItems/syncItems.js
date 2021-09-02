import getItems from './getItems';
import getKey from '../getKey';
import removeLocalItem from './removeLocalItem';

let ip = require('../ip.json')
ip = JSON.stringify(ip)
ip = ip.substring(7)
ip = ip.substring(0,ip.length-2)
ip = ip + "/sync/"

const syncItems = async () => {
	let removeFoods = await getKey("removeList");
	let addFoods = await getKey("addItems");

	if (removeFoods == null && addFoods == null) {
		return 1
	}

	if (removeFoods == null) {
		removeFoods = "[]"
	}
	if (addFoods == null) {
		addFoods = "[]"
	}

	let token;
	let username;

	await getKey("username").then((value) => username = value).catch((err) => { result=false });
	await getKey("token").then((value) => token = value).catch((err) => { result=false });

	await fetch(ip, {
		method: 'POST',
		headers: { 
		       'Accept': 'application/json',
		       'Content-Type': 'application/json' 
		       },
		body: JSON.stringify({
			username:username,
			token:token,
			removalItems:removeFoods,
			addItems: addFoods,
		})})
		.then((response) => response.json()) 
		.then((data) => {
			data = JSON.parse(data)
			if (data == '1') {
				removeLocalItem("removeList")
				removeLocalItem("addItems")
				return 1
			} else {
				return 0
			}
		})
	.catch((err) => { console.log("ERROR: ",err); });
}

export default syncItems;