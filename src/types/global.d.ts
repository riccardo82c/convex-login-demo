interface FormData {
  username: string
  password: string
}

interface FormErrors {
  username?: string
  password?: string
}

interface Userdata {
  userId: Id<"users">
  email: string
  token?: string
  createdAt?: number
  role: string
}



export {
  FormData,
  FormErrors,
  Userdata
}
