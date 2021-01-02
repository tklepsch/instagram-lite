import { USER_STATE_CHANGE } from '../constants/index'
import firebase from 'firebase'

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