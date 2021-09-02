import getItems from './getItems';
import storeItems from '../storeItems';
import removeFromDateList from '../DateManage/removeFromDateList';


const removeLocalFood = async (item) => {
	var foods = await getItems();
	foods = JSON.parse(foods)

	let result = false;

	for (var i = 0; i < foods.length; i++) {
		if (foods[i].name == item.name && foods[i].date == item.date) {
			foods.splice(i,1)
			break
		}
	}
	storeItems("storedItems", foods)
	removeFromDateList(item)
	result = true
	return result
}


export default removeLocalFood;
