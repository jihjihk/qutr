import * as types from './actionTypes';
import firebaseService from '../../services/firebase';

export const restoreSession = () => {
  return (dispatch) => {
    dispatch(sessionRestoring());

    let unsubscribe = firebaseService.auth()
      .onAuthStateChanged(user => {
        if (user) {
          dispatch(sessionSuccess(user));
          unsubscribe();
        } else {
          dispatch(sessionLogout());
          unsubscribe();
        }
      });
  };
};

export const loginUser = (email, password) => {
  return (dispatch) => {
    dispatch(sessionLoading());

    firebaseService.auth()
      .signInWithEmailAndPassword(email, password)
      .catch(error => {
        dispatch(sessionError(error.message));
      });

    let unsubscribe = firebaseService.auth()
      .onAuthStateChanged(user => {
        if (user) {
          dispatch(sessionSuccess(user));
          unsubscribe();
        }
      });
  };
};

export const signupUser = (email, password) => {
  return (dispatch) => {
    dispatch(sessionLoading());

    firebaseService.auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        let user = firebaseService.auth().currentUser;

        if (user) {
          console.log("Successfully get current user!");
        } else {
          console.log("Oops...failed to get current user");
        }

        let uid = user.uid;

        firebaseService.database()
          .ref(`users/${uid}`)
          .set({
            email,
            uid,
            language: 'Language',
            gender: 'Gender',
            age: 18,
            profile_photo: 'URL',
            conversations: []
          });
      })
      .catch(error => {
        dispatch(sessionError(error.message));;
      });

    let unsubscribe = firebaseService.auth()
      .onAuthStateChanged(user => {
        if (user) {
          dispatch(sessionSuccess(user));
          unsubscribe();
        }
      });
  };
};

export const logoutUser = () => {
  return (dispatch) => {
    dispatch(sessionLoading());

    firebaseService.auth()
      .signOut()
      .then(() => {
        dispatch(sessionLogout());
      })
      .catch(error => {
        dispatch(sessionError(error.message));
      });
  };
};

const sessionRestoring = () => ({
  type: types.SESSION_RESTORING
});

const sessionLoading = () => ({
  type: types.SESSION_LOADING
});

const sessionSuccess = user => ({
  type: types.SESSION_SUCCESS,
  user
});

const sessionError = error => ({
  type: types.SESSION_ERROR,
  error
});

const sessionLogout = () => ({
  type: types.SESSION_LOGOUT
});
