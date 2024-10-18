// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import{getFirestore, setDoc, doc} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js"

const firebaseConfig = {
    apiKey: "AIzaSyAkZSsve5q4IkYCCDWe40lZ9cpYALOcTI4",
    authDomain: "login-59a90.firebaseapp.com",
    projectId: "login-59a90",
    storageBucket: "login-59a90.appspot.com",
    messagingSenderId: "309108542716",
    appId: "1:309108542716:web:ed23e12ed4a903bae71b79"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// we call this function with message we want to display and id of where we want it to show
function showMessage(message, divId){
   var messageDiv=document.getElementById(divId);
   messageDiv.style.display="block";
   messageDiv.innerHTML=message;
   messageDiv.style.opacity=1;
   setTimeout(function(){
       messageDiv.style.opacity=0;
   },5000);
}

// when the use clicks signup to submit his info
const signUp=document.getElementById('submitSignUp');
signUp.addEventListener('click', (event)=>{
   event.preventDefault();
   const email=document.getElementById('rEmail').value;
   const password=document.getElementById('rPassword').value;
   const firstName=document.getElementById('fName').value;
   const lastName=document.getElementById('lName').value;

   // initialize auth object with a instance of Firebase
   const auth=getAuth();
   // initialize db with Firestore database object
   const db=getFirestore();

   createUserWithEmailAndPassword(auth, email, password)
   // if user creation is successful the promise returned by createUser.. resolves with a user credential object
   .then((userCredential)=>{
       const user=userCredential.user;
       // to store info in Firestore
       const userData={
           email: email,
           firstName: firstName,
           lastName:lastName
       };
       showMessage('Account Created Successfully', 'signUpMessage');
       const docRef=doc(db, "users", user.uid);
       setDoc(docRef,userData)
       .then(()=>{
        // if the operation is success u will be directed to this
           window.location.href='0-index.html';
       })
       .catch((error)=>{
           console.error("error writing document", error);

       });
   })
   .catch((error)=>{
       const errorCode=error.code;
       if(errorCode=='auth/email-already-in-use'){
           showMessage('Email Address Already Exists !!!', 'signUpMessage');
       }
       else{
           showMessage('unable to create User', 'signUpMessage');
       }
   })
});

// signing form, if user already signed up before
const signIn=document.getElementById('submitSignIn');
signIn.addEventListener('click', (event)=>{
   event.preventDefault();
   const email=document.getElementById('email').value;
   const password=document.getElementById('password').value;
   const auth=getAuth();

   signInWithEmailAndPassword(auth, email, password)
   .then((userCredential)=>{
       showMessage('login is successful', 'signInMessage');
       const user=userCredential.user;
       // if you go to Application console you will see
       localStorage.setItem('loggedInUserId', user.uid);
       window.location.href='0-index.html';
   })
   .catch((error)=>{
       const errorCode=error.code;
       if(errorCode==='auth/invalid-credential'){
           showMessage('Incorrect Email or Password', 'signInMessage');
       }
       else{
           showMessage('Account does not Exist', 'signInMessage');
       }
   })
})