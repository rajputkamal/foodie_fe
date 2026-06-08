export const normalizeText = (text = "") =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ");

export const removeCommonWords = (text = "") =>
  text.replace(
    /\b(show|me|give|i|want|to|see|please|can|you|get|some|a|an|the|for|with|need|like|have)\b/g,
    "",
  );

export const getCategoryTypos = (word = "") => {
  const typoMap = {
    coffee: ["cofee", "cofe", "coffe", "coffie"],
    tea: ["tee", "te"],
    burger: ["burgr", "buger", "burgar"],
    pizza: ["piza", "pizzza", "pissa"],
    biryani: ["biriyani", "biryan", "birani"],
    noodles: ["nodles", "noodls", "nudles"],
    sandwich: ["sandwitch", "sandwhich", "sandwiche"],
    fries: ["frys", "frise", "friess"],
    pasta: ["psta", "pastaa"],
    momos: ["momoss", "momo"],
    dosa: ["dosaa", "dhosa"],
    idli: ["idly", "idlee"],
    shake: ["shak", "shke"],
    juice: ["juce", "jucie"],
    rice: ["rce", "rics"],
    soup: ["soop", "suop"],
    cake: ["cak", "caake"],
    icecream: ["ice cream", "icecrem", "icecreem"],
  };

  return typoMap[word] || [];
};

export const isCategoryIntent = (text = "") => {
  const categoryKeywords = [
    "show",
    "category",
    "categories",
    "menu",
    "options",
    "items",
    "varieties",
    "type",
    "types",
    "available",
    "list",
    "all",
  ];

  return categoryKeywords.some((word) => normalizeText(text).includes(word));
};

export const isLikelySpecificItemSearch = (text = "") => {
  const normalized = normalizeText(text);
  const words = normalized.split(" ").filter(Boolean);
  return words.length > 0 && words.length <= 3;
};

export const getCategoryAliases = (categoryName = "") => {
  const name = categoryName.toLowerCase();
  const aliases = [];

  if (name.includes("beverage") || name.includes("drink")) {
    aliases.push("tea", "chai", "coffee", "juice", "shake", "smoothie", "soda", "iced tea");
  }

  if (name.includes("tea")) {
    aliases.push("chai", "masala chai", "green tea", "iced tea");
  }

  if (name.includes("coffee")) {
    aliases.push("latte", "espresso", "cappuccino", "americano");
  }

  if (name.includes("dessert") || name.includes("sweet") || name.includes("ice cream")) {
    aliases.push("cake", "ice cream", "brownie", "dessert");
  }

  if (name.includes("bakery") || name.includes("pastry")) {
    aliases.push("bread", "cake", "croissant", "pastry");
  }

  if (name.includes("pizza")) aliases.push("pizza");
  if (name.includes("burger")) aliases.push("burger", "bun");
  if (name.includes("biryani")) aliases.push("biryani", "rice");

  // remove duplicates and normalize
  return Array.from(new Set(aliases.map((a) => normalizeText(a))));
};
