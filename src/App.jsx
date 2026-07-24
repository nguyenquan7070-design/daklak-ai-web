import { useEffect, useState } from 'react'
import Home from './components/Home'
import ChatScreen from './components/ChatScreen'
import CoffeeModule from './components/CoffeeModule'
import ForestModule from './components/ForestModule'
import CameraModule from './components/CameraModule'
import AlertSOS from './components/AlertSOS'
import { seedDemoDataIfEmpty } from './services/storage'

const GENERIC_SCREEN_IDS = [
  'citizen',
  'health',
  'tourism',
  'crime',
  'field',
  'agriculture',
  'culture',
  'planning',
]

export default function App() {
  const [screen, setScreen] = useState('home')

  useEffect(() => {
    seedDemoDataIfEmpty()
  }, [])

  function goHome() {
    setScreen('home')
  }

  if (screen === 'home') {
    return (
      <div className="app-shell">
        <Home onNavigate={setScreen} />
      </div>
    )
  }

  if (screen === 'coffee') {
    return (
      <div className="app-shell">
        <CoffeeModule onBack={goHome} />
      </div>
    )
  }

  if (screen === 'forest') {
    return (
      <div className="app-shell">
        <ForestModule onBack={goHome} />
      </div>
    )
  }

  if (screen === 'camera') {
    return (
      <div className="app-shell">
        <CameraModule onBack={goHome} />
      </div>
    )
  }

  if (screen === 'alert') {
    return (
      <div className="app-shell">
        <AlertSOS onBack={goHome} />
      </div>
    )
  }

  if (GENERIC_SCREEN_IDS.includes(screen)) {
    return (
      <div className="app-shell">
        <ChatScreen screenId={screen} onBack={goHome} />
      </div>
    )
  }

  // Fallback: unknown id, go home
  goHome()
  return null
}
