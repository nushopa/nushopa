// Order rules shared by the cart drawer, the cart page and checkout.
// Keep these in step with the backend (constant/orderRules.js and
// payment.controller.js), which is what actually enforces them.

export const SERVICE_CHARGE_RATE = 0.15;

// Minimum value of the items in an order (delivery/service fees excluded).
export const MIN_ORDER_SUBTOTAL = 5000;

// The backend rounds the service charge to the nearest naira, so we do too.
// Without this the cart showed ₦409.8 while checkout charged ₦410.
export const calcServiceCharge = (subtotal) =>
  Math.round((subtotal || 0) * SERVICE_CHARGE_RATE);

// How much more the customer needs to add to reach the minimum (0 = met).
export const amountToMinimum = (subtotal) =>
  Math.max(0, MIN_ORDER_SUBTOTAL - (subtotal || 0));

export const meetsMinimumOrder = (subtotal) =>
  (subtotal || 0) >= MIN_ORDER_SUBTOTAL;
