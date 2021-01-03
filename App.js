import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { View, Text } from 'react-native'

import * as firebase from 'firebase';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './redux/reducers'
import thunk from 'redux-thunk'
const store = createStore(rootReducer, applyMiddleware(thunk));

// Make these environmental variables before deploying to production.
const firebaseConfig = {
  apiKey: "AIzaSyBKlSNRwX1dvPwzhYctMvcVGSEAguSs-yo",
  authDomain: "instagram-lite-80f63.firebaseapp.com",
  projectId: "instagram-lite-80f63",
  storageBucket: "instagram-lite-80f63.appspot.com",
  messagingSenderId: "922697267727",
  appId: "1:922697267727:web:ced72b51095a1f234f817a"
};

// Make sure firebase isn't already running. Otherwise it will crash.
if(firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LandingScreen from './components/auth/Landing';
import LoginScreen from './components/auth/Login';
import RegisterScreen from './components/auth/Register';
import MainScreen from './components/Main';
import AddScreen from './components/main/Add'
import SaveScreen from './components/main/Save'

const Stack = createStackNavigator()

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    }
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if(!user) {
        this.setState({
          loggedIn: false,
          loaded: true
        })
      }
      else {
        this.setState({
          loggedIn: true,
          loaded: true
        })
      }
    });
  }

  render() {
    const { loggedIn, loaded } = this.state;

    if(!loaded) {
      return(
        <View style={{ flex: 1, justifyContent: 'center', textAlign: 'center' }}>
          <Text>Loading...</Text>
        </View>
      )
    }

    if(!loggedIn) {
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen
              name="Landing"
              component={LandingScreen}
              options={{ headerShown: false }} />
            <Stack.Screen
              name="Register"
              component={RegisterScreen} />
            <Stack.Screen
              name="Login"
              component={LoginScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      )
    }

    return(
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Main">
            <Stack.Screen
              name="Main"
              component={MainScreen} />
            <Stack.Screen name="Add" component={AddScreen} navigation={this.props.navigation} />
            <Stack.Screen name="Save" component={SaveScreen} navigation={this.props.navigation} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>

    )
  }
}

export default App
