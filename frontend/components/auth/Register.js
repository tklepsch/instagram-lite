import React, { Component } from 'react'
import { View, Button, TextInput } from 'react-native'

import * as firebase from 'firebase';
import 'firebase/firestore'

export class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      name: ''
    }

    // Needed to access 'this' variable in our custom function.
    this.onSignUp = this.onSignUp.bind(this);
  }

  onSignUp() {
    // creates separate const variables for each matching state.
    const { email, password, name} = this.state;

    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((result) => {
      firebase.firestore().collection("users")
      .doc(firebase.auth().currentUser.uid)
      .set({
        name,
        email
      })
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
          placeholder="name"
          onChangeText={(name) => this.setState({ name: name })}
        />
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
          onPress={() => { this.onSignUp() }}
          title="Sign Up"
        />
      </View>
    )
  }
}

export default Register
