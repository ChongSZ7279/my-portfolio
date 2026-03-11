import { Routes, Route } from 'react-router-dom'
import Portfolio from './Portfolio'
import Journey from './Journey'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Portfolio />} />
      <Route path="/journey" element={<Journey />} />
    </Routes>
  )
}

export default App
