export const fetchCarts = async (limit: number, page: number) => {
  const res = await fetch(
    `https://dummyjson.com/carts?limit=${limit}&skip=${page * limit}`,
  );
  const data = await res.json();
  return data;
};

export const addToCart = async (body: {
  userId: number;
  products: { id: number; quantity: number }[];
}) => {
  const res = await fetch("https://dummyjson.com/carts/add", {
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return data;
};
