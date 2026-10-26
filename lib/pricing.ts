export function calculateShipping(subtotalAfterDiscount: number, freeShippingCoupon = false) {
  if (freeShippingCoupon || subtotalAfterDiscount > 50) return 0;
  return 4.99;
}
