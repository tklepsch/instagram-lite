import React, { useState } from 'react'
import { View, TextInput, Image, Button } from 'react-native'

import firebase from 'firebase'
require("firebase/firestore")
require("firebase/firebase-storage")

export default function Save(props, {navigation}) {
  // not null, because user can upload image without caption
  const [caption, setCaption] = useState("");
  const uploadImage = async() => {
      // note: props.route.params.image is the tmp location of the image.
    const uri = props.route.params.image;
    // Will upload a path with a randomly generated 36 character string.
    const ChildPath = `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`;
    const response = await fetch(uri);
    const blob = await response.blob();
    const task = firebase
      .storage()
      .ref()
      .child(ChildPath)
      .put(blob)
    const taskProgress = snapshot => {
      console.log(`transferred: ${snapshot.bytesTransferred}`)
    }
    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        savePostData(snapshot);
        console.log(snapshot);
      });
    }
    const taskError = snapshot => {
      console.log(snapshot);
    }
    // the full process of uploading a file to firebase.
    task.on("state_changed", taskProgress, taskError, taskCompleted);
  }
  // Saves the caption, user id, and image download url
  const savePostData = (downloadURL) => {
    firebase.firestore()
      .collection('posts')
      .doc(firebase.auth().currentUser.uid)
      .collection("userPosts")
      // Makesure to include servertimestamp, so we know when the post was created.
      .add({
        downloadURL,
        caption,
        likeCount: 0,
        creation: firebase.firestore.FieldValue.serverTimestamp()
      }).then((function() {
        // Returns to the initial route of the app.
        props.navigation.popToTop
      }))
  }
  return (
    <View style={{ flex: 1}}>
      <Image source={{ uri: props.route.params.image}} />
      <TextInput
        placeholder="Write a caption."
        onChangeText={(caption) => setCaption(caption)}
      />
      <Button title="Save Image" onPress={() => uploadImage()} />
    </View>
  )
}
