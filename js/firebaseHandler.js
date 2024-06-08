import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getDatabase, ref, set, push, child, get, onValue, off, remove } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js"

/**
* Class to handle Firebase real-time database interactions.
*/

export class FirebaseHandler {
    /**
    * Initializes a new instance of the FirebaseHandler class.
    * @param {Object} firebaseConfig - Configuration object for Firebase.
    */
    constructor(firebaseConfig) {
        // Initialize Firebase app with the given configuration
        const app = initializeApp(firebaseConfig);
        // Get a reference to the Firebase database
        this.db = getDatabase(app);
        // Object to store listeners for later removal
        this.listeners = {};
    }

    /**
    * Writes a JSON value to the specified path in the Firebase database.
    * @param {string} path - The database path where the value should be written.
    * @param {Object} value - The JSON object to be written to the database.
    * @returns {Promise<void>} - A promise that resolves when the write is complete.
    */
    write(path, value) {
        return set(ref(this.db, path), value)
        .then(() => {
            console.log(`Data written to ${path}`);
        })
        .catch((error) => {
            console.error(`Failed to write data to ${path}: `, error);
        });
    }

    /**
    * Pushes a JSON value to the specified path in the Firebase database.
    * @param {string} path - The database path where the value should be pushed.
    * @param {Object} value - The JSON object to be pushed to the database.
    * @returns {Promise<string>} - A promise that resolves to the unique key of the pushed value.
    */
    push(path, value) {
        const newRef = push(ref(this.db, path));
        return set(newRef, value)
        .then(() => {
            console.log(`Data pushed to ${path}`);
            return newRef.key; // Return the unique key
        })
        .catch((error) => {
            console.error(`Failed to push data to ${path}: `, error);
            throw error;
        });
    }

    /**
    * Remove path from Firebase database.
    * @param {string} path - The database path that should be deleted.
    * @returns {Promise<void>} - A promise that resolves when the remove is complete.
    */
    remove(path) {
        return remove(ref(this.db, path))
        .then(() => {
            console.log(`Data removed from ${path}`);
        })
        .catch((error) => {
            console.error(`Failed to remove data from ${path}: `, error);
        });
    }

    /**
    * Reads the value from the specified path in the Firebase database.
    * @param {string} path - The database path from where the value should be read.
    * @returns {Promise<Object|null>} - A promise that resolves to the read value or null if no data is available.
    */
    read(path) {
        return get(child(ref(this.db), path))
        .then((snapshot) => {
            if (snapshot.exists()) {
                return snapshot.val();
            } else {
                return null;
            }
        })
        .catch((error) => {
            console.error("Error reading data: ", error);
            throw error; // Re-throw the error to be caught by the calling code if necessary
        });
    }

    /**
    * Sets up a real-time listener on the specified path in the Firebase database.
    * Dispatches a custom event with the given event name and the data from the database.
    * @param {string} path - The database path to listen for changes.
    * @param {function} function ref - Reference to a callback function.
    */
    watch(path, func) {
        const pathRef = ref(this.db, path);
        const listener = onValue(pathRef, (snapshot) => {
            const data = snapshot.val();
            func(data);
        });

        // Store the reference to the listener
        this.listeners[path] = { pathRef, listener };
    }

    /**
    * Removes the real-time listener on the specified path in the Firebase database.
    * @param {string} path - The database path to stop listening for changes.
    */
    unwatch(path) {
        if (this.listeners[path]) {
            const { pathRef, listener } = this.listeners[path];
            off(pathRef);
            delete this.listeners[path];
        } else {
            console.log(`No listener found for path: ${path}`);
        }
    }
}
