export const UPSELL_RULES = {
  "chai": ["snacks", "bites", "quick bites", "bakery"],
  "coffee": ["snacks", "bakery", "desserts"],
  "tea": ["snacks", "bakery", "bites"],
  "beverages": ["snacks", "starters", "quick bites"],
  "drinks": ["snacks", "starters"],
  "snacks": ["beverages", "drinks", "chai", "coffee", "tea"],
  "starters": ["beverages", "drinks", "main course"],
  "desserts": ["beverages", "coffee"],
  "main course": ["beverages", "desserts", "breads"],
  "pizza": ["beverages", "drinks", "sides", "garlic bread"],
  "burger": ["beverages", "drinks", "fries", "sides"]
};