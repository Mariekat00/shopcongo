import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const get = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const lowStock = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const products = await ctx.db
      .query("products")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
    return products.filter(
      (p) => p.stock <= (p.lowStockThreshold ?? 5)
    );
  },
});

export const create = mutation({
  args: {
    userId: v.string(),
    categoryId: v.optional(v.id("categories")),
    name: v.string(),
    description: v.optional(v.string()),
    sku: v.optional(v.string()),
    price: v.number(),
    cost: v.optional(v.number()),
    stock: v.number(),
    lowStockThreshold: v.optional(v.number()),
    unit: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("products", {
      ...args,
      isActive: true,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("products"),
    categoryId: v.optional(v.id("categories")),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    sku: v.optional(v.string()),
    price: v.optional(v.number()),
    cost: v.optional(v.number()),
    stock: v.optional(v.number()),
    lowStockThreshold: v.optional(v.number()),
    unit: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
