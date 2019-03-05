import { app } from 'firebase';

const config = {
  apiKey: process.env.local.REACT_APP_API_KEY,
  authDomain: process.env.local.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.local.REACT_APP_DATABASE_URL,
  projectId: process.env.local.REACT_APP_PROJECT_ID,
  storageBucket: process.env.local.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.local.REACT_APP_MESSAGING_SENDER_ID,
};

class Firebase {
  constructor() {
    app.initializeApp(config);
  }
}

export default Firebase;
