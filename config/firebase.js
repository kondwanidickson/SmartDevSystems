const { ref, getStorage, getDownloadURL, uploadBytes } = require('firebase/storage');
const { getFirestore, collection, doc, query, where } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');

const firebaseConfig = {
  apiKey: "AIzaSyC9x2ZgzqEI8NrQmGIvyAAvx40Suxg_ggo",
  authDomain: "smartdevsystems.firebaseapp.com",
  projectId: "smartdevsystems",
  storageBucket: "smartdevsystems.appspot.com",
  messagingSenderId: "37261460408",
  appId: "1:37261460408:web:7bae218fb69de60ec1054d"
};
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Database Collections
const firestore = getFirestore(app);

// Create a reference with an initial file path and name
const storage = getStorage(); 
const fileRef = (file) => ref(storage, file + ".png");

const Users = collection(firestore, "users");
const Apis = collection(firestore, "apis");
const Subscriptions = collection(firestore, "subscriptions");
const Payments = collection(firestore, "payments");

const queryRef = (path, prop, value) => query(collection(firestore, path), where(prop, "==", value));
const docRef = (path, id) => doc(firestore, path, id);

module.exports = {
  // doc n query references
  queryRef,
  docRef,
  fileRef,

  // functions
  getDownloadURL,
  uploadBytes,

  //  database collections
  Users,
  Apis,
  Subscriptions,
  Payments,
};