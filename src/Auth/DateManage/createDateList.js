import getItems from '../ManageItems/getItems';
import storeItems from '../storeItems';

const createDateList = async () => {
	let foods = await getItems()
	foods = JSON.parse(foods)

	foods.sort((a, b) => {
    return new Date(a.numDate) - new Date(b.numDate);
  })
  
  storeItems("DateItems",foods)
}

export default createDateList;