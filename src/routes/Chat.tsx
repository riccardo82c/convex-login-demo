import { useEffect, useState, useRef } from "react"
import { useAction, useMutation, useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { getAuthToken } from "@/utils/auth"
import { Userdata } from "@/types/global"

import { Card } from "@/components/ui/card"

export default function Chat() {
  const [userData, setUserData] = useState<Userdata | null>(null)
  const [message, setMessage] = useState<string>('')
  const verifyJwt = useAction(api.auth_actions.verifyJwt)
  const sendMessage = useMutation(api.chat.sendMessage)
  const messages = useQuery(api.chat.getMessages)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchUserData() {
      try {
        const token = getAuthToken()
        if (token) {
          const user = await verifyJwt({ token })
          setUserData(user)
        }
      } catch (error) {
        console.error("Failed to verify user:", error)
      }
    }

    void fetchUserData()
  }, [verifyJwt])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <>
      {/* Mobile layout (sm:hidden) */}
      <div className="flex flex-col h-[calc(100vh-62px)] sm:hidden">
        {/* Header */}
        <div className="bg-white p-3 shadow-sm">
          <h2 className="text-lg font-bold text-center">Convex Chat</h2>

          {userData ? (
            <div className="text-center text-gray-600 text-xs">
              Benvenuto, <span className="font-medium">{userData.email}</span>
            </div>
          ) : (
            <div className="text-center text-gray-600 text-xs">Caricamento...</div>
          )}
        </div>

        {/* Messages area - scrollable */}
        <div className="flex-grow overflow-y-auto p-3 bg-gray-50">
          <div className="max-w-lg mx-auto">
            {messages?.map((message) => (
              <article
                key={message._id}
                className={`mb-2 p-2 rounded-lg max-w-[85%] ${message.user === userData?.email
                  ? "bg-blue-100 ml-auto"
                  : "bg-gray-200 mr-auto"}`}
              >
                <div className="text-xs text-gray-600 mb-1">{message.user}</div>
                <p className="text-gray-800 break-words">{message.body}</p>
              </article>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input area - fixed at bottom */}
        <div className="bg-white p-3 border-t">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (userData && message.trim()) {
                void sendMessage({
                  body: message,
                  user: userData.email
                })
                setMessage('')
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
              }
            }}
            className="max-w-lg mx-auto"
          >
            <div className="flex gap-2">
              <input
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Scrivi un messaggio..."
                className="flex-grow px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <button
                type="submit"
                disabled={!message.trim() || !userData}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
              >
                Invia
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Desktop layout (hidden sm:block) */}
      <div className="hidden sm:block max-w-3xl mx-auto mt-8 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Convex Chat</h2>

        {userData ? (
          <div className="mb-4 text-center text-gray-600">
            Benvenuto, <span className="font-medium">{userData.email}</span>
          </div>
        ) : (
          <div className="mb-4 text-center text-gray-600">Caricamento...</div>
        )}

        <div className="bg-gray-50 rounded-lg p-4 mb-4 h-96 overflow-y-auto">
          {messages?.map((message) => (
            <article
              key={message._id}
              className={`mb-3 p-3 rounded-lg ${message.user === userData?.email
                ? "bg-blue-100 ml-12"
                : "bg-gray-200 mr-12"}`}
            >
              <div className="text-xs text-gray-600 mb-1">{message.user}</div>
              <p className="text-gray-800">{message.body}</p>
            </article>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (userData && message.trim()) {
              void sendMessage({
                body: message,
                user: userData.email
              })
              setMessage('')
              messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
            }
          }}
          className="mt-4"
        >
          <div className="flex gap-2">
            <input
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Scrivi un messaggio..."
              className="flex-grow px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!message.trim() || !userData}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
            >
              Invia
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
