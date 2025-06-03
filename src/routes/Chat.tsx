import { useEffect, useState, useRef } from "react"
import { useAction, useMutation, useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { getAuthToken } from "@/utils/auth"
import { Userdata } from "@/types/global"
import { useMediaQuery } from "@uidotdev/usehooks"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import TextInput from "@/components/ui/text-input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

import { EmojiPicker, EmojiPickerContent, EmojiPickerSearch, EmojiPickerFooter } from "@/components/ui/emoji-picker"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Smile } from "lucide-react"

export default function Chat() {
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)")
  const [userData, setUserData] = useState<Userdata | null>(null)
  const [message, setMessage] = useState<string>('')
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
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
              <span className="text-xs text-primary-800">{new Date(message._creationTime).toLocaleString()}</span>
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
          className="flex gap-2 w-full"
        >
          <div className="flex-grow relative">
            <TextInput
              value={message}
              onChange={e => setMessage(e.target.value)}
              label="Scrivi un messaggio"
              name="message"
              type="text"
              id="message"
              className="pr-10"
            />
            {!isSmallDevice && (
              <Popover open={isEmojiPickerOpen} onOpenChange={setIsEmojiPickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    type="button"
                  >
                    <Smile className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[350px] p-0 overflow-hidden">
                  <EmojiPicker
                    className="h-[326px] rounded-lg border shadow-md"
                    onEmojiSelect={({ emoji }) => {
                      setMessage(prev => prev + emoji)
                      setIsEmojiPickerOpen(false)
                    }}
                  >
                    <EmojiPickerSearch placeholder="Cerca emoji..." />
                    <EmojiPickerContent />
                  </EmojiPicker>
                </PopoverContent>
              </Popover>
            )}


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
