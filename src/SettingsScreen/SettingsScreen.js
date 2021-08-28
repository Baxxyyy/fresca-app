import React, {useState} from 'react';
import { StatusBar } from 'expo-status-bar';

import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Button, IconButton, TextInput, Dialog, Portal, Snackbar,} from 'react-native-paper';

import removeLocalItem from '../Auth/ManageItems/removeLocalItem';
import getKey from '../Auth/getKey';
import storeItem from '../Auth/storeItem';

import getEmail from '../Auth/Users/getEmail';
import changeEmail from '../Auth/Users/changeEmail';
import changePassword from '../Auth/Users/changePassword'

import SettingBox from './SettingBox';

function SettingsScreen ({navigation}) {

  React.useEffect(() => {
    const refresh = navigation.addListener('focus', () => {
      loadAll()
    });
    return refresh;
  }, [navigation]);

  const [showEmailPopup, setEmailPopup] = useState(false);
  const [showPassPopup, setPassPopup] = useState(false);

  const [currentEmail, setCurrentEmail] = useState(new String());
  const [newEmail, setNewEmail] = useState("");

  const [curPass, setCurPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [conPass, setConPass] = useState("");

  const [emailSnack, setEmailSnack] = useState(false);
  const [emailSnackMsg, setESnackMsg] = useState("Email did not change");
  
  const [passSnack, setPassSnack] = useState(false);
  const [passSnackMsg, setPSnackMsg] = useState("Passwords do not match")

  const loadAll = async () => {
    
    getKey("email")
    .then((email) => setCurrentEmail(email))
    .catch((err) => console.log("An error has occured: ", err))
  }

  const logout = (navigation) => {

    removeLocalItem("token")
    removeLocalItem("username")
    removeLocalItem("storedItems")
    removeLocalItem("email")

    navigation.reset({
      index: 0,
      routes: [{ name: 'LoginScreen' }],
    });
  }

  const changeEmailDialog = async () => {
    setEmailPopup(false)
    await changeEmail(newEmail)
    .then((res) => {
      if (res) {
        setESnackMsg("Email changed")
        setCurrentEmail(newEmail)
        storeItem(newEmail, "email")
        setNewEmail("")
      } else {
        setESnackMsg("Email did not change")
        setNewEmail("")
      }
    })
    .catch((err) => console.log("Errored while changing email as: ", err))
    setEmailSnack(true)
  }

  const changePasswordDialog = async () => {
    if (conPass != newPass) {
      setPSnackMsg("Passwords don't match")
      setPassSnack(true)
    } else {
      setPassPopup(false)
      await changePassword(curPass,newPass)
      .then((res) => {
        if (res) {
          setPSnackMsg("Password changed")
        } else {
          setPSnackMsg("Password not changed")
        }
      })
      .catch((err) => console.log("Errored: ", err))
      setNewPass("")
      setCurPass("")
      setConPass("")
      setPassSnack(true)
    }
  }

  const cancelDialog = () => {
    setEmailPopup(false)
    setPassPopup(false)

    setNewEmail("")
  }

  const dismissSnack = () => {
    setEmailSnack(false)
    setPassSnack(false)
  }

  return (
		<View style={styles.container}>
			<View style={styles.header}>
				<IconButton
					icon={require("../../assets/arrow-top-left.png")}
					size={30}
					onPress={() => {navigation.goBack()}}
				/>
				<Text style={styles.headerText}>Settings</Text>
			</View>
      <View style={styles.content}>
        <View style={styles.settingsBox}>
          <SettingBox text="Logout" function={() => {logout(navigation)}} />
        </View>
        <View style={styles.settingsBox}>
          <SettingBox text="Change Email" function={() => {setEmailPopup(true)}} />
          <SettingBox text="Change Password" function={() => {setPassPopup(true)}} />
        </View>
      </View>

    <Portal>
      <Dialog 
      dismissable={false}
      visible={showEmailPopup} 
      onDismiss={cancelDialog}
      style={styles.popupStyle}>
        <Dialog.Title style={styles.title}>Change Email</Dialog.Title>
        <Dialog.Content>
          <View style={styles.emailContent}>
            <Text style={styles.topText}>Current Email:</Text>
            <Text style={styles.emailText}>   {currentEmail}</Text>
          </View>
          <View>
            <TextInput
              label="New Email"
              value={newEmail}
              onChangeText={(text) => setNewEmail(text)}
              mode="outlined"
              style={styles.emailInputText}
              theme={{ colors: {
                primary: 'grey',
                background: 'white',
                underlineColor:'transparent',
              }}}
            />
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={cancelDialog}>Cancel</Button>
          <Button 
          onPress={changeEmailDialog}
          >
          Done
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>

    <Portal>
      <Dialog 
      dismissable={false}
      visible={showPassPopup} 
      onDismiss={cancelDialog}
      style={styles.popupPassStyle}>
        <Dialog.Title style={styles.title}>Change Password</Dialog.Title>
        <Dialog.Content>
          <View style={styles.passContent}>
            <TextInput
              label="Current Password"
              value={curPass}
              onChangeText={(text) => setCurPass(text)}
              mode="outlined"
              secureTextEntry={true}
              style={styles.emailInputText}
              theme={{ colors: {
                primary: 'grey',
                background: 'white',
                underlineColor:'transparent',
              }}}
            />
             <TextInput
              label="New Password"
              value={newPass}
              onChangeText={(text) => setNewPass(text)}
              mode="outlined"
              secureTextEntry={true}
              style={styles.emailInputText}
              theme={{ colors: {
                primary: 'grey',
                background: 'white',
                underlineColor:'transparent',
              }}}
            />
             <TextInput
              label="Confirm Password"
              value={conPass}
              onChangeText={(text) => setConPass(text)}
              mode="outlined"
              secureTextEntry={true}
              style={styles.emailInputText}
              theme={{ colors: {
                primary: 'grey',
                background: 'white',
                underlineColor:'transparent',
              }}}
            />

          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={cancelDialog}>Cancel</Button>
          <Button 
          onPress={() => changePasswordDialog()}
          >
          Done
          </Button>
        </Dialog.Actions>

      </Dialog>
      <Snackbar
        visible={passSnack}
        onDismiss={dismissSnack}
        duration={1500}
        action={{
          label: 'Dismiss',
          onPress: () => {
            setPassSnack(false)
          },
        }}
      >{passSnackMsg}
      </Snackbar>
    </Portal>

    <Snackbar
      visible={emailSnack}
      onDismiss={dismissSnack}
      duration={1500}
      action={{
        label: 'Dismiss',
        onPress: () => {
          setEmailSnack(false)
        },
      }}
    > {emailSnackMsg}
    </Snackbar>
    

		<StatusBar style="dark" backgroundColor="#fdfdfd" />
		</View>
		
	)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdfdfd',
    alignItems: 'center',
    display: 'flex',
    paddingTop:60,
    borderBottomColor: 'black',
    borderBottomWidth: 5,
  },

  header: {
    height:60,
    width: '100%',
    backgroundColor: '#fdfdfd',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerText: {
  	fontSize: 55,
  	color: 'black',
  },

  content: {
    marginTop: 80,
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  settingsBox: {
    borderColor: '#818181',
    borderWidth: 5,
    borderRadius: 10,
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 20,
    width: '95%',
  },

  popupStyle: {
    height: '35%',
    borderRadius: 20,
  },
  popupPassStyle: {
    height: '43%',
    borderRadius: 20,
  },
  title: {
    fontSize: 30,
  },
  emailContent: {
    marginBottom: 15,
  },
  topText: {
    fontSize: 15,
  },
  emailText: {
    fontSize: 20,
  },
  emailInputText: {
    fontSize: 20
  },
})

export default SettingsScreen;