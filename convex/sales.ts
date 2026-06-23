import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const sales = await ctx.db
      .query("sales")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    return Promise.all(
      sales.map(async (sale) => {
        const items = await ctx.db
          .query("saleItems")
          .withIndex("by_sale", (q) => q.eq("saleId", sale._id))
          .collect();
        const customer = sale.customerId
          ? await ctx.db.get(sale.customerId)
          : null;
        return { ...sale, items, customer };
      })
    );
  },
});

export const get = query({
  args: { id: v.id("sales") },
  handler: async (ctx, args) => {
    const sale = await ctx.db.get(args.id);
    if (!sale) return null;
    const items = await ctx.db
      .query("saleItems")
      .withIndex("by_sale", (q) => q.eq("saleId", sale._id))
      .collect();
    const customer = sale.customerId
      ? await ctx.db.get(sale.customerId)
      : null;
    return { ...sale, items, customer };
  },
});

export const recent = query({
  args: { userId: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 5;
    const sales = await ctx.db
      .query("sales")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(limit);

    return Promise.all(
      sales.map(async (sale) => {
        const customer = sale.customerId
          ? await ctx.db.get(sale.customerId)
          : null;
        return { ...sale, customer };
      })
    );
  },
});

export const create = mutation({
  args: {
    userId: v.string(),
    customerId: v.optional(v.id("customers")),
    invoiceNumber: v.string(),
    subtotal: v.number(),
    discount: v.optional(v.number()),
    tax: v.optional(v.number()),
    total: v.number(),
    paymentMethod: v.union(
      v.literal("cash"),
      v.literal("mtn_momo"),
      v.literal("orange_money"),
      v.literal("card"),
      v.literal("credit")
    ),
    paymentStatus: v.union(
      v.literal("paid"),
      v.literal("pending"),
      v.literal("partial"),
      v.literal("cancelled")
    ),
    amountPaid: v.optional(v.number()),
    notes: v.optional(v.string()),
    items: v.array(
      v.object({
        productId: v.id("products"),
        quantity: v.number(),
        unitPrice: v.number(),
        total: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const { items, ...saleData } = args;

    const saleId = await ctx.db.insert("sales", saleData);

    for (const item of items) {
      await ctx.db.insert("saleItems", {
        saleId,
        ...item,
      });

      const product = await ctx.db.get(item.productId);
      if (product) {
        await ctx.db.patch(item.productId, {
          stock: product.stock - item.quantity,
        });
      }
    }

    return saleId;
  },
});
