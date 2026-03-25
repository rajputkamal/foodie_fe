import { useState, useRef, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Send, IndianRupee } from "lucide-react";
import Fuse from "fuse.js";

import OrderDrawer from "../components/OrderDrawer";
import ChatHeader from "../components/ChatHeader";
import {
  getRestaurantDetails,
  getMenuItemsByCategory,
} from "../api/restaurantApi";
import { searchMenuItems } from "../api/menuItemApi";

export default function RestaurantChatPage() {
  const { restaurantId, tableNo } = useParams();

  const [restaurantData, setRestaurantData] = useState({});
  const [restaurantCategories, setRestaurantCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);
  const [addedItem, setAddedItem] = useState(null);
  const [loadingRestaurant, setLoadingRestaurant] = useState(true);

  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "👋 Welcome! I'm here to help you discover something delicious today.",
    },
  ]);

  const [input, setInput] = useState("");

  const chatRef = useRef(null);
  const inputRef = useRef(null);

  /**
   * -----------------------------
   * Helpers
   * -----------------------------
   */
  const normalizeText = (text = "") =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, " ");

  const removeCommonWords = (text = "") =>
    text.replace(
      /\b(show|me|give|i|want|to|see|please|can|you|get|some|a|an|the|for|with|need|like|have)\b/g,
      "",
    );

  const getCategoryTypos = (word = "") => {
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

  const isCategoryIntent = (text = "") => {
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

  const isLikelySpecificItemSearch = (text = "") => {
    const normalized = normalizeText(text);
    const words = normalized.split(" ").filter(Boolean);

    // Examples:
    // "idli", "masala dosa", "veg burger"
    return words.length > 0 && words.length <= 3;
  };

  /**
   * -----------------------------
   * Normalized Categories + Fuse
   * -----------------------------
   */
  const normalizedCategories = useMemo(
    () =>
      restaurantCategories.map((category) => ({
        ...category,
        searchName: normalizeText(category.name),
      })),
    [restaurantCategories],
  );

  const fuse = useMemo(
    () =>
      new Fuse(normalizedCategories, {
        keys: ["searchName"],
        threshold: 0.35,
        includeScore: true,
        ignoreLocation: true,
        minMatchCharLength: 2,
        shouldSort: true,
      }),
    [normalizedCategories],
  );

  /**
   * -----------------------------
   * Fetch Restaurant Data
   * -----------------------------
   */
  const getRestaurantDetail = async () => {
    try {
      setLoadingRestaurant(true);
      const data = await getRestaurantDetails(restaurantId);

      setRestaurantData(data?.restaurant || {});
      setRestaurantCategories(data?.categories || []);
    } catch (error) {
      console.error("Failed to fetch restaurant details", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "❌ Failed to load restaurant details. Please refresh the page.",
        },
      ]);
    } finally {
      setLoadingRestaurant(false);
    }
  };

  useEffect(() => {
    if (!restaurantId) return;
    getRestaurantDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurantId]);

  /**
   * -----------------------------
   * Auto Scroll Chat
   * -----------------------------
   */
  useEffect(() => {
    const timeout = setTimeout(() => {
      chatRef.current?.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 100);

    return () => clearTimeout(timeout);
  }, [messages]);

  /**
   * -----------------------------
   * Safe Typing Bubble Helpers
   * -----------------------------
   */
  const addTypingMessage = () => {
    setMessages((prev) => [...prev, { role: "bot", typing: true }]);
  };

  const replaceTypingMessage = (newMessage) => {
    setMessages((prev) => {
      const updated = [...prev];
      const lastTypingIndex = [...updated]
        .reverse()
        .findIndex((msg) => msg.typing);

      if (lastTypingIndex !== -1) {
        updated.splice(updated.length - 1 - lastTypingIndex, 1);
      }

      return [...updated, newMessage];
    });
  };

  /**
   * -----------------------------
   * Category Matching Logic
   * -----------------------------
   */
  const findBestCategoryMatch = (query) => {
    const normalizedQuery = normalizeText(query);

    if (!normalizedQuery) return null;

    // 1. Exact category match
    const exactMatch = normalizedCategories.find(
      (category) => category.searchName === normalizedQuery,
    );
    if (exactMatch) return exactMatch;

    // 2. Direct includes category match
    const includesMatch = normalizedCategories.find((category) =>
      category.searchName.includes(normalizedQuery),
    );
    if (includesMatch) return includesMatch;

    // 3. Reverse includes match
    const reverseIncludesMatch = normalizedCategories.find((category) =>
      normalizedQuery.includes(category.searchName),
    );
    if (reverseIncludesMatch) return reverseIncludesMatch;

    // 4. Known typo aliases
    const typoAliasMatch = normalizedCategories.find((category) => {
      const aliases = getCategoryTypos(category.searchName);
      return aliases.includes(normalizedQuery);
    });
    if (typoAliasMatch) return typoAliasMatch;

    // 5. Word-by-word typo alias check (for multi-word categories)
    const multiWordTypoMatch = normalizedCategories.find((category) => {
      const words = category.searchName.split(" ");
      return words.some((word) =>
        getCategoryTypos(word).includes(normalizedQuery),
      );
    });
    if (multiWordTypoMatch) return multiWordTypoMatch;

    // 6. Strict Fuse fuzzy match
    const fuseResults = fuse.search(normalizedQuery);

    if (fuseResults.length > 0 && fuseResults[0].score <= 0.35) {
      return fuseResults[0].item;
    }

    return null;
  };

  /**
   * -----------------------------
   * Handle Category Button Click
   * -----------------------------
   */
  const handleCategoryClick = async (categoryId, categoryName) => {
    setMessages((prev) => [
      ...prev,
      { role: "user", text: `Show me ${categoryName}` },
    ]);

    addTypingMessage();

    try {
      const items = await getMenuItemsByCategory(restaurantId, categoryId);

      replaceTypingMessage({
        role: "bot",
        text:
          items.length > 0
            ? `Here are some items from ${categoryName} 🍽`
            : `No items found in ${categoryName} 😕`,
        ...(items.length > 0 && { menu: items }),
      });
    } catch (error) {
      console.error("Error while fetching menu items", error);

      replaceTypingMessage({
        role: "bot",
        text: "❌ Failed to load menu. Try again.",
      });
    }
  };

  /**
   * -----------------------------
   * Handle Chat Send
   * -----------------------------
   */
  const sendMessage = async () => {
    if (!input.trim()) return;

    const originalInput = input.trim();
    const cleanedText = normalizeText(removeCommonWords(originalInput));
    const categoryIntent = isCategoryIntent(originalInput);
    const likelySpecificItem = isLikelySpecificItemSearch(cleanedText);

    if (!cleanedText) {
      setMessages((prev) => [
        ...prev,
        { role: "user", text: originalInput },
        {
          role: "bot",
          text: "😄 Tell me what you’d like to eat or drink!",
        },
      ]);
      setInput("");
      return;
    }

    setMessages((prev) => [
      ...prev,
      { role: "user", text: originalInput },
      { role: "bot", typing: true },
    ]);

    setInput("");

    try {
      /**
       * -----------------------------
       * CASE 1:
       * If user likely asked for a specific item,
       * search MENU ITEMS first
       * -----------------------------
       */
      if (!categoryIntent && likelySpecificItem) {
        const itemResults = await searchMenuItems(restaurantId, cleanedText);

        if (itemResults.length > 0) {
          replaceTypingMessage({
            role: "bot",
            text: `I found these for you 👇`,
            menu: itemResults,
          });
          return;
        }
      }

      /**
       * -----------------------------
       * CASE 2:
       * Try category matching
       * -----------------------------
       */
      const matchedCategory = findBestCategoryMatch(cleanedText);

      if (matchedCategory) {
        const items = await getMenuItemsByCategory(
          restaurantId,
          matchedCategory._id,
        );

        replaceTypingMessage({
          role: "bot",
          text:
            items.length > 0
              ? `Here are some ${matchedCategory.name} 🍽`
              : `No items found in ${matchedCategory.name} 😕`,
          ...(items.length > 0 && { menu: items }),
        });

        return;
      }

      /**
       * -----------------------------
       * CASE 3:
       * Fallback to menu item search
       * -----------------------------
       */
      const items = await searchMenuItems(restaurantId, cleanedText);

      if (items.length > 0) {
        replaceTypingMessage({
          role: "bot",
          text: `I found these for you 👇`,
          menu: items,
        });

        return;
      }

      /**
       * -----------------------------
       * CASE 4:
       * Final fallback
       * -----------------------------
       */
      replaceTypingMessage({
        role: "bot",
        text: "😕 I couldn’t find that. Try a category below 👇",
      });
    } catch (error) {
      console.error("Error while searching menu/category", error);

      replaceTypingMessage({
        role: "bot",
        text: "❌ Something went wrong. Please try again.",
      });
    }
  };

  /**
   * -----------------------------
   * Enter Key Support
   * -----------------------------
   */
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  /**
   * -----------------------------
   * Order Logic
   * -----------------------------
   */
  const addToOrder = (item) => {
    setOrders((prev) => {
      const existing = prev.find((i) => i.name === item.name);

      if (existing) {
        return prev.map((i) =>
          i.name === item.name ? { ...i, qty: i.qty + 1 } : i,
        );
      }

      return [...prev, { ...item, qty: 1 }];
    });

    setAddedItem(item.name);

    setTimeout(() => {
      setAddedItem(null);
    }, 1000);
  };

  const increaseQty = (name) => {
    setOrders((prev) =>
      prev.map((i) => (i.name === name ? { ...i, qty: i.qty + 1 } : i)),
    );
  };

  const decreaseQty = (name) => {
    setOrders((prev) =>
      prev
        .map((i) => (i.name === name ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0),
    );
  };

  const ordersQty = orders.reduce((a, b) => a + b.qty, 0);

  return (
    <div style={styles.page}>
      <ChatHeader
        cafeName={restaurantData?.name || "Restaurant"}
        tableNo={tableNo}
        handleShowOrders={() => setShowOrders(true)}
        ordersQty={ordersQty}
      />

      <div style={styles.chat} ref={chatRef}>
        {loadingRestaurant && (
          <div
            style={{ textAlign: "center", padding: "1rem", color: "#6b7280" }}
          >
            Loading restaurant...
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              marginBottom: 8,
            }}
          >
            <div
              style={msg.role === "user" ? styles.userBubble : styles.botBubble}
            >
              {msg.typing && (
                <div style={styles.typing}>
                  <span style={styles.dot}></span>
                  <span style={styles.dot}></span>
                  <span style={styles.dot}></span>
                </div>
              )}

              {msg.text}

              {msg.text && <div />}

              {msg.menu && (
                <div style={styles.menuContainer}>
                  {msg.menu.map((item, index) => (
                    <div key={item?._id || index} style={styles.menuCard}>
                      {item?.image && (
                        <img
                          src={
                            item.image ||
                            "https://source.unsplash.com/100x100/?food"
                          }
                          alt={item?.name || ""}
                          style={{
                            width: 60,
                            height: 60,
                            borderRadius: 8,
                            objectFit: "cover",
                            marginRight: 10,
                            flexShrink: 0,
                          }}
                        />
                      )}

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={styles.menuTitleRow}>
                          <div style={styles.vegIndicator(item.vegType)}></div>
                          <div style={styles.menuTitle}>{item.name}</div>
                        </div>

                        <div style={styles.menuDesc}>
                          {item.description || "Tasty and freshly prepared."}
                        </div>
                      </div>

                      <div style={styles.menuRight}>
                        <div style={styles.price}>
                          <IndianRupee size={12} />
                          {item.price}
                        </div>

                        <button
                          onClick={() => addToOrder(item)}
                          style={{
                            ...styles.addBtn,
                            background:
                              addedItem === item.name
                                ? "#16a34a"
                                : styles.addBtn.background,
                          }}
                        >
                          {addedItem === item.name ? "✓" : "+"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={styles.categories}>
        {restaurantCategories.map((c) => (
          <button
            key={c._id}
            style={styles.categoryBtn}
            onClick={() => handleCategoryClick(c._id, c.name)}
          >
            🍽 {c.name}
          </button>
        ))}
      </div>

      <div style={styles.inputBar}>
        <input
          ref={inputRef}
          style={styles.input}
          placeholder="Ask about our menu..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button type="button" style={styles.send} onClick={sendMessage}>
          <Send size={18} />
        </button>
      </div>

      {showOrders && (
        <OrderDrawer
          orders={orders}
          onCloseDrawer={() => setShowOrders(false)}
          increaseQty={increaseQty}
          decreaseQty={decreaseQty}
        />
      )}
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#F5F6F8",
    fontFamily: "Inter, sans-serif",
  },

  chat: {
    flex: 1,
    overflowY: "auto",
    padding: "1.2rem",
    background: "#FFFFFF",
  },

  botBubble: {
    background: "#F1F3F5",
    padding: "1.2rem",
    borderRadius: "16px 16px 16px 6px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
    maxWidth: 420,
    marginBottom: "0.4rem",
    color: "#1F2937",
    position: "relative",
    fontSize: "1.05rem",
    lineHeight: 1.5,
  },

  userBubble: {
    background: "linear-gradient(135deg, rgb(37, 99, 235) 0%, rgb(79, 70, 229) 100%)",
    color: "white",
    padding: "1.2rem",
    borderRadius: "16px 16px 6px 16px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
    maxWidth: 420,
    marginBottom: "0.4rem",
    position: "relative",
    fontSize: "1.05rem",
    lineHeight: 1.5,
  },

  menuContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    marginTop: 10,
  },

  menuTitleRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },

  vegIndicator: (type) => ({
    width: 12,
    height: 12,
    borderRadius: "50%",
    flexShrink: 0,
    background:
      type === "veg" ? "#16a34a" : type === "non-veg" ? "#dc2626" : "#f59e0b",
  }),

  menuCard: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    padding: "1rem",
    background: "#fff",
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    alignItems: "flex-start",
  },

  menuTitle: {
    fontWeight: 600,
    color: "#374151",
    wordBreak: "break-word",
  },

  menuDesc: {
    fontSize: "0.95rem",
    color: "#6b7280",
    lineHeight: 1.4,
    wordBreak: "break-word",
  },

  menuRight: {
    textAlign: "right",
    color: "#374151",
    minWidth: 60,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },

  price: {
    fontWeight: 600,
    color: "#374151",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 2,
  },

  addBtn: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    border: "none",
    background: "linear-gradient(135deg, rgb(37, 99, 235) 0%, rgb(79, 70, 229) 100%)",
    color: "#fff",
    fontSize: "1.2rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "0.2s ease",
  },

  categories: {
    display: "flex",
    gap: 8,
    padding: "1rem 1.2rem",
    borderTop: "1px solid #E6E8EB",
    background: "#FFFFFF",
    overflowX: "auto",
    color: "#374151",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  },

  categoryBtn: {
    border: "1px solid #E5E7EB",
    background: "#F7F7F8",
    padding: "0.75rem 1rem",
    borderRadius: 22,
    cursor: "pointer",
    fontSize: "0.95rem",
    whiteSpace: "nowrap",
    color: "#374151",
    fontWeight: 500,
  },

  inputBar: {
    display: "flex",
    gap: 10,
    padding: "1rem 1.2rem",
    borderTop: "1px solid #E6E8EB",
    background: "#FFFFFF",
  },

  input: {
    flex: 1,
    borderRadius: 24,
    border: "1px solid #E5E7EB",
    padding: "1rem 1.2rem",
    background: "#F3F4F6",
    fontSize: "1rem",
    color: "#374151",
    outline: "none",
  },

  send: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "none",
    background: "linear-gradient(135deg, rgb(37, 99, 235) 0%, rgb(79, 70, 229) 100%)",
    color: "#fff",
    width: 42,
    height: 42,
    borderRadius: "50%",
    cursor: "pointer",
    flexShrink: 0,
  },

  typing: {
    display: "flex",
    gap: 4,
    padding: "4px 0",
  },

  dot: {
    width: 6,
    height: 6,
    background: "#6b7280",
    borderRadius: "50%",
    animation: "blink 1.4s infinite both",
  },
};
