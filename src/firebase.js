import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp 
} from "firebase/firestore";

// Official Gerizim Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCzqj_vF5tUwrLd-zjICjdky8UOjidOsmc",
  authDomain: "gerizim-4f86c.firebaseapp.com",
  projectId: "gerizim-4f86c",
  storageBucket: "gerizim-4f86c.firebasestorage.app",
  messagingSenderId: "813593372925",
  appId: "1:813593372925:web:1c04c6d788df4480c93694",
  measurementId: "G-SBN74WC0KF"
};

// Initialize Firebase & Firestore
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Submit Lead to Firestore Collection
export async function submitLead(leadData) {
  try {
    const docRef = await addDoc(collection(db, "leads"), {
      ...leadData,
      status: leadData.status || "New",
      notes: leadData.notes || "",
      createdAt: serverTimestamp(),
      submittedAt: new Date().toISOString()
    });
    console.log("Lead successfully submitted to Firestore with ID:", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error submitting lead to Firestore:", error);
    return { success: false, error };
  }
}

// Real-Time Lead Listener for CRM Dashboard
export function subscribeToLeads(callback) {
  const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const leads = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(leads);
  }, (error) => {
    console.error("Error listening to Firestore leads:", error);
  });
}

// Update Lead Status
export async function updateLeadStatus(leadId, newStatus) {
  try {
    const leadRef = doc(db, "leads", leadId);
    await updateDoc(leadRef, {
      status: newStatus,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating lead status:", error);
    return { success: false, error };
  }
}

// Update Lead Notes
export async function updateLeadNotes(leadId, notes) {
  try {
    const leadRef = doc(db, "leads", leadId);
    await updateDoc(leadRef, {
      notes: notes,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating lead notes:", error);
    return { success: false, error };
  }
}

// Delete Lead
export async function deleteLead(leadId) {
  try {
    const leadRef = doc(db, "leads", leadId);
    await deleteDoc(leadRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting lead:", error);
    return { success: false, error };
  }
}
