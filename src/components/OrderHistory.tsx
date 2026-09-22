import React from 'react';
import { OrderRecord } from '../types';
import { formatRupiah } from '../lib/formatters';

interface OrderHistoryProps {
  orders: OrderRecord[];
  isLoading: boolean;
  hasError: boolean;
  onRefresh: () => void;
  onUpdateStatus: (orderId: string) => Promise<void>;
  updatingOrderId: string | null;
}

export const OrderHistory: React.FC<OrderHistoryProps> = ({
  orders,
  isLoading,
  hasError,
  onRefresh,
  onUpdateStatus,
  updatingOrderId,
}) => {
  return (
    <section id="order-history-section" className="mt-12 pt-8 border-t border-neutral-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 id="order-history-heading" className="text-lg font-semibold text-neutral-900">
            Order Submissions &amp; Lead Records
          </h2>
          <p className="text-sm text-neutral-600 mt-0.5">
            Database tracking of customer estimates submitted via WhatsApp.
          </p>
        </div>
        <button
          id="btn-refresh-history"
          type="button"
          onClick={onRefresh}
          className="inline-flex items-center justify-center px-3.5 py-2 text-xs font-medium text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors min-h-[44px] sm:min-h-[36px] cursor-pointer"
        >
          Refresh Records
        </button>
      </div>

      {/* State 1: Loading State */}
      {isLoading && (
        <div id="order-history-loading" className="bg-white border border-neutral-200 rounded-lg p-6 space-y-4">
          <div className="h-4 bg-neutral-200 rounded-lg animate-pulse w-1/4" />
          <div className="space-y-3 pt-2">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex items-center justify-between gap-4 py-3 border-b border-neutral-100 last:border-0">
                <div className="h-4 bg-neutral-200 rounded-lg animate-pulse w-1/3" />
                <div className="h-4 bg-neutral-200 rounded-lg animate-pulse w-1/4" />
                <div className="h-4 bg-neutral-200 rounded-lg animate-pulse w-1/6" />
                <div className="h-4 bg-neutral-200 rounded-lg animate-pulse w-1/8" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* State 2: Error State */}
      {!isLoading && hasError && (
        <div id="order-history-error" className="border border-neutral-300 bg-neutral-100 p-4 rounded-lg">
          <p className="text-sm text-neutral-800">
            Unable to load order history. Please refresh the page to retry.
          </p>
          <button
            type="button"
            onClick={onRefresh}
            className="mt-3 text-xs font-semibold text-neutral-900 underline hover:text-neutral-700 cursor-pointer"
          >
            Click here to retry
          </button>
        </div>
      )}

      {/* State 3: Empty State */}
      {!isLoading && !hasError && orders.length === 0 && (
        <div id="order-history-empty" className="border border-dashed border-neutral-200 p-8 text-center rounded-lg bg-white">
          <p className="text-sm text-neutral-600">
            No previous estimates found. Orders sent to WhatsApp will appear here.
          </p>
        </div>
      )}

      {/* State 4: Data State */}
      {!isLoading && !hasError && orders.length > 0 && (
        <div id="order-history-table-container" className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50 text-neutral-600 text-xs font-semibold border-b border-neutral-200 uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-5 py-3.5">Ref ID / Date</th>
                  <th scope="col" className="px-5 py-3.5">Customer</th>
                  <th scope="col" className="px-5 py-3.5">Selected Items</th>
                  <th scope="col" className="px-5 py-3.5 text-right">Total Price</th>
                  <th scope="col" className="px-5 py-3.5 text-center">Status</th>
                  <th scope="col" className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 text-neutral-900">
                {orders.map((order) => {
                  const shortId = order.id ? order.id.slice(0, 8) : 'N/A';
                  const formattedDate = order.created_at
                    ? new Date(order.created_at).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '-';
                  const isUpdating = updatingOrderId === order.id;

                  return (
                    <tr key={order.id} id={`order-row-${order.id}`} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="font-mono text-xs font-semibold text-neutral-900 block">
                          #{shortId}
                        </span>
                        <span className="text-xs text-neutral-500 mt-0.5 block">
                          {formattedDate}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-medium text-neutral-900">{order.customer_name}</div>
                        <div className="text-xs text-neutral-500 mt-0.5 font-mono">{order.customer_phone}</div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-block text-neutral-800 text-sm">
                          {order.selected_items}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <span className="font-semibold text-neutral-900">
                          {formatRupiah(order.total_price)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center whitespace-nowrap">
                        <span
                          id={`badge-status-${order.id}`}
                          className={`inline-flex items-center px-2.5 py-1 text-xs rounded-lg font-medium ${
                            order.status === 'processed'
                              ? 'bg-neutral-900 text-white'
                              : 'bg-neutral-100 text-neutral-800 border border-neutral-200'
                          }`}
                        >
                          {order.status === 'processed' ? 'Processed' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        {order.status === 'pending' ? (
                          <button
                            id={`btn-mark-processed-${order.id}`}
                            type="button"
                            disabled={isUpdating}
                            onClick={() => onUpdateStatus(order.id)}
                            className="inline-flex items-center justify-center min-h-[44px] px-3 py-1.5 text-xs font-medium rounded-lg text-neutral-900 bg-white border border-neutral-200 hover:bg-neutral-100 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            {isUpdating ? 'Updating...' : 'Mark Processed'}
                          </button>
                        ) : (
                          <span className="text-xs text-neutral-400 font-medium inline-flex items-center min-h-[44px]">
                            Completed
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};
