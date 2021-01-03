import { USER_STATE_CHANGE, USER_POSTS_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE, USERS_POSTS_STATE_CHANGE, USERS_DATA_STATE_CHANGE, CLEAR_DATA } from '../constants/index'
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
          console.log('user does not exist');
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

// Following
export function fetchUserFollowing() {
  return((dispatch) => {
    // make a call to firestore, get dispatch, check for snapshot of data, send data to reducer.
    firebase.firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .onSnapshot((snapshot) => {
        // onSnapshot will be called anytime a user updates.
        let following = snapshot.docs.map(doc => {
          const id = doc.id
          return id
        });
        dispatch({type: USER_FOLLOWING_STATE_CHANGE, following})
        for(let i = 0; i < following.length; i++){
          dispatch(fetchUsersData(following[i]));
        }
      })
  })
}

export function fetchUsersData(uid) {
  return(dispatch, getState) => {
    // Checks to see if the user uid passed, matches the state (users) uid.
    const found = getState().usersState.users.some(el => el.uid === uid);
    // user doesn't exist.
    if(!found) {
      firebase.firestore()
      .collection("users")
      .doc(uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          let user = snapshot.data();
          user.uid = snapshot.id
          dispatch({ type: USERS_DATA_STATE_CHANGE, user })
          dispatch(fetchUsersFollowingPosts(user.uid));
        }
        else {
          console.log('user does not exist')
        }
      })
    }
  }
}

export function fetchUsersFollowingPosts(uid) {
  return((dispatch, getState) => {
    firebase.firestore()
      .collection("posts")
      .doc(uid)
      .collection("userPosts")
      .orderBy("creation", "asc")
      .get()
      .then((snapshot) => {
        const uid = snapshot.query.EP.path.segments[1];
        const user = getState().usersState.users.find(el => el.uid === uid);

        let posts = snapshot.docs.map(doc => {
          const data = doc.data();
          const id = doc.id
          return { id, ...data, user }
        });
        dispatch({type: USERS_POSTS_STATE_CHANGE, posts, uid})
      })
  })
}