// src/utils/firestore.ts
import { auth, db } from "./firebase";
import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    Timestamp
} from 'firebase/firestore';

export interface Todo {
    id?: string;
    pahlawan: string;
    kisah: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

//CRUD
export const firestoreService = {
    getTodoRef() {
        const uid = auth.currentUser?.uid;
        if (!uid) throw new Error('User not authenticated');
        return collection(db, 'users', uid, 'todos');
    },

//CREATE
    async addTodo(todo: Omit<Todo, 'id'>) {
        try {
            const todoRef = this.getTodoRef();
            const docRef = await addDoc(todoRef, {
                ...todo,
                status: false,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now()
            });
            return docRef.id;
        } catch (error) {
            console.error('Error Tambah Todo:', error);
            throw error;
        }
    },

//READ
    async getTodos(): Promise<Todo[]> {
        try {
            const todoRef = this.getTodoRef();
            const q = query(todoRef, orderBy('updatedAt', 'desc'));
            const snapshot = await getDocs(q);
            return snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            } as Todo));
        } catch (error) {
            console.error('Error Get Todos:', error);
            throw error;
        }
    },

//UPDATE
    async updateTodo(id: string, todo: Partial<Todo>) {
        try {
            const todoRef = this.getTodoRef();
            const docRef = doc(todoRef, id);
            await updateDoc(docRef, {
                ...todo,
                updatedAt: Timestamp.now()
            });
        } catch (error) {
            console.error('Error Update Todo:', error);
            throw error;
        }
    },

//DELETE
    async deleteTodo(id: string) {
        try {
            const todoRef = this.getTodoRef();
            const docRef = doc(todoRef, id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error('Error Delete Todo:', error);
            throw error;
        }
    },
}