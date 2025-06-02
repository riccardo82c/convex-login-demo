import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const getMessages = query({
  args: {},
  handler: async (ctx) => {
    const messages = await ctx.db.query("message").collect()
    return messages
  }
})

export const sendMessage = mutation({
  args: {
    body: v.string(),
    user: v.string()
  },
  handler: async (ctx, args): Promise<void> => {
    console.log('send message, ', args)
    await ctx.db.insert("message", {
      body: args.body,
      user: args.user
    })
  }
},
)
