import { StatusBar } from 'expo-status-bar';

import React, {useRef, useState, useEffect} from 'react';
import FuzzySet from 'fuzzyset'

import { StyleSheet, Text, View, ScrollView, AppState, FlatList } from 'react-native';
import { Button, IconButton, TextInput, Dialog, Portal, Snackbar,
         Searchbar, ActivityIndicator, Colors } from 'react-native-paper';

import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

import addItem from '../AddScreen/addItem';

import removeFromDateList from '../Auth/DateManage/removeFromDateList';
import findDatePlace from '../Auth/DateManage/findDatePlace';

import removeLocalFood from '../Auth/ManageItems/removeLocalFood';
import syncItems from '../Auth/ManageItems/syncItems';

import getKey from '../Auth/getKey';

let colours = ['#fbffea','#f7ffad'];


const MonthHeader = ({ name }) => (
  <View style={styles.monthHeader}>
    <Text style={styles.monthText}>{name}</Text>
  </View>
);

const RowItem = ({item, index}) => (
  <View style={{
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colours[index % 2],
    borderBottomWidth: 2,
    borderBottomColor: 'black',
  }}>
    <Text style={styles.Label}>{item.name} </Text>
    <Text style={styles.Date}>{item.date} </Text>
    <View style={styles.iconBox}>
      <IconButton
        icon={require("../../assets/pencil.png")}
        size={30}
        onPress={() => showEditDialog(item)}
        style={styles.pencil}
      />
      <IconButton
        icon={require("../../assets/cross.png")}
        size={30}
        onPress={() => showDelDialog(item)}
        style={styles.cross}
      />
    </View>
  </View>
)



function AllScreen ({ navigation }) {

  useEffect(() => {
    const refresh = navigation.addListener('focus', () => {
      syncItems();
      createMainLists();
    });
    return refresh;
  }, [navigation]);

  const appState = useRef(AppState.currentState);
  useEffect(() => {
    const subscription = AppState.addEventListener("change", nextAppState => {
      if (appState.current.match(/inactive|background/)) {
        syncItems()
      }
    });
    
    try {
      subscription.remove()
    } catch (err) {}
  }, []);

  const [fetching, setFetching] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date()); 

  const [itemList, setItemList] = useState(new Array());

  const [fuzzyList, setFuzzyList] = useState(new FuzzySet());
  const [searchList, setSearchList] = useState(new Array());

  // const [monthList, setMonthList] = useState(new Array());
  // const [yearList, setYearList] = useState(new Array());
  // const [foreverList, setForeverList] = useState(new Array());

  const [formatedList, setFormatedList] = useState(new Array());

  const dayLength = 86400000;


  let count = 0

  const [searchQuery, setSearchQuery] = React.useState('');

  const [loading, setLoading] = useState(true);
  const [displayMain, setMainDisplay] = useState(false);
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

  const removeUpdate = async (itemList, display, refresh) => {
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
    if (refresh) {
      createMainLists() 
    }
    return result
  }

  const proccessDate = (date) => {
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

  const sortListByDate = (newList) => {
    newList.sort((a, b) => {
      return new Date(a.numDate) - new Date(b.numDate);
    })
    return newList; 
  }

  const createMainLists = async () => {
    count = 0
    setFetching(true)

    let newRemoveList = [];
    let formatList = [];

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
        setItemList([])
        setFuzzyList(FuzzySet([],true,1))
        return
      }
      
      let temp = FuzzySet([],true,1)
      for (var i=removeIndex; i < parsed_value.length; i++) {
        temp.add((parsed_value[i].name.toUpperCase()))
      }

      let amend = 0

      if (parsed_value.length != 0) {
        parsed_value.splice(removeIndex,0,{name:"This Month",date:"25-25-2525"})
        amend += 1
      } 
      if (monthIndex + amend < parsed_value.length) {
        parsed_value.splice(monthIndex+1,0,{name:"This Year",date:"25-25-2525"})
        amend += 1
      } 
      if (yearIndex + amend < parsed_value.length) {
        parsed_value.splice(yearIndex+2,0,{name:"Coming up",date:"25-25-2525"})
      }

      newRemoveList = parsed_value.splice(0,removeIndex)

      formatList = parsed_value

      setFuzzyList(temp)
      setItemList(formatList)
    })
    .catch((err) => console.log(err))

    if (newRemoveList.length != 0) {
      removeUpdate(newRemoveList,false, false)
    } 

    setFormatedList(formatList)

    setLoading(false)
    setMainDisplay(true)
    setFetching(false)

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

  // ----- FlatList render code ----

  const renderItem = ({ item, index }) => {

    if (item.date == "25-25-2525") {
      return (
      <View style={styles.monthHeader}>
        <Text style={styles.monthText}>{item.name}</Text>
      </View>
      )
    } else {
    return (
      <View style={{
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: colours[index % 2],
        borderBottomWidth: 2,
        borderBottomColor: 'black',
      }}>
        <Text style={styles.Label}>{item.name} </Text>
        <Text style={styles.Date}>{item.date} </Text>
        <View style={styles.iconBox}>
          <IconButton
            icon={require("../../assets/pencil.png")}
            size={30}
            onPress={() => showEditDialog(item)}
            style={styles.pencil}
          />
          <IconButton
            icon={require("../../assets/cross.png")}
            size={30}
            onPress={() => showDelDialog(item)}
            style={styles.cross}
          />
        </View>
      </View>
    )}
  }

  const getItemKey = () => {
    count += 1
    return "" + count
  }


  // ----- delete dialog code -----

  const hideDelDialog = async () => {
    setDeleteVisible(false)
    let result;
    console.log(deleteItem)
    await removeUpdate([deleteItem],true,true).then((res) => result = res)
    console.log()
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
    await addItem(editName,editDate)
    .then((res) => result = res)
    .catch((err) => console.log(err, "error"))
    if (result != true) {
      setSnackState(false)
      setSnackVisible(true)
      return
    }
    await removeUpdate([editItem],false,true)
    .then((res) => console.log(res, "result"))
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
    {loading && (
      <View style={{marginTop: '50%'}}>
       <ActivityIndicator animating={loading} color={"black"} size = {200}/>
      </View>
    )}
    {displayMain && (
    <View style={styles.mainDisplay}>
      <View style={styles.rowContainer}>
        <FlatList
          data={formatedList}
          renderItem={renderItem}
          extraData={fetching}
          keyExtractor={getItemKey}
        />
      </View>
    </View>
    )}
    {displaySearch && (
    <View style={styles.mainDisplay}>
      <View style={styles.rowContainer}>
        <FlatList
          data={searchList}
          renderItem={renderItem}
          extraData={fetching}
          keyExtractor={getItemKey}
        />
      </View>
    </View>
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
    height: '100%',
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