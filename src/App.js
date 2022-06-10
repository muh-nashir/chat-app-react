import React from 'react'
import './App.css';

import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'

firebase.initializeApp({
  apiKey: "AIzaSyAJ4nr2bx3iM_hZ-k23Gf9RD_TiC2E0ycY",
  authDomain: "react-chat-app-24ed9.firebaseapp.com",
  projectId: "react-chat-app-24ed9",
  storageBucket: "react-chat-app-24ed9.appspot.com",
  messagingSenderId: "625676525654",
  appId: "1:625676525654:web:c4a6af09f4fc53d6c4dbf7",
  measurementId: "G-MHWMJ8HE1J"
})

const auth = firebase.auth()
const firestore = firebase.firestore()

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header className="App-header">
        
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn/>}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return(
    <button onClick={signInWithGoogle}>Sign In with Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.SignOut()}>Sign Out</button>
  )
}
function ChatRoom() {
  const dummy = useRef()

  const messageRef = firestore.collection('messages')
  const query = messageRef.orderBy('createdAt').limit(25)

  const [message] = useCollectionData(query, {idField: 'id'})

  const [formValue, setFormValue] = useState('')

  const sendMessage = async(e) => {
    e.preventDefault()
    
    const { uid, photoURL } = auth.currentUser;
    await messageRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue = ('')

    dummy.current.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        <div ref={dummy}></div>
      </main>
      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
        <button type="submit"></button>
      </form>

    </>
  )
}

function ChatMessage(props) {
  const { text, uid } = props.message

  const messageClass = uid === auth.currentUser.uid ? 'Sent' : 'Received';

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} />
      <p>{text}</p>
    </div>
  )
}

export default App;
