export type DiscountType = 'PERCENTAGE' | 'FIXED'

export interface Coupon {
  id: string
  code: string
  type: DiscountType
  value: number
  minOrderAmount: number
  maxUses: number | null
  usedCount: number
  isActive: boolean
  expiresAt: string | null
  description: string
  createdAt: string
  updatedAt: string
}

export const COUPON_STORAGE_KEY = 'sh_coupons'

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'cpn-1',
    code: 'WELCOME10',
    type: 'PERCENTAGE',
    value: 10,
    minOrderAmount: 500,
    maxUses: 100,
    usedCount: 23,
    isActive: true,
    expiresAt: null,
    description: '10% off for new customers',
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: 'cpn-2',
    code: 'EID2025',
    type: 'FIXED',
    value: 200,
    minOrderAmount: 1500,
    maxUses: 50,
    usedCount: 50,
    isActive: false,
    expiresAt: '2025-04-10T23:59:59.000Z',
    description: 'Eid special ৳200 off',
    createdAt: new Date('2025-03-20').toISOString(),
    updatedAt: new Date('2025-03-20').toISOString(),
  },
  {
    id: 'cpn-3',
    code: 'FLAT100',
    type: 'FIXED',
    value: 100,
    minOrderAmount: 800,
    maxUses: null,
    usedCount: 7,
    isActive: true,
    expiresAt: null,
    description: 'Flat ৳100 off on all orders',
    createdAt: new Date('2024-06-01').toISOString(),
    updatedAt: new Date('2024-06-01').toISOString(),
  },
]

export function loadCoupons(): Coupon[] {
  if (typeof window === 'undefined') return INITIAL_COUPONS
  try {
    const raw = localStorage.getItem(COUPON_STORAGE_KEY)
    if (!raw) return INITIAL_COUPONS
    const parsed = JSON.parse(raw) as Coupon[]
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_COUPONS
  } catch {
    return INITIAL_COUPONS
  }
}

export function saveCoupons(coupons: Coupon[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(coupons))
  } catch {
    // ignore
  }
}

export function generateCouponId(): string {
  return 'cpn-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6)
}

export function validateCoupon(
  coupon: Coupon,
  orderTotal: number
): { valid: boolean; discount: number; message: string } {
  if (!coupon.isActive) return { valid: false, discount: 0, message: 'This coupon is not active.' }

  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return { valid: false, discount: 0, message: 'This coupon has expired.' }
  }

  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
    return { valid: false, discount: 0, message: 'This coupon has reached its usage limit.' }
  }

  if (orderTotal < coupon.minOrderAmount) {
    return {
      valid: false,
      discount: 0,
      message: `Minimum order of ৳${coupon.minOrderAmount} required.`,
    }
  }

  const discount =
    coupon.type === 'PERCENTAGE'
      ? Math.round((orderTotal * coupon.value) / 100)
      : coupon.value

  return { valid: true, discount, message: '' }
}
