import { query } from "./_generated/server";
import { v } from "convex/values";

export const stats = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const products = await ctx.db
      .query("products")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    const sales = await ctx.db
      .query("sales")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    const customers = await ctx.db
      .query("customers")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString();

    const todaySales = sales.filter(
      (s) => s._creationTime >= new Date(todayStr).getTime()
    );

    const todayRevenue = todaySales.reduce((sum, s) => sum + s.total, 0);
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const lowStockCount = products.filter(
      (p) => p.stock <= (p.lowStockThreshold ?? 5)
    ).length;

    return {
      todayRevenue,
      todayTransactions: todaySales.length,
      totalProducts: products.length,
      totalStock,
      lowStockCount,
      totalCustomers: customers.length,
    };
  },
});

export const recentSales = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const sales = await ctx.db
      .query("sales")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(5);

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

export const lowStockProducts = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const products = await ctx.db
      .query("products")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    return products
      .filter((p) => p.stock <= (p.lowStockThreshold ?? 5))
      .sort((a, b) => a.stock - b.stock);
  },
});
