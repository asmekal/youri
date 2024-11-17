import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    // ... other config
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const createData = async (collectionName, data) => {
    const colRef = collection(db, collectionName);
    await addDoc(colRef, data);
};

// TODO: there must be both targeted read by id and readAll methods.
export const readData = async (collectionName) => {
    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return data;
};

export const updateData = async (collectionName, id, data) => {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, data);
};

export const deleteData = async (collectionName, id) => {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
};
