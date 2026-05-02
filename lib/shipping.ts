/**
 * Shipping logic for India
 */

// Major Metro PIN Code prefixes
const METRO_PREFIXES = [
  '11', // Delhi
  '40', // Mumbai
  '56', // Bangalore
  '60', // Chennai
  '70', // Kolkata
  '50', // Hyderabad
  '38', // Ahmedabad
  '41', // Pune
];

export interface ShippingEstimate {
  deliveryDays: string;
  cost: number;
  isAvailable: boolean;
  message: string;
}

export function getShippingEstimate(pinCode: string, orderTotal: number): ShippingEstimate {
  // Basic validation: Indian PIN codes are 6 digits
  const pinRegex = /^[1-9][0-9]{5}$/;
  
  if (!pinRegex.test(pinCode)) {
    return {
      deliveryDays: '',
      cost: 0,
      isAvailable: false,
      message: 'Invalid PIN code format.'
    };
  }

  const prefix = pinCode.substring(0, 2);
  const isMetro = METRO_PREFIXES.includes(prefix);

  // Free shipping threshold (e.g., ₹999)
  const shippingCost = orderTotal >= 999 ? 0 : 99;

  if (isMetro) {
    return {
      deliveryDays: '2-3 Days',
      cost: shippingCost,
      isAvailable: true,
      message: 'Fast delivery available to your location!'
    };
  }

  // Standard delivery for other areas
  return {
    deliveryDays: '5-7 Days',
    cost: shippingCost,
    isAvailable: true,
    message: 'Standard delivery available.'
  };
}
