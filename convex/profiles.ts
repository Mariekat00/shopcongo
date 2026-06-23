import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const profiles = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
    return profiles[0] ?? null;
  },
});

export const create = mutation({
  args: {
    userId: v.string(),
    email: v.string(),
    fullName: v.optional(v.string()),
    businessName: v.optional(v.string()),
    phone: v.optional(v.string()),
    city: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("profiles", {
      ...args,
      country: "RD Congo",
      currency: "USD",
    });
  },
});

export const update = mutation({
  args: {
    userId: v.string(),
    fullName: v.optional(v.string()),
    businessName: v.optional(v.string()),
    phone: v.optional(v.string()),
    city: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId, ...fields } = args;
    const profiles = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();
    if (profiles[0]) {
      await ctx.db.patch(profiles[0]._id, fields);
    }
  },
});
