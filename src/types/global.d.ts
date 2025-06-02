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
}



export {
  FormData,
  FormErrors,
  Userdata
}
