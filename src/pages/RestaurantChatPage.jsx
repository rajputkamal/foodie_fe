import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import {Send} from "lucide-react"

import OrderDrawer from "../components/OrderDrawer";
import ChatHeader from "../components/ChatHeader";

const categories = [
  { name: "Hot Drinks", icon: "☕" },
  { name: "Cold Drinks", icon: "🍨" },
  { name: "Food", icon: "🍽" },
  { name: "Popular", icon: "✨" },
];

const menu = [
  {
    name: "House Blend Latte",
    price: 4.5,
    description: "Signature espresso with steamed milk",
    tag: "Most Popular",
  },
  {
    name: "Matcha Oat Latte",
    price: 5.5,
    description: "Ceremonial grade matcha with oat milk",
    tag: "New",
  },
  {
    name: "Classic Americano",
    price: 3.5,
    description: "Rich espresso with hot water",
  },
];

export default function RestaurantChatPage() {
  const { restaurantId, tableNo } = useParams();
  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "👋 Welcome! I'm here to help you discover something delicious today.",
    },
  ]);

  const [input, setInput] = useState("");

  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleCategoryClick = (category) => {
    setMessages((prev) => [
      ...prev,
      { role: "user", text: `Show me ${category}` },
    ]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "🔎 Finding best menu for you..." },
      ]);
    }, 500);

    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "bot", menu }]);
    }, 1500);
  };

  const sendMessage = () => {
    if (!input) return;

    const userText = input;

    setMessages((prev) => [
      ...prev,
      { role: "user", text: userText },
      { role: "bot", typing: true },
    ]);

    setInput("");

    setTimeout(() => {
      setMessages((prev) => {
        const updated = [...prev];
        updated.pop(); // remove typing
        return [...updated, { role: "bot", text: "🤖 Checking our menu..." }];
      });
    }, 2000);

    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "bot", menu }]);
    }, 3500);
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
        cafeName="Bloom Cafe"
        tableNo={tableNo}
        handleShowOrders={() => setShowOrders(true)}
        ordersQty={ordersQty}
      />

      {/* CHAT AREA */}
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
                      <div>
                        <div style={styles.menuTitle}>{item.name}</div>
                        <div style={styles.menuDesc}>{item.description}</div>
                      </div>

                      <div style={styles.menuRight}>
                        <div style={styles.price}>${item.price}</div>
                        <button
                          onClick={() => addToOrder(item)}
                          style={styles.addBtn}
                        >
                          +
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

      {/* CATEGORY BAR */}
      <div style={styles.categories}>
        {categories.map((c) => (
          <button
            key={c.name}
            style={styles.categoryBtn}
            onClick={() => handleCategoryClick(c.name)}
          >
            {c.icon} {c.name}
          </button>
        ))}
      </div>

      {/* INPUT */}
      <div style={styles.inputBar}>
        <input
          style={styles.input}
          placeholder="Ask about our menu..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button style={styles.send} onClick={sendMessage}>
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
    border: "none",
    background: "#2F6FED",
    color: "#fff",
    width: 46,
    height: 46,
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
