import { UPSELL_RULES } from "../config/upsellRules";
import { getMenuItemsByCategory } from "../api/restaurantApi";

export const getUpsellRecommendations = async (item, restaurantId, categories) => {
  if (!item) return [];

  let categoryName = "";
  const category = categories.find(c => c._id === item.category);
  if (category) {
    categoryName = category.name.toLowerCase();
  } else {
    categoryName = item.name.toLowerCase();
  }

  let targetKeywords = [];
  for (const [key, targets] of Object.entries(UPSELL_RULES)) {
    if (categoryName.includes(key)) {
      targetKeywords = [...targetKeywords, ...targets];
    }
  }

  if (targetKeywords.length === 0) {
    if (/chai|coffee|tea|beverage|drink|coke|pepsi|shake/i.test(item.name)) {
        targetKeywords = ["snacks", "bites"];
    } else {
        targetKeywords = ["beverages", "drinks", "chai", "coffee"];
    }
  }

  const targetCategories = categories.filter(cat =>
    targetKeywords.some(keyword => cat.name.toLowerCase().includes(keyword))
  );

  if (targetCategories.length === 0) return [];

  try {
    const catId = targetCategories[0]._id;
    const items = await getMenuItemsByCategory(restaurantId, catId);
    
    const filteredItems = items.filter(i => (i._id || i.name) !== (item._id || item.name));
    
    const shuffled = filteredItems.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  } catch (err) {
    console.error("Failed to fetch upsell recommendations", err);
    return [];
  }
};