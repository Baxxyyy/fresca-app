import hasAuth from '../Auth/hasAuth';
import getKey from '../Auth/getKey';
import storeItems from '../Auth/storeItems';

import addLocalFood from '../Auth/ManageItems/addLocalFood';
import addToDateList from '../Auth/DateManage/addToDateList';

import Item from '../Auth/ManageItems/Item'

let ip = require('../Auth/ip.json')
ip = JSON.stringify(ip)
ip = ip.substring(7)
ip = ip.substring(0,ip.length-2)
ip = ip + "/add/"

const addItem = async (name,date) => {

	let result = false

	if (name.trim() == '' || name == "string") {
		return result
	}

	let newItem = new Item(name,date)

	let addList = await getKey("addItems")
	addList = JSON.parse(addList)


	if (addList == null) {
		storeItems("addItems", [[newItem.name,newItem.date]])
	} else {
		addList.push([newItem.name,newItem.date])
		storeItems("addItems", addList)
	}
	addLocalFood(newItem)
	await addToDateList(newItem)

	result = true
	return result
}

export default addItem