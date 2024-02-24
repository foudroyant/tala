import { createUserWithEmailAndPassword } from 'firebase/auth';
import {auth} from './config'

export default  function createUserByEmail(email : string, password : string){
    
    return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        return user
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        return {
            type : "ERREUR",
            code : error.code,
            msg : error.message
        }
    });
}