import { useState, useRef, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  Send,
  IndianRupee,
  Pizza,
  Coffee,
  IceCream,
  Soup,
  Croissant,
  Utensils,
  Beer,
  Beef,
  Flame,
  Leaf,
  Sandwich,
  Cake,
} from "lucide-react";
import Fuse from "fuse.js";

import OrderDrawer from "../components/OrderDrawer";
import ChatHeader from "../components/ChatHeader";
import UpSell from "../components/UpSell";
import UpsellDialog from "../components/ui/UpsellDialog";
import AddItemButton from "../components/ui/AddItemButton";
import Snackbar from "../components/ui/Snackbar";
import WelcomeScreen from "../components/ui/WelcomeScreen";
import {
  getRestaurantDetails,
  getMenuItemsByCategory,
} from "../api/restaurantApi";
import { searchMenuItems } from "../api/menuItemApi";
import { getUpsellRecommendations } from "../utils/getUpsellRecommendations";
import {
  getOrdersFromStorage,
  saveOrdersToStorage,
} from "../../utils/orderStorage";

import {
  normalizeText,
  removeCommonWords,
  getCategoryTypos,
  isCategoryIntent,
  isLikelySpecificItemSearch,
  getCategoryAliases,
} from "../../utils/restaurantChat";

const getCategoryIcon = (categoryName) => {
  const name = categoryName.toLowerCase();
  if (name.includes("pizza")) return <Pizza size={18} />;
  if (name.includes("coffee") || name.includes("tea") || name.includes("chai"))
    return <Coffee size={18} />;
  if (
    name.includes("ice cream") ||
    name.includes("dessert") ||
    name.includes("sweet")
  )
    return <IceCream size={18} />;
  if (name.includes("soup")) return <Soup size={18} />;
  if (
    name.includes("bakery") ||
    name.includes("pastry") ||
    name.includes("croissant")
  )
    return <Croissant size={18} />;
  if (
    name.includes("beer") ||
    name.includes("drink") ||
    name.includes("beverage")
  )
    return <Beer size={18} />;
  if (
    name.includes("meat") ||
    name.includes("chicken") ||
    name.includes("beef") ||
    name.includes("non-veg") ||
    name.includes("mutton")
  )
    return <Beef size={18} />;
  if (
    name.includes("spicy") ||
    name.includes("tandoor") ||
    name.includes("tikka")
  )
    return <Flame size={18} />;
  if (
    name.includes("veg") ||
    name.includes("salad") ||
    name.includes("healthy")
  )
    return <Leaf size={18} />;
  if (name.includes("sandwich") || name.includes("burger"))
    return <Sandwich size={18} />;
  if (name.includes("cake")) return <Cake size={18} />;
  return <Utensils size={18} />;
};

export default function RestaurantChatPage() {
  const { restaurantId, tableNo } = useParams();

  const [restaurantData, setRestaurantData] = useState({});
  const [restaurantCategories, setRestaurantCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [ordersHydrated, setOrdersHydrated] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [loadingRestaurant, setLoadingRestaurant] = useState(true);
  const [upsellShownFor, setUpsellShownFor] = useState(new Set());
  const [lastAddedItem, setLastAddedItem] = useState(null);

  // Minimum total items in cart before automatically showing upsell
  const MIN_ITEMS_FOR_UPSELL = 3;

  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Welcome! 👋 I'm here to help you discover something delicious today. What are you in the mood for?",
    },
  ]);

  const [showWelcomeOverlay, setShowWelcomeOverlay] = useState(
    messages.length <= 1,
  );

  const [input, setInput] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const chatRef = useRef(null);
  const inputRef = useRef(null);

  const normalizedCategories = useMemo(
    () =>
      restaurantCategories.map((category) => {
        const aliases = getCategoryAliases(category.name);
        return {
          ...category,
          searchName: normalizeText(category.name),
          aliases,
        };
      }),
    [restaurantCategories],
  );

  const fuse = useMemo(
    () =>
      new Fuse(normalizedCategories, {
        keys: ["searchName", "aliases"],
        // tighter threshold for category matching (reduce false positives)
        threshold: 0.2,
        includeScore: true,
        ignoreLocation: true,
        minMatchCharLength: 2,
        shouldSort: true,
      }),
    [normalizedCategories],
  );

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
    // Mobile-first viewport height fix for iOS Safari
    const setAppHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setAppHeight();

    window.addEventListener("resize", setAppHeight);
    window.addEventListener("orientationchange", setAppHeight);

    // Prevent zoom on double-tap
    let lastTouchEnd = 0;
    document.addEventListener("touchend", (event) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    });

    return () => {
      window.removeEventListener("resize", setAppHeight);
      window.removeEventListener("orientationchange", setAppHeight);
    };
  }, []);

  useEffect(() => {
    if (!restaurantId) return;
    getRestaurantDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurantId]);

  useEffect(() => {
    if (!restaurantId || !tableNo) return;

    const savedOrders = getOrdersFromStorage(restaurantId, tableNo);
    setOrders(savedOrders);
    setOrdersHydrated(true);
  }, [restaurantId, tableNo]);

  useEffect(() => {
    if (!restaurantId || !tableNo || !ordersHydrated) return;

    saveOrdersToStorage(restaurantId, tableNo, orders);
  }, [orders, restaurantId, tableNo, ordersHydrated]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      chatRef.current?.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 100);

    // if user interacts (messages grow), hide the welcome overlay
    if (messages.length > 1 && showWelcomeOverlay) {
      setShowWelcomeOverlay(false);
    }

    return () => clearTimeout(timeout);
  }, [messages, showWelcomeOverlay]);

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

  const findBestCategoryMatch = (query) => {
    const normalizedQuery = normalizeText(query);

    if (!normalizedQuery) return null;


    // exact category name match
    const exactMatch = normalizedCategories.find(
      (category) => category.searchName === normalizedQuery,
    );
    if (exactMatch) return exactMatch;

    // exact alias match (higher priority than fuzzy includes)
    const aliasExactMatch = normalizedCategories.find((category) =>
      (category.aliases || []).includes(normalizedQuery),
    );
    if (aliasExactMatch) return aliasExactMatch;

    // includes match: category name contains the query (e.g., 'cold tea')
    const includesMatch = normalizedCategories.find((category) =>
      category.searchName.includes(normalizedQuery),
    );
    if (includesMatch) return includesMatch;

    const reverseIncludesMatch = normalizedCategories.find((category) =>
      normalizedQuery.includes(category.searchName),
    );
    if (reverseIncludesMatch) return reverseIncludesMatch;

    const typoAliasMatch = normalizedCategories.find((category) => {
      const aliases = getCategoryTypos(category.searchName);
      return aliases.includes(normalizedQuery);
    });
    if (typoAliasMatch) return typoAliasMatch;

    const multiWordTypoMatch = normalizedCategories.find((category) => {
      const words = category.searchName.split(" ");
      return words.some((word) =>
        getCategoryTypos(word).includes(normalizedQuery),
      );
    });
    if (multiWordTypoMatch) return multiWordTypoMatch;

    const fuseResults = fuse.search(normalizedQuery);

    if (fuseResults.length > 0 && fuseResults[0].score <= 0.35) {
      return fuseResults[0].item;
    }

    return null;
  };

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

  const sendMessage = async (overrideText) => {
    const textToProcess =
      typeof overrideText === "string" ? overrideText : input;
    if (!textToProcess.trim()) return;

    const originalInput = textToProcess.trim();
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
      if (typeof overrideText !== "string") setInput("");
      return;
    }

    // Handle generic conversational dismissals from Quick Replies
    if (
      originalInput.includes("I'm good") ||
      originalInput.includes("No, thanks")
    ) {
      setMessages((prev) => [
        ...prev,
        { role: "user", text: originalInput },
        {
          role: "bot",
          text: "No problem! Let me know if you need anything else. 😊",
        },
      ]);
      if (typeof overrideText !== "string") setInput("");
      return;
    }

    setMessages((prev) => [
      ...prev,
      { role: "user", text: originalInput },
      { role: "bot", typing: true },
    ]);

    if (typeof overrideText !== "string") setInput("");

    try {
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

      const items = await searchMenuItems(restaurantId, cleanedText);

      if (items.length > 0) {
        replaceTypingMessage({
          role: "bot",
          text: `I found these for you 👇`,
          menu: items,
        });

        return;
      }

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

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  const addToOrder = async (item, options = {}) => {
    const { suppressUpsell = false } = options;

    // compute next orders synchronously from current `orders` state
    const existing = orders.find((i) => i.name === item.name);
    const nextOrders = existing
      ? orders.map((i) => (i.name === item.name ? { ...i, qty: i.qty + 1 } : i))
      : [...orders, { ...item, qty: 1 }];

    setOrders(nextOrders);
    setLastAddedItem(item);

    // Show snackbar notification
    setSnackbarMessage(`${item.name} added to cart! 🎉`);
    setSnackbarVisible(true);

    // --- UPSELL ENGINE LOGIC ---
    if (suppressUpsell) return;

    const totalQty = nextOrders.reduce((a, b) => a + b.qty, 0);

    // Only run upsell automatically after MIN_ITEMS_FOR_UPSELL items in cart
    if (totalQty < MIN_ITEMS_FOR_UPSELL) {
      return;
    }

    const itemId = item._id || item.name;

    // Prevent duplicate upsells for the same item
    if (upsellShownFor.has(itemId)) {
      return;
    }

    setUpsellShownFor((prev) => new Set(prev).add(itemId));

    // Get upsell recommendations
    const recommendations = await getUpsellRecommendations(
      item,
      restaurantId,
      restaurantCategories,
    );

    if (recommendations && recommendations.length > 0) {
      setTimeout(() => {
        addTypingMessage();
        setTimeout(() => {
          replaceTypingMessage({
            role: "bot",
            type: "upsell",
            triggerItem: item,
            recommendations: recommendations,
          });
        }, 800);
      }, 1200);
    }
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

  // only consider an upsell when it's the latest message (fresh upsell)
  const lastMsg = messages[messages.length - 1];
  const currentUpsellMessage = lastMsg?.type === "upsell" ? lastMsg : null;
  const upsellFor = currentUpsellMessage?.triggerItem;
  const upsellItems = currentUpsellMessage?.recommendations || [];

  const [activeUpsellId, setActiveUpsellId] = useState(null);

  useEffect(() => {
    if (currentUpsellMessage) {
      const id = currentUpsellMessage.triggerItem?._id || currentUpsellMessage.triggerItem?.name;
      if (id && id !== activeUpsellId) setActiveUpsellId(id);
    } else {
      setActiveUpsellId(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  const showOrdersWithUpsell = async () => {
    const totalQty = orders.reduce((a, b) => a + b.qty, 0);

    // If cart is empty or already large enough, just open orders
    if (totalQty === 0 || totalQty >= MIN_ITEMS_FOR_UPSELL) {
      setShowOrders(true);
      return;
    }

    const triggerItem = lastAddedItem || orders[orders.length - 1];
    if (!triggerItem) {
      setShowOrders(true);
      return;
    }

    const itemId = triggerItem._id || triggerItem.name;
    if (upsellShownFor.has(itemId)) {
      setShowOrders(true);
      return;
    }

    setUpsellShownFor((prev) => new Set(prev).add(itemId));

    const recommendations = await getUpsellRecommendations(
      triggerItem,
      restaurantId,
      restaurantCategories,
    );

    if (recommendations && recommendations.length > 0) {
      addTypingMessage();
      setTimeout(() => {
        replaceTypingMessage({
          role: "bot",
          type: "upsell",
          triggerItem: triggerItem,
          recommendations: recommendations,
        });
      }, 800);
      return;
    }

    setShowOrders(true);
  };

  const handleDismissUpsell = () => {
    setMessages((prev) =>
      prev.map((m) =>
        m.type === "upsell"
          ? {
              role: "bot",
              text: "No problem! Let me know if you need anything else. 😊",
            }
          : m,
      ),
    );
    setActiveUpsellId(null);
  };

  const handleAddFromUpsell = (item) => {
    // add to order and replace the upsell message with confirmation
    addToOrder(item, { suppressUpsell: true });
    setMessages((prev) =>
      prev.map((m) =>
        m.type === "upsell"
          ? {
              role: "bot",
              text: `Awesome! I've added ${item.name} to your order. 😋`,
            }
          : m,
      ),
    );
    setActiveUpsellId(null);
  };

  return (
    <div style={styles.page}>
      <ChatHeader
        cafeName={restaurantData?.name || "Restaurant"}
        tableNo={tableNo}
        handleShowOrders={showOrdersWithUpsell}
        ordersQty={ordersQty}
      />

      <div style={styles.middle}>
        <div style={styles.chat} ref={chatRef}>
          {loadingRestaurant && (
            <div style={styles.loadingText}>Loading restaurant...</div>
          )}

          {showWelcomeOverlay && (
            <div style={styles.welcomeOverlay}>
              <WelcomeScreen cafeName={restaurantData?.name || "Restaurant"} />
            </div>
          )}

          {messages.map((msg, i) => {
            // while welcome overlay is visible, skip rendering the initial bot welcome message
            if (showWelcomeOverlay && i === 0 && msg.role === "bot")
              return null;

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent:
                    msg.role === "user" ? "flex-end" : "flex-start",
                  marginBottom: 8,
                }}
              >
                <div
                  style={
                    msg.role === "user" ? styles.userBubble : styles.botBubble
                  }
                >
                  {msg.typing && (
                    <div style={styles.typing}>
                      <span style={styles.dot}></span>
                      <span style={styles.dot}></span>
                      <span style={styles.dot}></span>
                    </div>
                  )}

                  {msg.type === "upsell" ? msg.text : msg.text}

                  {/* Render Quick Replies if available */}
                  {msg.quickReplies && (
                    <div style={styles.quickReplyContainer}>
                      {msg.quickReplies.map((reply, idx) => {
                        const isObj = typeof reply === "object";
                        const label = isObj ? reply.label : reply;
                        return (
                          <button
                            key={idx}
                            style={styles.quickReplyBtn}
                            onClick={() => {
                              if (isObj && reply.action) {
                                reply.action();
                              } else {
                                sendMessage(label);
                              }
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.background = "rgb(239, 246, 255)";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = "#ffffff";
                            }}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {msg.menu && (
                    <div style={styles.menuContainer}>
                      {msg.menu.map((item, index) => (
                        <div key={item?._id || index} style={styles.menuCard}>
                          {item?.image && (
                            <img
                              src={item.image}
                              alt={item?.name || ""}
                              style={styles.menuImage}
                            />
                          )}

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={styles.menuTitleRow}>
                              <span style={styles.vegBadge()}>
                                {item.vegType === "veg" ? "🌱" : "🍗"}
                              </span>
                              <div style={styles.menuTitle}>{item.name}</div>
                            </div>

                            <div style={styles.menuDesc}>
                              {item.description ||
                                "Tasty and freshly prepared."}
                            </div>
                          </div>

                          <div style={styles.menuRight}>
                            <div style={styles.price}>
                              <IndianRupee size={12} />
                              {item.price}
                            </div>

                            <AddItemButton
                              isAdded={orders.some((o) => o.name === item.name)}
                              onClick={() => addToOrder(item)}
                              disabled={false}
                              size="sm"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div style={styles.categories}>
          {restaurantCategories.map((c) => (
            <button
              key={c._id}
              style={{
                ...styles.categoryBtn,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
              onClick={() => handleCategoryClick(c._id, c.name)}
            >
              {getCategoryIcon(c.name)}
              <span>{c.name}</span>
            </button>
          ))}
        </div>
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

      <Snackbar
        message={snackbarMessage}
        isVisible={snackbarVisible}
        onClose={() => setSnackbarVisible(false)}
        duration={2000}
        type="success"
      />
      <UpsellDialog
        open={Boolean(activeUpsellId) && upsellItems.length > 0}
        upsellFor={upsellFor}
        items={upsellItems}
        orders={orders}
        onAdd={handleAddFromUpsell}
        onDismiss={handleDismissUpsell}
      />
    </div>
  );
}

const styles = {
  page: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100vw",
    maxWidth: "100vw",
    height: "calc(var(--vh, 1vh) * 100)",
    display: "flex",
    flexDirection: "column",
    background: "#F5F6F8",
    fontFamily: "Inter, sans-serif",
    overflowX: "hidden",
    overflowY: "hidden",
  },

  middle: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: "calc(62px + env(safe-area-inset-bottom))",
    display: "flex",
    flexDirection: "column",
    width: "100vw",
    maxWidth: "100%",
    boxSizing: "border-box",
    overflow: "hidden",
    paddingTop: "60px",
    marginTop: 0,
  },

  chat: {
    flex: 1,
    overflowY: "auto",
    overflowX: "hidden",
    padding: "1.2rem",
    background: "#FFFFFF",
    minHeight: 0,
    WebkitOverflowScrolling: "touch",
    width: "100%",
    maxWidth: "100%",
    boxSizing: "border-box",
    position: "relative",
  },

  loadingText: {
    textAlign: "center",
    padding: "1rem",
    color: "#6b7280",
  },

  botBubble: {
    background: "#F1F3F5",
    padding: "1.2rem",
    borderRadius: "16px 16px 16px 6px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
    maxWidth: 420,
    width: "100%",
    marginBottom: "0.4rem",
    color: "#1F2937",
    position: "relative",
    fontSize: "1.25rem",
    lineHeight: 1.5,
    wordBreak: "break-word",
    overflowWrap: "anywhere",
  },

  userBubble: {
    background:
      "linear-gradient(135deg, rgb(37, 99, 235) 0%, rgb(79, 70, 229) 100%)",
    color: "white",
    padding: "1.2rem",
    borderRadius: "16px 16px 6px 16px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
    maxWidth: 420,
    // width: "100%",
    marginBottom: "0.4rem",
    position: "relative",
    fontSize: "1.25rem",
    lineHeight: 1.5,
    wordBreak: "break-word",
    overflowWrap: "anywhere",
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

  vegBadge: () => ({
    fontSize: "1rem",
    lineHeight: 1,
    flexShrink: 0,
    display: "inline-flex",
    alignItems: "center",
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
    width: "100%",
    minWidth: 0,
    boxSizing: "border-box",
  },

  menuImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    objectFit: "cover",
    marginRight: 10,
    flexShrink: 0,
  },

  menuTitle: {
    fontWeight: 600,
    color: "#374151",
    wordBreak: "break-word",
  },

  menuDesc: {
    fontSize: "1rem",
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
    background:
      "linear-gradient(135deg, rgb(37, 99, 235) 0%, rgb(79, 70, 229) 100%)",
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
    overflowY: "hidden",
    color: "#374151",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    flexShrink: 0,
    WebkitOverflowScrolling: "touch",
    width: "100%",
    maxWidth: "100%",
    boxSizing: "border-box",
  },

  categoryBtn: {
    border: "1px solid #E5E7EB",
    background: "#F7F7F8",
    padding: "0.75rem 1rem",
    borderRadius: 22,
    cursor: "pointer",
    fontSize: "1.25rem",
    whiteSpace: "nowrap",
    color: "#374151",
    fontWeight: 500,
  },

  inputBar: {
    position: "fixed",
    bottom: "env(safe-area-inset-bottom)",
    left: 0,
    right: 0,
    // zIndex: 99,
    display: "flex",
    gap: 10,
    padding: "1rem 1.2rem",
    borderTop: "1px solid #E6E8EB",
    background: "#FFFFFF",
    width: "100vw",
    maxWidth: "100%",
    boxSizing: "border-box",
  },

  input: {
    flex: 1,
    minWidth: 0,
    borderRadius: 24,
    border: "1px solid #E5E7EB",
    padding: "1rem 1.2rem",
    background: "#F3F4F6",
    fontSize: "1.25rem",
    color: "#374151",
    outline: "none",
    fontFamily: "Inter, sans-serif",
  },

  send: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "none",
    background:
      "linear-gradient(135deg, rgb(37, 99, 235) 0%, rgb(79, 70, 229) 100%)",
    color: "#fff",
    width: 42,
    height: 42,
    minWidth: 42,
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

  quickReplyContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "12px",
  },

  quickReplyBtn: {
    background: "#ffffff",
    border: "1.5px solid rgb(37, 99, 235)",
    color: "rgb(37, 99, 235)",
    padding: "8px 16px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 4px rgba(37, 99, 235, 0.15)",
    transition: "background 0.2s ease",
  },

  welcomeOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
    zIndex: 2,
  },

  welcomeCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "transparent",
  },

  welcomeRing: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  logoInner: {
    width: 80,
    height: 80,
    borderRadius: 999,
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  logoImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  logoInitials: {
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#4f46e5",
  },

  logoSvg: {
    width: 56,
    height: 56,
    display: "block",
  },

  welcomeText: {
    fontSize: "1.25rem",
    color: "#374151",
    textAlign: "center",
    maxWidth: 340,
    lineHeight: 1.4,
    pointerEvents: "auto",
  },
};
