"use node"
import { v } from "convex/values"
import { action } from "./_generated/server"
import { api } from "./_generated/api"
import { randomBytes, pbkdf2Sync } from "crypto"
import { Id } from "./_generated/dataModel"
import jwt from 'jsonwebtoken'

export const generateJwt = action({
  args: {
    userId: v.id("users"),
    email: v.string()
  },
  handler: async (ctx, args): Promise<string> => {
    const payload = {
      userId: args.userId,
      email: args.email
    }

    const secretKey = process.env.JWT_SECRET!

    console.log('secretKey', secretKey)

    const token = jwt.sign(
      payload,
      secretKey,
      { expiresIn: '24h' }
    )
    return token
  },
})

function hashPassword(password: string): { hash: string, salt: string } {
  const salt = randomBytes(16).toString('hex')
  const hash = pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
  return { hash, salt }
}

function verifyPassword(password: string, hash: string, salt: string): boolean {
  const verifyHash = pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
  return hash === verifyHash
}

// Action for password hashing
export const hashUserPassword = action({
  args: {
    password: v.string()
  },
  handler: async (ctx, args): Promise<{ hash: string, salt: string }> => {
    return hashPassword(args.password)
  }
})

// Action that orchestrates the user creation process
export const registerUser = action({
  args: {
    email: v.string(),
    password: v.string()
  },
  handler: async (ctx, args): Promise<{ userId: Id<"users">, token: string } | null> => {


    // check if user already exists
    const user = await ctx.runQuery(api.auth.getUserByEmail, {
      email: args.email
    })

    if (user) return null

    // First hash the password
    const hashResult = await ctx.runAction(api.auth_actions.hashUserPassword, {
      password: args.password
    })

    const hash: string = hashResult.hash
    const salt: string = hashResult.salt

    // Then create the user
    const userId = await ctx.runMutation(api.auth.createUser, {
      email: args.email,
      passwordHash: hash,
      passwordSalt: salt
    })

    const token = await ctx.runAction(api.auth_actions.generateJwt, {
      userId: userId,
      email: args.email
    })

    return { userId, token }
  }
})

export const loginUser = action({
  args: {
    email: v.string(),
    password: v.string()
  },
  handler: async (ctx, args): Promise<{ userId: Id<"users">, token: string } | null> => {

    // find user by email with convex
    const user = await ctx.runQuery(api.auth.getUserByEmail, {
      email: args.email
    })

    console.log('user', user)

    if (!user) {
      return null
    }

    const isPasswordValid = verifyPassword(args.password, user.passwordHash, user.passwordSalt)

    console.log('isPasswordValid', isPasswordValid)

    if (!isPasswordValid) {
      return null
    }

    const token = await ctx.runAction(api.auth_actions.generateJwt, {
      userId: user._id,
      email: args.email
    })

    return { userId: user._id, token: token }
  }
})
