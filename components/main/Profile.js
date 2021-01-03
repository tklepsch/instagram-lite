import React, {useState, useEffect} from 'react'
import { StyleSheet, View, Text, Image, FlatList, Button } from 'react-native'

import firebase from 'firebase'
require('firebase/firestore')
import { connect } from 'react-redux';

function Profile(props) {
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [following, setFollowing] = useState(false);

  useEffect(() => {

    const { currentUser, posts } = props;

    if(props.route.params.uid === firebase.auth().currentUser.uid) {
      setUser(currentUser)
      setUserPosts(posts)
    }

    else {
      // pass uid of the searched user to our firebase fetch user.
      firebase.firestore()
      .collection("users")
      .doc(props.route.params.uid)
      .get()
      .then((snapshot) => {
        if(snapshot.exists) {
          // set user data to returned firebase data.
          setUser(snapshot.data());
        }
        else {
          console.log('user does not exist');
        }
      })

      firebase.firestore()
      .collection("posts")
      .doc(props.route.params.uid)
      .collection("userPosts")
      .orderBy("creation", "asc")
      .get()
      .then((snapshot) => {
        let posts = snapshot.docs.map(doc => {
          const data = doc.data();
          const id = doc.id
          return { id, ...data }
        });
        // set user data to returned firebase data.
        setUserPosts(posts);
      })
    }

    // Check redux to see if there is a following.
    if(props.following.indexOf(props.route.params.uid) > -1) {
      setFollowing(true)
    }
    else {
      setFollowing(false)
    }

  // place array here so function will only run when, the variable inside updates.
  }, [props.route.params.uid, props.following])


  // Users Followed.

  // Following a user
  const onFollow = () => {
    firebase.firestore()
    .collection('following')
    .doc(firebase.auth().currentUser.uid)
    .collection('userFollowing')
    .doc(props.route.params.uid)
    .set({})
  }

  // unFollowing a user
  const onUnfollow = () => {
    firebase.firestore()
    .collection('following')
    .doc(firebase.auth().currentUser.uid)
    .collection('userFollowing')
    .doc(props.route.params.uid)
    .delete()
  }

  if(user === null) {
    return <View/>
  }

  const onLogout = () => {
    firebase.auth().signOut();
  }

  return (
    <View styles={styles.container}>
      <View styles={styles.containerInfo}>
        <Text>User: {user.name}</Text>
        <Text>Email: {user.email}</Text>
        {/* Is current user? */}
        {props.route.params.uid !== firebase.auth().currentUser.uid ? (
          <View>
            {/* is following? */}
            {following ? (
              <Button
                title="Following"
                onPress={() => onUnfollow()}
              />
            ) :
              <Button
              title="Follow"
              onPress={() => onFollow()}
              />
            }
          </View>
        ): null}
        <Button title="Logout" onPress={() => onLogout()}
        />
      </View>
      <View styles={styles.containerInfo}>
        <FlatList
          numColumns={3}
          horizontal={false}
          data={userPosts}
          renderItem={({item}) => (
            <View style={styles.containerImage}>
              <Image
                source={{uri: item.downloadURL}}
                style={styles.image}
              />
            </View>
          )}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  containerInfo: {
    margin: 20
  },
  containerGallery: {
    flex: 1
  },
  containerImage: {
    flex: 1/3
  },
  image: {
    flex: 1,
    aspectRatio: 1/1
  }
})

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts,
  following: store.userState.following
})

export default connect(mapStateToProps, null)(Profile)