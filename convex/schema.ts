import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  profiles: defineTable({
    userId: v.string(),
    email: v.string(),
    fullName: v.optional(v.string()),
    businessName: v.optional(v.string()),
    phone: v.optional(v.string()),
    city: v.optional(v.string()),
    country: v.optional(v.string()),
    currency: v.optional(v.string()),
  }).index("by_userId", ["userId"]),

  categories: defineTable({
    userId: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    color: v.optional(v.string()),
  }).index("by_userId", ["userId"]),

  products: defineTable({
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
    isActive: v.optional(v.boolean()),
  })
    .index("by_userId", ["userId"])
    .index("by_category", ["categoryId"]),

  customers: defineTable({
    userId: v.string(),
    name: v.string(),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    address: v.optional(v.string()),
    notes: v.optional(v.string()),
    totalPurchases: v.optional(v.number()),
    balance: v.optional(v.number()),
  }).index("by_userId", ["userId"]),

  sales: defineTable({
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
  })
    .index("by_userId", ["userId"])
    .index("by_customer", ["customerId"]),

  saleItems: defineTable({
    saleId: v.id("sales"),
    productId: v.id("products"),
    quantity: v.number(),
    unitPrice: v.number(),
    total: v.number(),
  }).index("by_sale", ["saleId"]),

  payments: defineTable({
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
  })
    .index("by_userId", ["userId"])
    .index("by_sale", ["saleId"]),
});
