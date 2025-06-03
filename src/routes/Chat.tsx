import { useEffect, useState, useRef } from "react"
import { useAction, useMutation, useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { getAuthToken } from "@/utils/auth"
import { Userdata } from "@/types/global"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import TextInput from "@/components/ui/text-input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

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
    <Card className="max-w-[640px] mx-auto">
      <CardHeader>
        <CardTitle>Benvenuto/a</CardTitle>
        <CardDescription>
          {userData?.email}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96 max-h-full">
          {messages?.map((message) => (
            <article
              key={message._id}
              className={`mb-2 p-2 rounded-lg max-w-[85%] ${message.user === userData?.email
                ? "bg-message-self ml-auto"
                : "bg-message-other mr-auto"}`}
            >
              <div className="text-xs text-primary-800 mb-1">{message.user}</div>
              <p className="text-primary-950 break-words">{message.body}</p>
            </article>
          ))}
          <div ref={messagesEndRef} />
        </ScrollArea>
      </CardContent>
      <CardFooter>
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
          className="max-w-lg mx-auto flex items-center gap-2"
        >
          <div className="flex-grow">
            <TextInput
              value={message}
              onChange={e => setMessage(e.target.value)}
              label="Scrivi un messaggio"
              name="message"
              type="text"
              id="message"
            />
          </div>
          <Button
            type="submit"
            variant={'default'}
            size={'lg'}
            disabled={!message.trim() || !userData}

          >
            Invia
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
