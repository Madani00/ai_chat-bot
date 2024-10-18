import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import  {getFirestore, getDoc, doc} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

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

const auth=getAuth();
const db=getFirestore();
const user=auth.currentUser;

// Function to retrieve and display the user profile picture
function fetchUserProfilePicture(user) {
    // Create a reference to the user's profile picture in Storage
    const profilePicture = user.photoURL;
  
 
    document.getElementById('loggedUserPicture').src = profilePicture;

}

// whenever the auth state changes for current user
onAuthStateChanged(auth, (user) => {
    const loggedInUserId=localStorage.getItem('loggedInUserId');
    if (loggedInUserId){
        const docRef = doc(db, "users", loggedInUserId);
        getDoc(docRef)
        .then((docSnap) => {
            if (docSnap.exists()){
                const userData = docSnap.data();
                document.getElementById('loggedUserFName').innerHTML=userData.firstName;
                // Fetch the user profile picture after confirming document existence
                fetchUserProfilePicture(loggedInUserId);  
            }
            else{
                console.log("id doesn't match the document")
            }
        })
        .catch(() => {
            console.log("Error getting document");
        })
    }
    else{
        console.log("User id not found in local storage");
    }
})

// click button to log out ot user account
const logoutBtn=document.getElementById('logout');
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('loggedInUserid');
    signOut(auth)
    .then(()=>{
        window.location.href='1-loginpage.html';
    })
    .catch(() => {
        console.error('Error cannot sign out?');
    })
})
