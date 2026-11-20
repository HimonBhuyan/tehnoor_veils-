import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const TMP_FILE = path.join("/tmp", "tehnoor-orders.json");

function readOrders() {
  try {
    if (fs.existsSync(TMP_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(TMP_FILE, "utf8"));
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

function writeOrders(orders) {
  try {
    fs.writeFileSync(TMP_FILE, JSON.stringify(orders, null, 2));
  } catch {}
}

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method === "GET") {
    const id = String(req.query?.id || "").trim();
    const orders = readOrders();
    if (id) {
      const found = orders.find((o) => o.orderId?.toLowerCase() === id.toLowerCase());
      if (!found) {
        return res.status(404).json({ ok: false, error: "Order not found" });
      }
      return res.status(200).json({ ok: true, order: found });
    }
    return res.status(200).json({ ok: true, count: orders.length });
  }

  if (req.method === "POST") {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    if (!Array.isArray(body.items) || !body.items.length || !body.customer) {
      return res.status(400).json({ ok: false, error: "Invalid order payload" });
    }

    const year = new Date().getFullYear();
    const suffix = crypto.randomBytes(3).toString("hex").slice(0, 5).toUpperCase();
    const order = {
      orderId: `TV-${year}-${suffix}`,
      status: "Confirmed",
      createdAt: new Date().toISOString(),
      customer: {
        name: String(body.customer.name || "").trim(),
        phone: String(body.customer.phone || "").trim(),
        email: String(body.customer.email || "").trim(),
        address: String(body.customer.address || "").trim(),
        city: String(body.customer.city || "").trim(),
        pincode: String(body.customer.pincode || "").trim()
      },
      paymentMethod: String(body.paymentMethod || "UPI"),
      promoCode: String(body.promoCode || ""),
      items: body.items,
      totals: body.totals || {}
    };

    const orders = readOrders();
    orders.unshift(order);
    writeOrders(orders);

    return res.status(200).json({ ok: true, order });
  }

  return res.status(405).json({ ok: false, error: "Method not allowed" });
}
