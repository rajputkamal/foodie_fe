export const MenuItemsTable = ({ items }) => {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {items.map((item) => (
          <tr key={item._id}>
            <td>{item.name}</td>
            <td>₹{item.price}</td>
            <td>
              <button>Edit</button>
              <button style={{ marginLeft: 8, color: "red" }}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
