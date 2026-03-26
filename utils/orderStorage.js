const ORDER_EXPIRY_MS = 2 * 60 * 60 * 1000; // 2 hours

export const getOrderStorageKey = (restaurantId, tableNo) => {
  return `orders_${restaurantId}_${tableNo}`;
};

export const saveOrdersToStorage = (restaurantId, tableNo, orders) => {
  if (!restaurantId || !tableNo) return;

  const key = getOrderStorageKey(restaurantId, tableNo);

  const payload = {
    orders,
    savedAt: Date.now(),
    expiresAt: Date.now() + ORDER_EXPIRY_MS,
  };

  localStorage.setItem(key, JSON.stringify(payload));
};

export const getOrdersFromStorage = (restaurantId, tableNo) => {
  if (!restaurantId || !tableNo) return [];

  const key = getOrderStorageKey(restaurantId, tableNo);
  const raw = localStorage.getItem(key);

  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);

    if (!parsed?.orders || !parsed?.expiresAt) {
      localStorage.removeItem(key);
      return [];
    }

    const isExpired = Date.now() > parsed.expiresAt;

    if (isExpired) {
      localStorage.removeItem(key);
      return [];
    }

    return parsed.orders;
  } catch (error) {
    console.log(error);
    localStorage.removeItem(key);
    return [];
  }
};

export const clearOrdersFromStorage = (restaurantId, tableNo) => {
  if (!restaurantId || !tableNo) return;

  const key = getOrderStorageKey(restaurantId, tableNo);
  localStorage.removeItem(key);
};
