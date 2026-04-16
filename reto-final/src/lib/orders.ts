import { supabase } from "./supabase";
import type { Order, DiscountCode } from "./types";

export async function validateDiscountCode(code: string): Promise<DiscountCode | null> {
  const { data, error } = await supabase
    .from("discount_codes")
    .select("*")
    .eq("code", code.toUpperCase())
    .eq("active", true)
    .single();

  if (error) return null;
  return data as DiscountCode;
}

export async function createOrder(order: Omit<Order, "id" | "created_at">): Promise<Order> {
  const { data, error } = await supabase
    .from("orders")
    .insert(order)
    .select()
    .single();

  if (error) throw error;
  return data as Order;
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `PLATZI-${timestamp}-${random}`;
}
