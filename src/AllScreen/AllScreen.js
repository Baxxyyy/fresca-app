import { StatusBar } from 'expo-status-bar';

import React, {useState} from 'react';
import FuzzySet from 'fuzzyset'

import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Button, IconButton, TextInput, Dialog, Portal, Snackbar, Searchbar } from 'react-native-paper';

import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

import addItem from '../AddScreen/addItem';

import removeFromDateList from '../Auth/DateManage/removeFromDateList';
import findDatePlace from '../Auth/DateManage/findDatePlace';
import removeLocalFood from '../Auth/ManageItems/removeLocalFood';


import getKey from '../Auth/getKey';


function AllScreen ({ navigation }) {

  React.useEffect(() => {
    const refresh = navigation.addListener('focus', () => {
      createMainLists();
    });
    return refresh;
  }, [navigation]);

  const [fetched, setFetched] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date()); 

  const [itemList, setItemList] = useState(new Array());

  const [fuzzyList, setFuzzyList] = useState(new FuzzySet());
  const [searchList, setSearchList] = useState(new Array());

  const [monthList, setMonthList] = useState(new Array());
  const [yearList, setYearList] = useState(new Array());
  const [foreverList, setForeverList] = useState(new Array());

  const dayLength = 86400000;

  let colourCount = -1;
  let colours = ['#fbffea','#f7ffad'];

  const [searchQuery, setSearchQuery] = React.useState('');

  const [displayMain, setMainDisplay] = useState(true);
  const [displaySearch, setSearchDisplay] = useState(false);

  const [deleteVisible, setDeleteVisible] = useState(false);
  const [deleteItem, setDeleteItem] = useState(new Array());

  const [editVisible, setEditVisible] = useState(false);
  const [editDate, setEditDate] = useState(new Date());
  const [editName, setEditName] = useState('');
  const [editItem, setEditItem] = useState(new Array());
  const [show, setShow] = useState(false);

  const [snackVisible, setSnackVisible] = useState(false);
  const [snackState, setSnackState] = useState(false);

  const normaliseDate = (date) => {
    date.setHours(0,0,0,0)
    date.setDate(date.getDate())
    return date
  }

  const removeExpired = async (item) => {
    let res = await removeLocalFood(item)
    return res
  }

  const removeUpdate = async (itemList, display) => {
    let result;
    for (var i=0; i < itemList.length; i++) {
      result = await removeExpired(itemList[i])
      if (!result) {
        break
      }
    }
    if (display) {
      setSnackState(result)
      setSnackVisible(true)
    }
  }

  const proccessDate = (date) => {
    console.log(date, "date")
    let first = date.indexOf('-')
    let second = date.indexOf('-',first+1)

    let day = parseInt(date.substring(0,first))
    let month = parseInt(date.substring(first+1,second)) - 1
    let year = parseInt(date.substring(second+1,date.length))
    let newDate = new Date()
    newDate.setFullYear(year,month,day)
    newDate = normaliseDate(newDate)
    return newDate
  }

  const checkForMonth = (date, checkDate) => {
    if ((+date >= +checkDate) &&
       ((date - 30*dayLength) < checkDate))
    {
      return true
    } else {
      return false
    }
  }

  const checkForYear = (date, checkDate) => {
    if ((date > checkDate) && 
       ((date - 365*dayLength) < checkDate))
    {
      return true
    } else {
      return false
    }
  }

  const sortListByDate = (newList) => {
    newList.sort((a, b) => {
      return new Date(a.numDate) - new Date(b.numDate);
    })
    return newList; 
  }

  const createMainLists = async () => {
    let newRemoveList = [];
    let newMonthList = [];
    let newYearList = [];
    let newForeverList = [];

    let today = normaliseDate(new Date())
    let monthDate = normaliseDate(new Date()).setMonth(today.getMonth()+1)
    let yearDate = normaliseDate(new Date()).setFullYear(today.getFullYear() +1)

    let removeIndex = await findDatePlace(today)
    let monthIndex = await findDatePlace(monthDate)
    let yearIndex = await findDatePlace(yearDate)

    let date;
    let currentDate = normaliseDate(new Date())

    await getKey("DateItems")
    .then((response) => JSON.parse(response))
    .then((parsed_value) => {
      if (parsed_value == []) {
        setMonthList([])
        setYearList([])
        setForeverList([])
        setItemList([])
        setFuzzyList(FuzzySet([],true,1))
        setFetched(true)
        return
      }

      newRemoveList = parsed_value.slice(0,removeIndex)
      newMonthList = parsed_value.slice(removeIndex,monthIndex)
      newYearList = parsed_value.slice(monthIndex,yearIndex)
      newForeverList = parsed_value.slice(yearIndex,parsed_value.length)
      
      let newList = newMonthList.concat(newYearList,newForeverList)
      
      let temp = FuzzySet([],true,1)
      for (var i=0; i < newList.length; i++) {
        temp.add((newList[i].name.toUpperCase()))
      }
      setFuzzyList(temp)
      setItemList(newList)
    })
    .catch((err) => console.log(err))

    removeUpdate(newRemoveList,false)

    setMonthList(newMonthList)
    setYearList(newYearList)
    setForeverList(newForeverList)
  }

  // ------ Search Code -----

  const matchWordToItemList = (word) => {
    return fuzzyList.get(word.toUpperCase(),0.1,0.1)
  }

  const onChangeSearch = (query) => {
    if (query.length != 0 && !displaySearch) {
      setMainDisplay(false)
      setSearchDisplay(true)
    } else if (query.length == 0 && displaySearch) {
      setMainDisplay(true)
      setSearchDisplay(false)
    }
    console.log(matchWordToItemList(query), "matched")
    setSearchQuery(query)
    let matched = matchWordToItemList(query)
    if (matched == null) {
      setSearchList([])
      return
    }
    let tempList = []
    for (var i=0; i < Math.min(matched.length,10); i++) {
      var newTempList = []
      for (var x=0; x < itemList.length; x++) {
        if (matched[i][1] == (itemList[x].name).toUpperCase()) {
          newTempList.push(itemList[x])
        }
      }
      tempList = tempList.concat(sortListByDate(newTempList))
    }
    setSearchList(tempList)
  }


  // ----- delete dialog code -----

  const hideDelDialog = async () => {
    setDeleteVisible(false)
    let result;
    await removeUpdate([deleteItem],true).then((res) => result = res)
    setSnackState(result)
    setSnackVisible(true)
  }

  const showDelDialog = (item) => {
    setDeleteItem(item);
    setDeleteVisible(true);
  } 

  const cancelDelDialog = () => {
    setDeleteVisible(false)
  }

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

  // ----- edit dialog code -----

  const hideEditDialog = async () => {
    setEditVisible(false);
    let result = false;
    console.log(editName,editDate, "edit details")
    await addItem(editName,editDate)
    .then((res) => result = res)
    .catch((err) => console.log(err, "error"))
    if (result != true) {
      setSnackState(false)
      setSnackVisible(true)
      return
    }
    await removeExpired(editItem)
    .then((res) => console.log(res, "result"))
    .then(() => console.log(monthList, "Month list at end"))
    .catch((err) => console.log(err, "error"))
  }

  const showEditDialog = (item) => {
    setEditItem(item);
    setEditDate(item.date)
    setEditName(item.name);
    setEditVisible(true);
  }

  const cancelEditDialog = () => {
    setEditVisible(false)
  }

  // ----- Date checker code ------

  const onChange = (event, selectedDate) => {
    if (event.type == 'dissmissed') {
      setShow(false);
      return
    }
    setShow(false);
    setEditDate(displayDate(selectedDate));
  };

  // Snack code

  const onDismissSnack = () => {
    setSnackVisible(false)
  }

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<IconButton
					icon={require("../../assets/arrow-top-left.png")}
					size={30}
					onPress={() => {navigation.goBack()}}
				/>
				<Text style={styles.headerText}> All Items</Text>
			</View>
      <View style={styles.searchBar}>
        <Searchbar
          placeholder="Search"
          onChangeText={onChangeSearch}
          value={searchQuery}
          inputStyle={styles.searchText}
          style={styles.searchStyle}
        />
      </View>
    {displayMain && (
    <ScrollView style={styles.mainDisplay}>
    {/*List of items that will expire within 1 month*/}
    {monthList.length != 0 && (
      <View style={styles.rowContainer}>
        <View style={styles.monthHeader}>
          <Text style={styles.monthText}>This Month</Text>
        </View>
        {monthList.map((c, i) => {
          colourCount = (colourCount + 1) % 2;
          return [
            <View key={i} style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-around',
              alignItems: 'center',
              backgroundColor: colours[colourCount],
              borderBottomWidth: 2,
              borderBottomColor: 'black',
            }}>
              <Text style={styles.Label}>{c.name} </Text>
              <Text style={styles.Date}>{c.date} </Text>
              <View style={styles.iconBox}>
                <IconButton
                  icon={require("../../assets/pencil.png")}
                  size={30}
                  onPress={() => showEditDialog(c)}
                  style={styles.pencil}
                />
                <IconButton
                  icon={require("../../assets/cross.png")}
                  size={30}
                  onPress={() => showDelDialog(c)}
                  style={styles.cross}
                />
              </View>
            </View>
          ]
        })}
      </View>
    )}
    {/*List of items that will expire within 1 year but not 1 month*/}
    {yearList.length != 0 && (
      <View style={styles.rowContainer}>
        <View style={styles.monthHeader}>
          <Text style={styles.monthText}>This Year</Text>
        </View>
        {yearList.map((c, i) => {
          colourCount = (colourCount + 1) % 2;
          return [
            <View key={i} style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-around',
              alignItems: 'center',
              backgroundColor: colours[colourCount],
              borderBottomWidth: 2,
              borderBottomColor: 'black',
            }}>
              <Text style={styles.Label}>{c.name} </Text>
              <Text style={styles.Date}>{c.date} </Text>
              <View style={styles.iconBox}>
                <IconButton
                  icon={require("../../assets/pencil.png")}
                  size={30}
                  onPress={() => showEditDialog(c)}
                  style={styles.pencil}
                />
                <IconButton
                  icon={require("../../assets/cross.png")}
                  size={30}
                  onPress={() => showDelDialog(c)}
                  style={styles.cross}
                />
              </View>
            </View>
          ]
        })}
      </View>
    )}
    {/*Anything that is past 1 year goes here if it exists*/}
    {foreverList.length != 0 && (
      <View style={styles.rowContainer}>
        <View style={styles.monthHeader}>
          <Text style={styles.monthText}>Coming up</Text>
        </View>
        {foreverList.map((c, i) => {
          colourCount = (colourCount + 1) % 2;
          return [
            <View key={i} style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-around',
              alignItems: 'center',
              backgroundColor: colours[colourCount],
              borderBottomWidth: 2,
              borderBottomColor: 'black',
            }}>
              <Text style={styles.Label}>{c.name} </Text>
              <Text style={styles.Date}>{c.date} </Text>
              <View style={styles.iconBox}>
                <IconButton
                  icon={require("../../assets/pencil.png")}
                  size={30}
                  onPress={() => showEditDialog(c)}
                  style={styles.pencil}
                />
                <IconButton
                  icon={require("../../assets/cross.png")}
                  size={30}
                  onPress={() => showDelDialog(c)}
                  style={styles.cross}
                />
              </View>
            </View>
          ]
        })}
      </View>
    )}
    </ScrollView>
    )}
    { displaySearch && (
    <ScrollView style={styles.searchDisplay}>
      {searchList.map((c, i) => {
          colourCount = (colourCount + 1) % 2;
          return [
            <View key={i} style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-around',
              alignItems: 'center',
              backgroundColor: colours[colourCount],
              borderBottomWidth: 2,
              borderBottomColor: 'black',
            }}>
              <Text style={styles.Label}>{c.name} </Text>
              <Text style={styles.Date}>{c.date} </Text>
              <View style={styles.iconBox}>
                <IconButton
                  icon={require("../../assets/pencil.png")}
                  size={30}
                  onPress={() => showEditDialog(c)}
                  style={styles.pencil}
                />
                <IconButton
                  icon={require("../../assets/cross.png")}
                  size={30}
                  onPress={() => showDelDialog(c)}
                  style={styles.cross}
                />
              </View>
            </View>
          ]
        })}
    </ScrollView>
    )}

    <Portal>
      <Dialog 
      dismissable={false}
      visible={editVisible} 
      onDismiss={hideEditDialog}
      style={styles.popupEditStyle}>
        <Dialog.Title style={styles.newTitle}>New Item</Dialog.Title>
        <Dialog.Content>
          <TextInput
            theme={{ colors: { primary: 'black',underlineColor:'transparent',}}}
            label="Name"
            value={editName}
            style={styles.nameInput}
            mode='flat'
            onChangeText={(value) => {setEditName(value)}}
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
            <Text style={styles.dateDisplay}>Date: {editDate}</Text>
          </View>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={proccessDate(editDate)}
              is24Hour={true}
              display="calendar"
              onChange={onChange}
              minimumDate={currentDate}
            />
          )}
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={cancelEditDialog}>Cancel</Button>
          <Button 
          onPress={() => hideEditDialog(currentDate)}
          >
          Done
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>

    <Portal>
      <Dialog 
      dismissable={false}
      visible={deleteVisible} 
      onDismiss={hideDelDialog}
      style={styles.popupDelStyle}>
        <Dialog.Title style={styles.newTitle}>Confirm</Dialog.Title>
        <Dialog.Content>
          <Text style={styles.confirm}>Are you sure you want to remove this item?</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={cancelDelDialog}>Cancel</Button>
          <Button onPress={() => hideDelDialog()}>
            Confirm
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>

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
    > {snackState ? 'Item removed' : 'Woops, something went wrong'}
    </Snackbar>
		</View>
	)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#97ecb3',
    alignItems: 'center',
    display: 'flex',
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
    width:'100%',
  },
  mainDisplay: {
    flex: 1,
    width: '100%',
  },
  searchDisplay: {
    flex: 1,
    width: '100%',
  },
  rowContainer: {

  },
  monthHeader: {
    width: '100%',
    backgroundColor: '#97d0ec', // or #97a6ec
    borderBottomColor: 'grey',
    borderBottomWidth: 2,
  },
  monthText: {
    fontSize: 40,
  },
  Label: {
    flex:0.5,
    fontSize: 20,
  },
  Date: {
    flex:0.4,
    fontSize: 20,
  },
  iconBox: {
    flexDirection: 'row',
  },
  popupDelStyle: {
    height: '23%',
    borderRadius: 20,
  },
  popupEditStyle: {
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
})

export default AllScreen;