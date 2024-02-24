'use server'

import { redirect } from "next/navigation"
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../functions/config";
//import createUserByEmail from "../functions/firebase"

export async function signUp(
    email : string,
    password : string,
    firstname : string,
    lastname : string,
    allowExtraEmails : string
){
    
    if(password.trim().length<7 && email.trim().length==0){
       return null
    }
    /*const user = await createUserByEmail(email, password)
    return {
        type : "SUCCESS",
        user
    }*/
    return {email, password, firstname, lastname, allowExtraEmails}
}

export async function inscrire(data : any){
    console.log(data)
    createUserWithEmailAndPassword(auth, data.get("email"), data.get("password"))
    .then((userCredential) => {
        // Signed up 
        //const user = userCredential.user;
        // ...
        console.log(userCredential)
        redirect("/home")
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode)
        return {
            code : errorCode,
            msg : errorMessage
        }
    });
}

export async function login(data : any){
    console.log(data.get("email"))
    signInWithEmailAndPassword(auth, data.get("email"), data.get("password"))
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        return {
            type : "success",
            user :  user
        }
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage)
    });
}

export async function getText(data : any){
    const file = data.get("file")
    console.log(file)

    // Obtenez la taille de l'image
    const imageSizeInBytes = file.size;
    const imageSizeInKb = imageSizeInBytes / 1024;
    const imageSizeInMb = imageSizeInKb / 1024;

    if(imageSizeInMb>2){
        return {
            value : false,
            msg : "La taille du fichier ne correspond pas à votre formule, veuillez telecharger un fichier de taille inférieure."
        }
    }
    return {
        value : true,
    }
    //redirect("/lecture/unlien")
}

export async function logout() {
    signOut(auth).then(() => {
        // Sign-out successful.
        redirect("/")
      }).catch((error) => {
        // An error happened.
      });
}

export async function goToHome() {
    redirect("/home")
}

export async function goTSignin() {
    console.log("GO TO SIGNIN")
    redirect("/")
}

export async function check_login() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
          //const uid = user.uid;
          // ...
          console.log("User connecté!")
          redirect("/home")
        } else {
          // User is signed out
          // ...
          console.log("Pas connecté!")
        }
      });
}