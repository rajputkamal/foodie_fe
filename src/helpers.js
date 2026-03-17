const STORAGE_KEY = "past_orders";

export const saveOrderToStorage = (orders) => {
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  const newOrder = {
    id: Date.now(),
    items: orders,
    createdAt: new Date().toISOString(),
  };

  const updated = [newOrder, ...existing];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const getValidPastOrders = () => {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  const TWO_HOURS = 2 * 60 * 60 * 1000;

  return data.filter(
    (order) => Date.now() - new Date(order.createdAt).getTime() < TWO_HOURS
  );
};
