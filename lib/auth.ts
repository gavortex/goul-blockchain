import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    User,
  } from "firebase/auth";
  import { auth, db } from "../firebase/client";
  import { doc, setDoc, getDoc } from "firebase/firestore";
  
  export const clientSignUp = async (email: string, password: string, name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email,
        name,
        createdAt: new Date().toISOString(),
      });
  
      return { success: true, user: userCredential.user };
    } catch (error: any) {
      return { success: false, error: error.code };
    }
  };
  
  export const clientSignIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error: any) {
      return { success: false, error: error.code };
    }
  };
  
  export const clientSignOut = async () => {
    try {
      await firebaseSignOut(auth);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.code };
    }
  };
  
  export const getCurrentUser = (): User | null => {
    return auth.currentUser;
  };
  
  export const isAuthenticated = () => {
    return !!auth.currentUser;
  };