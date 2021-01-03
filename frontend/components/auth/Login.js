import React, { Component } from 'react'
import { View, Button, TextInput } from 'react-native'

import firebase from 'firebase';

export class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
    }

    // Needed to access 'this' variable in our custom function.
    this.onLogin = this.onLogin.bind(this);
  }

  onLogin() {
    // creates separate const variables for each matching state.
    const { email, password } = this.state;

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((result) => {
      console.log(result)
    })
    .catch((error) => {
      console.log(error)
    });
  }

  render() {
    return (
      <View>
        <TextInput
          placeholder="email"
          onChangeText={(email) => this.setState({ email: email })}
        />
        <TextInput
          placeholder="password"
          secureTextEntry={true}
          onChangeText={(password) => this.setState({ password: password })}
        />
        <Button
          onPress={() => { this.onLogin() }}
          title="Sign In"
        />
      </View>
    )
  }
}

export default Login
