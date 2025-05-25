// auth.ts
import { v } from "convex/values"
import { query, mutation } from "./_generated/server"
import { Id } from "./_generated/dataModel"

// Mutation for storing user in database
export const createUser = mutation({
  args: {
    email: v.string(),
    passwordHash: v.string(),
    passwordSalt: v.string()
  },
  handler: async (ctx, args): Promise<Id<"users">> => {
    const userId = await ctx.db.insert("users", {
      email: args.email,
      passwordHash: args.passwordHash,
      passwordSalt: args.passwordSalt
    })

    console.log('Added new user with id: ', userId)
    return userId
  }
})

export const listUser = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect()
    return users
  }
})

export const getUserByEmail = query({
  args: {
    email: v.string()
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("email"), args.email))
      .first()
    return user
  }
});
