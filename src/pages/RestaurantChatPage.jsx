import { useState, useRef, useEffect } from "react";
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
  const [restaurantData, setRestaurantData] = useState([]);
  const [restaurantCategories, setRestaurantCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);
  const [addedItem, setAddedItem] = useState(null);

  const fuse = new Fuse(restaurantCategories, {
    keys: ["name"],
    threshold: 0.5,
    includeScore: true,
    ignoreLocation: true,
    minMatchCharLength: 3,
  });

  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "👋 Welcome! I'm here to help you discover something delicious today.",
    },
  ]);

  const [input, setInput] = useState("");

  const chatRef = useRef(null);

  const getRestaurantDetail = async () => {
    const data = await getRestaurantDetails(restaurantId);
    setRestaurantData(data.restaurant);
    setRestaurantCategories(data.categories);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getRestaurantDetail();
  }, []);

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleCategoryClick = async (categoryId, categoryName) => {
    setMessages((prev) => [
      ...prev,
      { role: "user", text: `Show me ${categoryName}` },
    ]);

    setMessages((prev) => [...prev, { role: "bot", typing: true }]);

    try {
      const items = await getMenuItemsByCategory(restaurantId, categoryId);

      setMessages((prev) => {
        const updated = [...prev];
        updated.pop();

        return [
          ...updated,
          {
            role: "bot",
            text:
              items.length > 0
                ? `Here are some items from this category 🍽`
                : `No items found in this category 😕`,
            ...(items.length > 0 && { menu: items }),
          },
        ];
      });
    } catch (error) {
      console.error("Error while fetching menu items", error);
      setMessages((prev) => {
        const updated = [...prev];
        updated.pop();

        return [
          ...updated,
          { role: "bot", text: "❌ Failed to load menu. Try again." },
        ];
      });
    }
  };

  const sendMessage = async () => {
    if (!input) return;

    const userText = input.toLowerCase();
    const cleanedText = userText
      .replace(/\b(show|me|give|i|want|to|see|please)\b/g, "")
      .trim();

    setMessages((prev) => [
      ...prev,
      { role: "user", text: input },
      { role: "bot", typing: true },
    ]);

    setInput("");

    try {
      const result = fuse.search(cleanedText);

      let matchedCategory = null;
      matchedCategory = result.length > 0 ? result[0].item : null;
      if (result.length > 0 && result[0].score < 0.4) {
        matchedCategory = result[0].item;
      }

      if (matchedCategory) {
        const items = await getMenuItemsByCategory(
          restaurantId,
          matchedCategory._id,
        );

        return setMessages((prev) => {
          const updated = [...prev];
          updated.pop();

          return [
            ...updated,
            {
              role: "bot",
              text: `Here are some ${matchedCategory.name} 🍽`,
              menu: items,
            },
          ];
        });
      }

      const items = await searchMenuItems(restaurantId, cleanedText);

      if (items.length > 0) {
        return setMessages((prev) => {
          const updated = [...prev];
          updated.pop();

          return [
            ...updated,
            {
              role: "bot",
              text: `I found these for you 👇`,
              menu: items,
            },
          ];
        });
      }

      setMessages((prev) => {
        const updated = [...prev];
        updated.pop();

        return [
          ...updated,
          {
            role: "bot",
            text: "😕 I couldn’t find that. Try a category below 👇",
          },
        ];
      });
    } catch (error) {
      console.error("error", error);
      setMessages((prev) => {
        const updated = [...prev];
        updated.pop();

        return [...updated, { role: "bot", text: "❌ Something went wrong." }];
      });
    }
  };

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
        cafeName={restaurantData.name}
        tableNo={tableNo}
        handleShowOrders={() => setShowOrders(true)}
        ordersQty={ordersQty}
      />

      <div style={styles.chat} ref={chatRef}>
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
                    <div key={index} style={styles.menuCard}>
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
                          }}
                        />
                      )}
                      <div style={{ flex: 1 }}>
                        <div style={styles.menuTitleRow}>
                          <div style={styles.vegIndicator(item.vegType)}></div>
                          <div>{item.name}</div>
                        </div>
                        <div style={styles.menuDesc}>{item.description}</div>
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
          style={styles.input}
          placeholder="Ask about our menu..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button type="submit" style={styles.send} onClick={sendMessage}>
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
    padding: "20px 18px",
    background: "#FFFFFF",
  },

  botBubble: {
    background: "#F1F3F5",
    padding: "14px 16px",
    borderRadius: "16px 16px 16px 6px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
    maxWidth: 420,
    marginBottom: 12,
    color: "#1F2937",
    lineHeight: 1.4,
    position: "relative",
  },

  userBubble: {
    background: "#2F6FED",
    color: "white",
    padding: "14px 16px",
    borderRadius: "16px 16px 6px 16px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
    maxWidth: 420,
    marginBottom: 12,
    position: "relative",
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
  },

  vegIndicator: (type) => ({
    width: 12,
    height: 12,
    borderRadius: "50%",
    background:
      type === "veg" ? "#16a34a" : type === "non-veg" ? "#dc2626" : "#f59e0b",
  }),

  menuCard: {
    display: "flex",
    justifyContent: "space-between",
    padding: 16,
    background: "#fff",
    borderRadius: 12,
    border: "1px solid #e5e7eb",
  },

  menuTitle: {
    fontWeight: 600,
    marginBottom: 4,
    color: "#374151",
  },

  menuDesc: {
    fontSize: 13,
    color: "#6b7280",
  },

  menuRight: {
    textAlign: "right",
    color: "#374151",
  },

  price: {
    fontWeight: 600,
    marginBottom: 6,
    color: "#374151",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  addBtn: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    border: "none",
    background: "#2563eb",
    color: "#fff",
    fontSize: 18,
    cursor: "pointer",
  },

  categories: {
    display: "flex",
    gap: 10,
    padding: "12px 16px",
    borderTop: "1px solid #E6E8EB",
    background: "#FFFFFF",
    overflowX: "auto",
    color: "#374151",
  },

  categoryBtn: {
    border: "1px solid #E5E7EB",
    background: "#F7F7F8",
    padding: "8px 14px",
    borderRadius: 22,
    cursor: "pointer",
    fontSize: 14,
    whiteSpace: "nowrap",
    color: "#374151",
  },

  inputBar: {
    display: "flex",
    gap: 10,
    padding: 14,
    borderTop: "1px solid #E6E8EB",
    background: "#FFFFFF",
  },

  input: {
    flex: 1,
    borderRadius: 24,
    border: "1px solid #E5E7EB",
    padding: "12px 16px",
    background: "#F3F4F6",
    fontSize: 14,
    color: "#374151",
  },

  send: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "none",
    background: "#2F6FED",
    color: "#fff",
    width: 42,
    height: 42,
    borderRadius: "50%",
    fontSize: 18,
    cursor: "pointer",
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
