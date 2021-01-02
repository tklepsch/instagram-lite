import React from 'react'
import { StyleSheet, View, Text, Image, FlatList, Button } from 'react-native'

import firebase from 'firebase'
require('firebase/firestore')
import { connect } from 'react-redux';

function Profile(props) {
  const { currentUser, posts } = props;
  console.log({currentUser})

  const onLogout = () => {
    firebase.auth().signOut();
  }

  return (
    <View styles={styles.container}>
      <View styles={styles.containerInfo}>
        <Text>User: {currentUser.name}</Text>
        <Text>Email: {currentUser.email}</Text>
        <Button title="Logout" onPress={() => onLogout()}
        />
      </View>
      <View styles={styles.containerInfo}>
        <FlatList
          numColumns={3}
          horizontal={false}
          data={posts}
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
    flex: 1,
    marginTop: 40
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
  posts: store.userState.posts
})

export default connect(mapStateToProps, null)(Profile)