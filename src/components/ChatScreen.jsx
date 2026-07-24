import { useEffect, useRef, useState } from 'react'
import { getScreen, SUGGESTIONS } from '../data/screens'
import { generateResponse } from '../services/geminiService'
import * as storage from '../services/storage'
import Header from './Header'

export default function ChatScreen({ screenId, onBack, headerExtra, introText, children }) {
  const screen = getScreen(screenId)
  const [messages, setMessages] = useState(() => storage.getMessages(screenId))
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const bodyRef = useRef(null)

  useEffect(() => {
    setMessages(storage.getMessages(screenId))
  }, [screenId])

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }
  }, [messages, isLoading])

  async function handleSend(overrideText) {
    const text = (overrideText ?? input).trim()
    if (!text) return
    setInput('')
    const withUser = storage.addMessage(screenId, { text, isUser: true })
    setMessages(withUser)
    setIsLoading(true)
    const response = await generateResponse(screenId, text)
    const withAi = storage.addMessage(screenId, { text: response, isUser: false })
    setMessages(withAi)
    setIsLoading(false)
  }

  function handleClear() {
    storage.clearMessages(screenId)
    setMessages([])
  }

  const suggestions = SUGGESTIONS[screenId] || []

  return (
    <div className="screen" style={{ '--accent': screen?.color }}>
      <Header title={screen?.title || ''} accent={screen?.color} onBack={onBack} onClear={handleClear} />
      {introText && <div className="screen-intro">{introText}</div>}

      <div className="screen-body" ref={bodyRef}>
        {children}

        {messages.length === 0 && !isLoading ? (
          <div className="chat-empty">
            <div className="big-emoji">{screen?.emoji}</div>
            <div style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }}>Khởi chạy phiên làm việc AI</div>
            <p style={{ fontSize: 12.5, maxWidth: 320, margin: '0 auto' }}>
              Nhập câu hỏi bên dưới, hoặc chọn một gợi ý có sẵn.
            </p>
            {suggestions.map((s) => (
              <button key={s} className="suggestion-chip" onClick={() => handleSend(s)}>
                {s}
              </button>
            ))}
          </div>
        ) : (
          <div className="chat-list">
            {messages.map((m) => (
              <div key={m.id} className={`chat-row ${m.isUser ? 'user' : 'ai'}`}>
                {!m.isUser && <div className="chat-avatar">DL</div>}
                <div className="chat-bubble">{m.text}</div>
              </div>
            ))}
            {isLoading && (
              <div className="chat-row ai">
                <div className="chat-avatar">DL</div>
                <div className="chat-bubble">
                  <span className="typing-indicator">
                    <span />
                    <span />
                    <span />
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="input-bar">
        <input
          type="text"
          placeholder={`Hỏi ${screen?.title || 'AI Đắk Lắk'}...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend()
          }}
        />
        <button className="send-btn" onClick={() => handleSend()} disabled={!input.trim()} aria-label="Gửi">
          ➤
        </button>
      </div>
    </div>
  )
}
