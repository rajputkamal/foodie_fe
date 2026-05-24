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
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "1.2rem",
    background: "#ffffff",
    borderBottom: "1px solid #E6E8EB",
    color: "#374151",
    width: "100vw",
    maxWidth: "100%",
    boxSizing: "border-box",
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
    background: "linear-gradient(135deg, rgb(37, 99, 235) 0%, rgb(79, 70, 229) 100%)",
    color: "white",
    padding: "0.8rem 1.2rem",
    borderRadius: 20,
    fontSize: "1.2rem",
    cursor: "pointer",
  },

  logo: {
    fontSize: "2.4rem",
  },

  title: {
    fontWeight: 600,
    fontSize: "1.2rem",
  },

  sub: {
    fontSize: "1rem",
    color: "#6b7280",
  },
};
