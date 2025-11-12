import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Portfolio from './Portfolio'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Portfolio/>
    </>
  )
}

export default App
