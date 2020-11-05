import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyDh94YdF2ZoVz43uNAjtDnKv8i5yTAFQWI",
  authDomain: "child-video.firebaseapp.com",
  databaseURL: "https://child-video.firebaseio.com",
  projectId: "child-video",
  storageBucket: "child-video.appspot.com",
  messagingSenderId: "988158307952",
  appId: "1:988158307952:web:98d701add5266493f44eb5",
  measurementId: "G-456283PJRR"
};

firebase.initializeApp(firebaseConfig);

export const db = firebase.database();
export const users = db.ref("users");
export const videos = db.ref("videos");
