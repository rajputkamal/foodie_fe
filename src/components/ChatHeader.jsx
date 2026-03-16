import { ShoppingCart } from "lucide-react";

const ChatHeader = ({ cafeName, tableNo, handleShowOrders, ordersQty }) => {
  return (
    <div style={styles.header}>
      <div style={styles.headerLeft}>
        <div style={styles.logo}>☕</div>

        <div>
          <div style={styles.title}>{cafeName}</div>
          <div style={styles.sub}>Table {tableNo}</div>
        </div>
      </div>

      <div style={styles.orderTab} onClick={handleShowOrders}>
        <ShoppingCart size={14} /> Orders {ordersQty}
      </div>
    </div>
  );
};

export default ChatHeader;

const styles = {
  header: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: 18,
    background: "#ffffff",
    borderBottom: "1px solid #E6E8EB",
    color: "#374151",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },

  orderTab: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "4px",
    marginLeft: "auto",
    background: "#2563eb",
    color: "white",
    padding: "8px 14px",
    borderRadius: 20,
    fontSize: 14,
    cursor: "pointer",
  },

  logo: {
    fontSize: 30,
  },

  title: {
    fontWeight: 600,
    fontSize: 18,
  },

  sub: {
    fontSize: 13,
    color: "#6b7280",
  },
};
