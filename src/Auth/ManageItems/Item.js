
class Item {
	constructor(name,date) {
		this.name = name;
		this.date = date;
		this.numDate = this.#createNumDate(date)
	}

	#createNumDate(date) {
		let first = date.indexOf('-')
	  let second = date.indexOf('-',first+1)

	  let day = parseInt(date.substring(0,first))
	  let month = parseInt(date.substring(first+1,second)) - 1
	  let year = parseInt(date.substring(second+1,date.length))
	  let newDate = new Date()
	  newDate.setFullYear(year,month,day)
	  newDate.setHours(0,0,0,0)
	  return newDate;
	}

}

export default Item;