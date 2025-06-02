import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { useState, useEffect } from "react"
import { Userdata } from "@/types/global"

export default function UserList() {
  const [users, setUsers] = useState<Userdata[]>([])
  const userListFromQuery = useQuery(api.auth.listUser)

  useEffect(() => {
    if (userListFromQuery) {
      const formattedUsers: Userdata[] = userListFromQuery.map(user => ({
        userId: user._id,
        email: user.email,
        createdAt: user._creationTime
      }))
      setUsers(formattedUsers)
    }
  }, [userListFromQuery])

  return (
    <div>
      {users.length > 0 ? (
        <ul>
          {users.map((user) => (
            <li key={user.userId.toString()}>
              <p>
                {user.email}
              </p>
              <p>
                {user.userId}
              </p>

            </li>

          ))}
        </ul>
      ) : (
        <p>Caricamento utenti...</p>
      )}
    </div>
  )
}
