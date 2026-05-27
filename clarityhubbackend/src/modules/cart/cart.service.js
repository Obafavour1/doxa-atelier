export const formatCartResponse = (user) => {
  return user.cartItems
    .map((item) => {
      if (item.productId && typeof item.productId === "object") {
        const product = item.productId.toJSON ? item.productId.toJSON() : item.productId;
        return { ...product, quantity: item.quantity };
      }
      return item;
    })
    .filter((item) => item._id);
};
