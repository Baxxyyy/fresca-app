import { StatusBar } from 'expo-status-bar';

import React, {useState, useEffect} from 'react';
import FuzzySet from 'fuzzyset'

import { StyleSheet, Text, View, ScrollView } from 'react-native';

import { Button, IconButton, TextInput, Dialog, Portal, Snackbar, Searchbar } from 'react-native-paper';

import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

import addItem from './addItem';
import getItems from '../Auth/ManageItems/getItems';
import getNewItems from '../Auth/ManageItems/getNewItems';
import syncItems from '../Auth/ManageItems/syncItems';

function AddScreen ({ navigation }) {

	useEffect(() => {
    const refresh = navigation.addListener('focus', () => {
      syncItems();
      loadItems();
    });
    return refresh;
  }, [navigation]);

	// States or constants

	const [itemList, setItemList] = useState(new Array());
	const [fuzzyList, setFuzzyList] = useState(new FuzzySet())
	const [fetched, setFetched] = useState(false);

	let colours = ['#fbffea','#f7ffad']
	let checked = []

	const [visible, setVisible] = useState(false);
	const [snackVisible, setSnackVisible] = useState(false);

	const [currentDate, setCurrentDate] = useState(new Date());
	const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [name, setName] = useState('string')
  const [newItem, setNewItem] = useState(false);

  const [searchList, setSearchList] = useState(new Array());
  const [searchQuery, setSearchQuery] = React.useState('');
  const [search, setSearch] = useState(false);

  const [quickShow, setQuickShow] = useState(false);

  const [snackState, setSnackState] = useState(false);

  // Helper functions

  const loadItems = async () => {
  	let newList = [];
  	let okay;
  	await getItems()
  	.then((response) => JSON.parse(response))
  	.then((parsed_value) => {
  		if (parsed_value == null) {
  			setItemList([])
  			setFuzzyList(FuzzySet([],true,1))
  			setFetched(true)
  			return
  		}
  		parsed_value = parsed_value.reverse()
  		for (var c=0; c < parsed_value.length; c++ ) {
  			okay = true
  			for (var i=0; i < newList.length; i++) {
  				if (parsed_value[c].name.toUpperCase() == newList[i].name.toUpperCase()) {
  					okay = false
  					break;
  				}
  			}
  			if (okay) {
  				newList.push(parsed_value[c])
  			}
  		}
  		setItemList(newList)
  		let temp = FuzzySet([],true,1)
  		for (var i=0; i < newList.length; i++) {
  			temp.add((newList[i].name).toUpperCase())
  		}
  		setFuzzyList(temp)
  	})
  	.catch((err) => console.log(err))
  	setFetched(true)
  }

  const refreshItems = async () => {
  	await getItems().then((res) => console.log(res)).catch((err) => console.log(err))
  	await loadItems().catch((err) => console.log(err))
  }

  // Dialog functions

	const showDialog = () => {
		setVisible(true)
		setNewItem(true)
	}

	const hideDialog = async (newDate) => {
		setVisible(false)
		let newdate = displayDate(newDate)
		await addItem(name,newdate).then((response) => setSnackState(response))
		await refreshItems().catch((err) => console.log(err))
		setNewItem(false)
		setCurrentDate(date)
		showSnack()
	}

	const cancelDialog = () => {
		setNewItem(false)
		setVisible(false)
		setCurrentDate(date)
	}

	// Helper for date

	const displayDate = (newDate) => {
		try {
			let year = newDate.getFullYear()
			let month = newDate.getMonth()+1
			let day = newDate.getDate()
			return day+'-'+month+'-'+year;
		} catch (ComponentException) {
			return displayDate(date);
		}
	}

	// Change for Date Picker

	const onChange = (event, selectedDate) => {
		if (event.type == 'dissmissed') {
			setShow(false);
  		return
  	}
    setShow(false);
    setCurrentDate(selectedDate);
  };

  // Search functions

  const matchWordToItemList = (word) => {
  	return fuzzyList.get(word.toUpperCase(),0.1,0.1)
  }

  const onChangeSearch = (query) => {
  	if (query.length != 0 && !search) {
  		setSearch(true)
  	} else if (query.length == 0 && search) {
  		setSearch(false)
  	}
  	setSearchQuery(query)
  	let matched = matchWordToItemList(query)
  	if (matched == null) {
  		setSearchList([])
  		return
  	}
  	let tempList = []
  	for (var i=0; i < matched.length; i++) {
  		tempList.push(matched[i][1])
  	}
  	setSearchList(tempList)
  }

  const onQuickChange = (event, selectedDate) => {
  	if (event.type == 'dismissed') {
  		setQuickShow(false);
  		setCurrentDate(date)
  		return
  	}
    setQuickShow(false);
    quickAdd(selectedDate)
    setCurrentDate(date)
  };

  // Quick adding from item list at bottom

  const proccessDate = (date) => {
  	let first = date.indexOf('-')
  	let second = date.indexOf('-',first+1)

  	let day = parseInt(date.substring(0,first))
  	let month = parseInt(date.substring(first+1,second)) - 1
  	let year = parseInt(date.substring(second+1,date.length))
  	let newDate = new Date()
  	newDate.setFullYear(year,month,day)
  	return newDate
  }

  const getDateFromName = (name) => {
		for (var i=0; i < itemList.length; i++) {
			if ((itemList[i].name).toUpperCase() == name) {
				setSearchQuery('');
				setSearch(false);
				return new Date(itemList[i].numDate)
			}
		}
  }

  const quickAdd = async (newDate) => {
		let newdate = displayDate(newDate)
		await addItem(name,newdate).then((response) => setSnackState(response))
		await refreshItems().catch((err) => console.log(err))
		setCurrentDate(date)
		showSnack()
  }

  // Snack functions

  const showSnack = () => {
  	setSnackVisible(true)
  }

  const onDismissSnack = () => {
  	setSnackVisible(false)
  }

  // Main UI

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<IconButton
					icon={require("../../assets/arrow-top-left.png")}
					size={30}
					onPress={() => {navigation.goBack()}}
				/>
				<Text style={styles.headerText}>Add Items</Text>
			</View>
			<View style={styles.top}>
				<Button
					color="#fbffea" 
					style={styles.newButton}
					contentStyle={styles.newButtonStyle}
					mode="contained"
					onPress={(showDialog)}
					adjustsFontSizeToFit={true}
					>
					<Text 
					style={styles.newLabel}
					adjustsFontSizeToFit={true}
					>ADD NEW ITEM</Text>
				</Button>
				
				<Portal>
					<Dialog 
					dismissable={false}
					visible={visible} 
					onDismiss={hideDialog}
					style={styles.popupStyle}>
						<Dialog.Title style={styles.newTitle}>New Item</Dialog.Title>
						<Dialog.Content>
							<TextInput
								theme={{ colors: { primary: 'black',underlineColor:'transparent',}}}
								label="Name"
								style={styles.nameInput}
								mode='flat'
								onChangeText={(value) => {setName(value)}}
							/>
							<View style={styles.dateChanger}>
								<Button
									color="#fbffea"
									labelStyle={styles.dateLabel}  
									style={styles.dateButton}
									contentStyle={styles.dateButtonStyle}
									mode="contained"
									onPress={() => setShow(true)}
									>
									Change Date
								</Button>
								<Text style={styles.dateDisplay}>Date: {displayDate(currentDate)}</Text>
							</View>
							{show && (
				        <DateTimePicker
				          testID="dateTimePicker"
				          value={date}
				          is24Hour={true}
				          display="calendar"
				          onChange={onChange}
				          minimumDate={date}
				        />
				      )}
						</Dialog.Content>
						<Dialog.Actions>
							<Button onPress={cancelDialog}>Cancel</Button>
							<Button 
							onPress={() => hideDialog(currentDate)}
							>
							Done
							</Button>
						</Dialog.Actions>
					</Dialog>
				</Portal>

			</View>
			<View style={styles.bottom}>
				<View style={styles.searchBar}>
					<Searchbar
						placeholder="Search"
						onChangeText={onChangeSearch}
						value={searchQuery}
						inputStyle={styles.searchText}
						style={styles.searchStyle}
					/>
					<View style={{
						backgroundColor: '#ffdead',
					 	width: '11.8%'}}>
						<IconButton
							icon={require("../../assets/reload.png")}
							size={30}
							onPress={() => refreshItems()}
							style={styles.refeshIcon}
						/>
					</View>
				</View>
				<ScrollView style={styles.quickScroll}>
					{!search && ((itemList).map((c, i) => {
						return [
						<Button
							key = {c.name}
							color={colours[i % 2]}
							labelStyle={styles.quickLabel}  
							style={styles.quickButton}
							contentStyle={styles.quickButtonStyle}
							mode="contained"
							onPress={() => {
								console.log(c)
								if (!newItem) {
									setName(c.name)
									setQuickShow(true)
									setCurrentDate(new Date(c.numDate))
								}
							}}
							>
							{c.name}
						</Button>
						]
					}))}
					{search && ((searchList).map((c, i) => {
						return [
						<Button
							color={colours[i % 2]}
							labelStyle={styles.quickLabel}  
							style={styles.quickButton}
							contentStyle={styles.quickButtonStyle}
							mode="contained"
							onPress={() => {
								console.log(newItem)
								if (!newItem) {
									setName(c)
									setQuickShow(true)
									setCurrentDate(getDateFromName(c))
								}
							}}
							>
							{c}
						</Button>
						]
					}))}
				</ScrollView>
				{quickShow && (
	        <DateTimePicker
	          testID="dateTimePicker"
	          value={currentDate}
	          is24Hour={true}
	          display="calendar"
	          onChange={onQuickChange}
	          minimumDate={date}
	        />
	      )}
			</View>
			<Snackbar
				visible={snackVisible}
				onDismiss={onDismissSnack}
				duration={1500}
				action={{
					label: 'Dismiss',
					onPress: () => {
						setSnackVisible(false)
					},
				}}
			> {snackState ? 'New item added' : 'Woops, something went wrong'}
			</Snackbar>
		</View>
	)
}

const styles = StyleSheet.create({
  container: {
  	flexShrink: 1,
    flex: 1,
    backgroundColor: '#97ecb3',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: 'black',
    paddingTop:15,
  },
  header: {
  	height:60,
  	width: '100%',
    backgroundColor: 'white',
    borderBottomWidth: 5,
    borderBottomColor: 'black',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerText: {
  	fontSize: 40,
  },
  top: {
  	flex:0.35,
  	justifyContent: 'center',
  	width: '90%'
  },
  newLabel: {
  	color: 'black',
  	fontSize: 40,
  },
  newButton: {
  	justifyContent: 'center',
		borderWidth :5,
		borderColor: 'black',
		borderRadius: 10,
		height: '45%'
	},
	newButtonStyle: {
  },
  popupStyle: {
  	height: '35%',
  	borderRadius: 20,
  },
  newTitle: {
  	width:'90%',
  	borderBottomColor: 'grey',
  	borderBottomWidth: 2,
  },
  nameInput: {
  	backgroundColor: '#ffdead',
  	alignSelf: 'center',
  	width: '100%',
  	paddingHorizontal: 25,
  	height:60,
  	fontSize: 30,
  	color:"black",
  	borderColor: 'black',
  	borderWidth: 2,
  	marginBottom: 10,
  },
  dateChanger: {
  	flexDirection: 'row',
  	justifyContent: 'space-around',
  },
  dateLabel: {
  	color: 'black',
  	fontSize: 15,
  },
  dateButton: {
  	justifyContent: 'flex-start',
		borderWidth :2,
		borderColor: 'black',
		borderRadius: 10,
		width: '50%'
	},
	dateButtonStyle: {
		height: 40,
  },
  dateDisplay: {
  	marginTop:10,
  	fontSize: 18,
  },
  bottom: {
  	flex:0.65,
  	width: "100%",
  	borderTopColor: 'grey',
  	borderTopWidth: 2,
  },
  searchBar: {
  	width: '100%',
  	flexDirection: 'row',
  	borderBottomColor: 'grey',
  	borderBottomWidth: 2,
  },
  searchText: {
  	fontSize:20,
  },
  searchStyle: {
  	width:'88%',
  },
  refeshIcon: {
  	alignSelf: 'flex-end',
  },
  quickLabel: {
  	fontSize: 25,
  },
  quickButton: {
  	borderBottomWidth: 3,
  	borderBottomColor: 'black',
  },
  quickButtonStyle: {
  	height: 85,
  	alignSelf: 'flex-start',
  	flexDirection: 'row',
  },
});

export default AddScreen;