import { useEffect, useState } from 'react'
import './App.css'

async function intialCommitCall(){
  const res = await fetch('/api/initialCommit');
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.hint || `HTTP ${res.status}`);
  }

  return res.json()
}

function App() {
  const [message, setMessage] = useState<string | null>("")
    
  //initialCommit, to be deleted
  useEffect(() => {
    const callInitialCommitApi = async () => {
      try {
        const res = await intialCommitCall();
        setMessage(res.message)        
      }
      catch (e) {
        //nothing here kkk
      }
    }

    void callInitialCommitApi();
  })

  const contentComponent = (
    <>
      <h1> { message } </h1>
    </>
  )
  return contentComponent
}

export default App
