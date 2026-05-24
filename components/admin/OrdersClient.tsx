"use client";

import { useState } from "react";
import { Eye, X, ChevronDown, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Order } from "@/types";
import {
  formatPriceEn,
  formatDateEn,
  ORDER_STATUS_BN,
  ORDER_STATUS_COLOR,
} from "@/lib/utils";

interface OrdersClientProps {
  orders: Order[];
}

const statusOptions = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

export default function OrdersClient({ orders: initialOrders }: OrdersClientProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [adminNote, setAdminNote] = useState("");

  const filtered = filterStatus
    ? orders.filter((o) => o.status === filterStatus)
    : orders;

  const openOrder = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setAdminNote(order.adminNote || "");
  };

  const updateOrderStatus = async () => {
    if (!selectedOrder) return;
    setUpdatingStatus(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrder.id
            ? { ...o, status: newStatus as Order["status"], adminNote }
            : o
        )
      );
      setSelectedOrder((prev) =>
        prev ? { ...prev, status: newStatus as Order["status"], adminNote } : null
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Orders</h2>
          <p className="text-gray-500 text-sm">{orders.length} orders total</p>
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#c8860a]"
        >
          <option value="">All Statuses</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {ORDER_STATUS_BN[s]} ({s})
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Order #</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Customer</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Date</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Total</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-[#c8860a]">
                    {order.orderNumber}
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-800">{order.customerName}</p>
                      <p className="text-xs text-gray-400">{order.phone}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell text-xs">
                    {formatDateEn(order.createdAt)}
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-800">
                    {formatPriceEn(order.total)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ORDER_STATUS_COLOR[order.status]}`}>
                      {ORDER_STATUS_BN[order.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => openOrder(order)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-blue-600 hover:bg-blue-50 text-xs font-medium transition-colors"
                    >
                      <Eye size={12} />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p>No orders found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setSelectedOrder(null)}
            />
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 z-[60] w-full max-w-lg bg-white shadow-2xl overflow-y-auto"
            >
              <div className="p-5">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="font-bold text-gray-800">Order Details</h3>
                    <p className="font-mono text-[#c8860a] text-sm">
                      #{selectedOrder.orderNumber}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-2 rounded-lg hover:bg-gray-100"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Status badge */}
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-5 ${ORDER_STATUS_COLOR[selectedOrder.status]}`}>
                  {ORDER_STATUS_BN[selectedOrder.status]}
                </span>

                {/* Customer info */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <h4 className="font-semibold text-gray-700 text-sm mb-3">Customer</h4>
                  <div className="space-y-1.5 text-sm">
                    <p className="text-gray-800">{selectedOrder.customerName}</p>
                    <p className="text-gray-600">📞 {selectedOrder.phone}</p>
                    <p className="text-gray-600">📍 {selectedOrder.address}</p>
                    {selectedOrder.notes && (
                      <p className="text-gray-500 italic">📝 {selectedOrder.notes}</p>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700 text-sm mb-3">Items</h4>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">
                            {item.productTitle}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.quantity} × {formatPriceEn(item.price)}
                          </p>
                        </div>
                        <span className="font-semibold text-gray-800 ml-4">
                          {formatPriceEn(item.lineTotal)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="bg-gray-50 rounded-xl p-4 mb-5 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatPriceEn(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery</span>
                    <span>{formatPriceEn(selectedOrder.deliveryCharge)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-800 border-t border-gray-200 pt-2">
                    <span>Total</span>
                    <span className="text-[#c8860a]">{formatPriceEn(selectedOrder.total)}</span>
                  </div>
                </div>

                {/* Update status */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-700 text-sm">Update Status</h4>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#c8860a]"
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>{ORDER_STATUS_BN[s]}</option>
                    ))}
                  </select>

                  <textarea
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="Internal admin note..."
                    rows={2}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#c8860a] resize-none"
                  />

                  <button
                    onClick={updateOrderStatus}
                    disabled={updatingStatus}
                    className="w-full flex items-center justify-center gap-2 bg-[#c8860a] text-white py-3 rounded-xl font-semibold text-sm disabled:opacity-70"
                  >
                    {updatingStatus ? (
                      <><Loader2 size={14} className="animate-spin" /> Updating...</>
                    ) : (
                      "Update Order"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
