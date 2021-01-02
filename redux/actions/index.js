import { USER_STATE_CHANGE, USER_POSTS_STATE_CHANGE, CLEAR_DATA } from '../constants/index'
import firebase from 'firebase'

// clear user info when logged out.
export function clearData() {
  return ((dispatch) => {
    dispatch({ type: CLEAR_DATA })
  })
}

export function fetchUser() {
  return((dispatch) => {
    // make a call to firestore, get dispatch, check for snapshot of data, send data to reducer.
    firebase.firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        if(snapshot.exists) {
          // Send to reducer any user state changes
          dispatch({type: USER_STATE_CHANGE, currentUser: snapshot.data()})
        }
        else {
          console.log('snapshot does not exist');
        }
      })
  })
}

export function fetchUserPosts() {
  return((dispatch) => {
    // make a call to firestore, get dispatch, check for snapshot of data, send data to reducer.
    firebase.firestore()
      .collection("posts")
      .doc(firebase.auth().currentUser.uid)
      .collection("userPosts")
      .orderBy("creation", "asc")
      .get()
      .then((snapshot) => {
        let posts = snapshot.docs.map(doc => {
          const data = doc.data();
          const id = doc.id
          return { id, ...data }
        });
        dispatch({type: USER_POSTS_STATE_CHANGE, posts})
      })
  })
}