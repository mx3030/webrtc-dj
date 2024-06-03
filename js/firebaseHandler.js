import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getDatabase, ref, set, child, get, onValue, off } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js"

/**
 * Class to handle Firebase real-time database interactions.
 */
export class FirebaseHandler {
    /**
     * Initializes a new instance of the FirebaseHandler class.
     * @param {Object} firebaseConfig - Configuration object for Firebase.
     * @param {Object} webrtcHandler - Handler for WebRTC interactions (not used directly in this class).
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
     */
    write(path, value) {
        set(ref(this.db, path), value);
    }

    /**
     * Reads the value from the specified path in the Firebase database.
     * @param {string} path - The database path from where the value should be read.
     * @returns {Promise<Object|null>} - A promise that resolves to the read value or null if no data is available.
     */
    read(path) {
        return get(child(this.db, path)).then((snapshot) => {
            if (snapshot.exists()) {
                return snapshot.val();
            } else {
                console.log("No data available.");
                return null;
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    /**
     * Sets up a real-time listener on the specified path in the Firebase database.
     * Dispatches a custom event with the given event name and the data from the database.
     * @param {string} path - The database path to listen for changes.
     * @param {string} event_name - The name of the custom event to dispatch.
     */
    watch(path, event_name) {
        const pathRef = ref(this.db, path);
        const listener = onValue(pathRef, (snapshot) => {
            const data = snapshot.val();
            const event = new CustomEvent(event_name, { detail: data });
            document.dispatchEvent(event);
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
            off(pathRef, 'value', listener);
            delete this.listeners[path];
        } else {
            console.log(`No listener found for path: ${path}`);
        }
    }
}

