import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage"

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

firebase.initializeApp(firebaseConfig);

export const db = firebase.database();
export const users = db.ref("users");
export const videos = db.ref("videos");
