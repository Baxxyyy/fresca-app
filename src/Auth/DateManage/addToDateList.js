import getKey from '../getKey';
import storeItems from '../storeItems';
import findDatePlace from './findDatePlace';

const addToDateList = async (item) => {

	let foods = await getKey("DateItems")
	foods = JSON.parse(foods)

	let insertPoint = await findDatePlace(new Date(item.numDate))
	foods.splice(insertPoint,0,item)
	
	await storeItems("DateItems", foods)
}

export default addToDateList;