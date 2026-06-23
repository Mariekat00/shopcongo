"use client";

import { openDB, DBSchema, IDBPDatabase } from "idb";

interface ShopCongoDB extends DBSchema {
  pendingSales: {
    key: string;
    value: {
      id: string;
      userId: string;
      items: Array<{
        productId: string;
        name: string;
        quantity: number;
        unitPrice: number;
        total: number;
      }>;
      subtotal: number;
      total: number;
      paymentMethod: string;
      invoiceNumber: string;
      createdAt: string;
      synced: boolean;
    };
  };
  pendingProducts: {
    key: string;
    value: {
      id: string;
      userId: string;
      name: string;
      price: number;
      stock: number;
      createdAt: string;
      synced: boolean;
    };
  };
  cachedProducts: {
    key: string;
    value: {
      id: string;
      userId: string;
      name: string;
      price: number;
      stock: number;
      updatedAt: number;
    };
  };
}

let dbPromise: Promise<IDBPDatabase<ShopCongoDB>> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<ShopCongoDB>("shopcongo", 1, {
      upgrade(db) {
        db.createObjectStore("pendingSales", { keyPath: "id" });
        db.createObjectStore("pendingProducts", { keyPath: "id" });
        db.createObjectStore("cachedProducts", { keyPath: "id" });
      },
    });
  }
  return dbPromise;
}

export async function savePendingSale(sale: {
  id: string;
  userId: string;
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  total: number;
  paymentMethod: string;
  invoiceNumber: string;
}) {
  const db = await getDB();
  await db.put("pendingSales", {
    ...sale,
    createdAt: new Date().toISOString(),
    synced: false,
  });
}

export async function getPendingSales() {
  const db = await getDB();
  return await db.getAll("pendingSales");
}

export async function markSaleSynced(id: string) {
  const db = await getDB();
  await db.delete("pendingSales", id);
}

export async function cacheProducts(products: Array<{
  id: string;
  userId: string;
  name: string;
  price: number;
  stock: number;
}>) {
  const db = await getDB();
  const tx = db.transaction("cachedProducts", "readwrite");
  for (const product of products) {
    await tx.store.put({
      ...product,
      updatedAt: Date.now(),
    });
  }
  await tx.done;
}

export async function getCachedProducts(userId: string) {
  const db = await getDB();
  const all = await db.getAll("cachedProducts");
  return all.filter((p) => p.userId === userId);
}

export function isOnline(): boolean {
  if (typeof navigator !== "undefined" && navigator.onLine) {
    return true;
  }
  return false;
}
