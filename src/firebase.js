//import firebase module
import firebase from 'firebase/app';

//import database info from firebase module
import 'firebase/database';

//firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAkWNacXMqSVw0lNcvJCBgNWR3H0mQdc50",
    authDomain: "perfection-game.firebaseapp.com",
    projectId: "perfection-game",
    storageBucket: "perfection-game.appspot.com",
    messagingSenderId: "905566257372",
    appId: "1:905566257372:web:7500c5b588e3ccb60c7419",
    measurementId: "G-LEXJBQTD02"
};

//initialize firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();

//export initialized configured firebase app
export default firebase;