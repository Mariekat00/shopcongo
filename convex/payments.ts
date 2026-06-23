import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const payments = await ctx.db
      .query("payments")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    return Promise.all(
      payments.map(async (payment) => {
        const customer = payment.customerId
          ? await ctx.db.get(payment.customerId)
          : null;
        return { ...payment, customer };
      })
    );
  },
});

export const summary = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const payments = await ctx.db
      .query("payments")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    const totalAll = payments.reduce((sum, p) => sum + p.amount, 0);

    return { totalAll, count: payments.length };
  },
});

export const create = mutation({
  args: {
    userId: v.string(),
    saleId: v.optional(v.id("sales")),
    customerId: v.optional(v.id("customers")),
    amount: v.number(),
    paymentMethod: v.union(
      v.literal("cash"),
      v.literal("mtn_momo"),
      v.literal("orange_money"),
      v.literal("card")
    ),
    reference: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("payments", args);
  },
});
