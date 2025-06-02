import { useEffect, useState } from "react"
import { useAction, useMutation, useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { getAuthToken } from "@/utils/auth"
import { Userdata } from "@/types/global"

export default function Chat() {
  const [userData, setUserData] = useState<Userdata | null>(null)
  const [message, setMessage] = useState<string>('')
  const verifyJwt = useAction(api.auth_actions.verifyJwt)
  const sendMessage = useMutation(api.chat.sendMessage)
  const messages = useQuery(api.chat.getMessages)

  // create testing messages array with user body object
  // const messages = [
  //   {
  //     _id: 1,
  //     user: "test@example.com",
  //     body: "Hello there!"
  //   },
  //   {
  //     _id: 2,
  //     user: "user@example.com",
  //     body: "Hi! How are you?"
  //   },
  //   {
  //     _id: 3,
  //     user: "test@example.com",
  //     body: "I'm doing great, thanks for asking!"
  //   },
  //   {
  //     _id: 4,
  //     user: "user@example.com",
  //     body: "That's wonderful to hear!"
  //   }
  // ]

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
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
    }, 0)
  }, [messages])

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 rounded-lg shadow-md">
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
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (userData) {
            void sendMessage({
              body: message,
              user: userData.email
            })
            setMessage('')
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
  )
}
