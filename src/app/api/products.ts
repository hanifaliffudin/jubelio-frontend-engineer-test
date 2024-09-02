export interface Body {
  title: string;
  description: string;
  price: number;
}

export const fetchProducts = async (limit: number, page: number) => {
  const response = await fetch(
    `https://dummyjson.com/products?limit=${limit}&skip=${page * limit}`,
  );
  const data = await response.json();
  return data;
};

export const fetchDetailProduct = async (id: number) => {
  const response = await fetch(`https://dummyjson.com/products/${id}`);
  const data = await response.json();
  return data;
};

export const fetchSearchProducts = async (
  query: string,
  limit: number = 10,
  page: number = 1,
) => {
  const response = await fetch(
    `https://dummyjson.com/products/search?q=${query}&limit=${limit}&skip=${page * limit}`,
  );
  const data = await response.json();
  return data;
};

export const addProduct = async (body: Body) => {
  const response = await fetch("https://dummyjson.com/products/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return data;
};

export const editProduct = async (id: number, body: Body) => {
  const response = await fetch("https://dummyjson.com/products/" + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return data;
};

export const deleteProduct = async (id: number) => {
  const response = await fetch("https://dummyjson.com/products/" + id, {
    method: "DELETE",
  });
  const data = await response.json();
  return data;
};
