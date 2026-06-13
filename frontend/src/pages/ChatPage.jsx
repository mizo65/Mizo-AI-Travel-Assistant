import { useState, useEffect } from 'react'
import { useChatStore } from '../store/chatStore'
import { useAuthStore } from '../store/authStore'
import { motion } from 'framer-motion'
import { Send, LogOut, Mic, MicOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default function ChatPage() {
  const navigate = useNavigate()
  const { messages, sendMessage, loading } = useChatStore()
  const { logout, user } = useAuthStore()
  const [input, setInput] = useState('')
  const [language, setLanguage] = useState('ar')

  useEffect(() => {
    // Load chat history on mount
    useChatStore.getState().getChatHistory()
  }, [])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    try {
      await sendMessage(input, language)
      setInput('')
    } catch (error) {
      toast.error('خطأ في إرسال الرسالة')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-2xl mx-auto h-screen flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-md border-b border-white/20 p-4 flex justify-between items-center"
        >
          <div className="flex items-center gap-3">
            <div className="text-3xl">🤖</div>
            <div>
              <h1 className="text-xl font-bold text-white">مساعد السفر الذكي</h1>
              <p className="text-sm text-purple-200">أهلاً {user?.fullName}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 transition"
          >
            <LogOut size={18} />
            <span>تسجيل الخروج</span>
          </button>
        </motion.div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full flex items-center justify-center flex-col"
            >
              <div className="text-6xl mb-4 float">✈️</div>
              <h2 className="text-2xl font-bold text-white mb-2">مرحباً بك!</h2>
              <p className="text-gray-300">ابدأ محادثتك مع مساعد السفر الذكي</p>
            </motion.div>
          ) : (
            messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`message-bubble ${
                    msg.role === 'user' ? 'message-user' : 'message-assistant'
                  }`}
                >
                  <p className="text-white text-sm">{msg.content}</p>
                </div>
              </motion.div>
            ))
          )}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="message-bubble message-assistant">
                <div className="wave-container">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="wave-bar"></div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-md border-t border-white/20 p-4"
        >
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-purple-500"
            >
              <option value="ar">العربية</option>
              <option value="en">English</option>
            </select>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اكتب رسالتك هنا..."
              className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg transition disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
