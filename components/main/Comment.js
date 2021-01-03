import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, Button, TextInput } from 'react-native'

import firebase from 'firebase'
require('firebase/firestore')

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {fetchUsersData} from '../../redux/actions/index'

function Comment(props) {
  const [comments, setComments] = useState([])
  const [postId, setPostId] = useState("")
  const [text, setText] = useState("")

  useEffect(() => {

    function matchUserToComments(comments){
      // loop though all user comments to attach user to every comment
      for(let i = 0; i < comments.length; i++) {
        // checks to see if a comment already has a user attributed to it.
        if(comments[i].hasOwnProperty('user')){
          // continue the loop.
          continue;
        }

        const user = props.users.find(x => x.uid === comments[i].creator)

        if(user == undefined) {
          // set to false because we dont want to fetch the posts.
          props.fetchUsersData(comments[i].creator, false);
        }
        else {
          // attach user to comment
          comments[i].user = user;
        }
        setComments(comments);
      }
    }

    // Run if postId variable is different than the postId in state.
    if(props.route.params.postId !== postId){
      firebase.firestore()
        .collection('posts')
        .doc(props.route.params.uid)
        .collection('userPosts')
        .doc(props.route.params.postId)
        .collection('comments')
        .get()
        .then((snapshot) => {
          let comments = snapshot.docs.map(doc => {
            const data = doc.data();
            const id = doc.id;
            return {id, ...data};
          })
          matchUserToComments(comments);
        })

      setPostId(props.route.params.postId);
    } else {
      matchUserToComments(comments);
    }
  // useEffect when postId changes or when user props are updated.
  }, [props.route.params.postId, props.user])

  const onCommentSend = () => {
    firebase.firestore()
    .collection('posts')
    .doc(props.route.params.uid)
    .collection('userPosts')
    .doc(props.route.params.postId)
    .collection('comments')
    .add({
      creator: firebase.auth().currentUser.uid,
      text
    })
  }

  return (
    <View>
      <FlatList
        numColumns={1}
        horizontal={false}
        data={comments}
        renderItem={({item}) => (
          <View>
            {item.user !== undefined ? <Text>{item.user.name}</Text> : null}
            <Text>{item.text}</Text>
          </View>
        )}
      />
      <View>
        <TextInput
          placeholder='comment...'
          onChangeText={(text) => setText(text)}
        />
        <Button
          title="Send"
          onPress={() => onCommentSend()}
        />
      </View>
    </View>
  )
}

const mapStateToProps = (store) => ({
  users: store.usersState.users
})

const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUsersData }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Comment);