import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { OrderRecord } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('your-project')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const LOCAL_STORAGE_KEY = 'sneaker_estimator_orders';

function getLocalOrders(): OrderRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveLocalOrders(orders: OrderRecord[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(orders));
  } catch {
    // Ignore localStorage failures
  }
}

/**
 * Fetch all orders sorted by created_at descending.
 */
export async function fetchOrders(): Promise<OrderRecord[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch error, falling back to local records:', error.message);
        return getLocalOrders();
      }

      if (data) {
        // Sync local storage with fetched data
        saveLocalOrders(data);
        return data as OrderRecord[];
      }
    } catch (err) {
      console.warn('Network or Supabase query failed:', err);
      return getLocalOrders();
    }
  }

  return getLocalOrders();
}

/**
 * Insert a new order record into the database.
 */
export async function insertOrder(orderPayload: {
  customer_name: string;
  customer_phone: string;
  selected_items: string;
  total_price: number;
}): Promise<OrderRecord> {
  const newOrder: OrderRecord = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `order-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    customer_name: orderPayload.customer_name,
    customer_phone: orderPayload.customer_phone,
    selected_items: orderPayload.selected_items,
    total_price: orderPayload.total_price,
    status: 'pending',
    created_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([
          {
            id: newOrder.id,
            customer_name: newOrder.customer_name,
            customer_phone: newOrder.customer_phone,
            selected_items: newOrder.selected_items,
            total_price: newOrder.total_price,
            status: 'pending',
          },
        ])
        .select()
        .single();

      if (!error && data) {
        const persisted = data as OrderRecord;
        const currentLocal = getLocalOrders();
        saveLocalOrders([persisted, ...currentLocal.filter((o) => o.id !== persisted.id)]);
        return persisted;
      } else if (error) {
        console.warn('Supabase insertion error, using local persistence:', error.message);
      }
    } catch (err) {
      console.warn('Supabase connection error on insert:', err);
    }
  }

  // Persist locally
  const current = getLocalOrders();
  const updated = [newOrder, ...current];
  saveLocalOrders(updated);
  return newOrder;
}

/**
 * Update order status to 'processed'.
 */
export async function updateOrderStatus(orderId: string, newStatus: 'processed' | 'pending' = 'processed'): Promise<boolean> {
  let success = true;

  if (supabase) {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) {
        console.warn('Supabase update status error:', error.message);
        success = false;
      }
    } catch (err) {
      console.warn('Supabase status update error:', err);
      success = false;
    }
  }

  // Always update local cache so the UI reflects the change seamlessly
  const current = getLocalOrders();
  const updated = current.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
  saveLocalOrders(updated);

  return success;
}
