import { X, Minus, Plus, ShoppingCart, IndianRupee } from "lucide-react";

const OrderDrawer = ({ orders, onCloseDrawer, decreaseQty, increaseQty }) => {
  const total = orders.reduce((t, i) => t + i.price * i.qty, 0).toFixed(2);

  return (
    <div style={styles.drawer}>
      <div style={styles.drawerHeader}>
        <div style={styles.headerLeft}>
          <ShoppingCart size={18} />
          <span>Your Order</span>
        </div>

        <button style={styles.closeBtn} onClick={onCloseDrawer}>
          <X size={22} color="#374151" />
        </button>
      </div>

      <div style={styles.separator}></div>

      <div style={styles.drawerItems}>
        {orders.length === 0 && (
          <div style={styles.empty}>No items added yet</div>
        )}

        {orders.map((item, index) => (
          <div key={item.name}>
            <div style={styles.orderItem}>
              <div>
                <div style={styles.itemTitle}>{item.name}</div>
                <div style={styles.itemPrice}>
                   <IndianRupee size={12} />
                  {item.price}</div>
              </div>

              <div style={styles.qtyControls}>
                <button
                  onClick={() => decreaseQty(item.name)}
                  style={styles.qtyBtn}
                >
                  <Minus size={16} color="#374151" />
                </button>

                <span style={styles.qty}>{item.qty}</span>

                <button
                  onClick={() => increaseQty(item.name)}
                  style={styles.qtyBtn}
                >
                  <Plus size={16} color="#374151" />
                </button>
              </div>
            </div>

            {index !== orders.length - 1 && (
              <div style={styles.itemSeparator}></div>
            )}
          </div>
        ))}
      </div>

      <div style={styles.separator}></div>

      <div style={styles.drawerFooter}>
        <div style={styles.totalRow}>
          <span>Total</span>
          
          <span style={styles.totalPrice}>
             <IndianRupee size={12} />
            {total}</span>
        </div>

        <button style={styles.placeBtn}>Place Order</button>
      </div>
    </div>
  );
};

export default OrderDrawer;

const styles = {
  drawer: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    background: "white",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    boxShadow: "0 -8px 30px rgba(0,0,0,0.12)",
    padding: 20,
    maxHeight: "55vh",
    display: "flex",
    flexDirection: "column",
    color: "#374151",
  },

  drawerHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  headerLeft: {
    display: "flex",
    gap: 8,
    alignItems: "center",
    fontWeight: 600,
    fontSize: 16,
  },

  closeBtn: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
  },

  separator: {
    height: 1,
    background: "#E5E7EB",
    margin: "8px 0 12px 0",
  },

  itemSeparator: {
    height: 1,
    background: "#F1F3F5",
    margin: "10px 0",
  },

  drawerItems: {
    flex: 1,
    overflowY: "auto",
  },

  empty: {
    color: "#6b7280",
    textAlign: "center",
  },

  orderItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  itemTitle: {
    fontWeight: 500,
  },

  itemPrice: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 2,
  },

  qtyControls: {
    display: "flex",
    gap: 10,
    alignItems: "center",
  },

  qty: {
    fontWeight: 500,
    minWidth: 20,
    textAlign: "center",
  },

  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: "50%",
    border: "1px solid #E5E7EB",
    background: "#F9FAFB",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  drawerFooter: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },

  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    fontWeight: 500,
    fontSize: 15,
  },

  totalPrice: {
    fontWeight: 600,
  },

  placeBtn: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "12px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 15,
  },
};
