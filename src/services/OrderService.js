import api from "./api";

export async function createOrder(productList, token) {
  try {
    const items = productList.map((product) => ({
      productId: product.id,
      quantity: product.quantity,
    }));

    console.log(token);

    const response = await api.post(
      "/ws/orders", //URL <PATH>
      { items }, //BODY
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      order: response.data,
      error: null,
    };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
}

export async function getOrders(token, currency = "BRL") {
  try {
    const response = await api.get(`/ws/orders/${currency}?size=100`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data.content);

    return {
      orders: response.data.content,
    };
  } catch (error) {
    return { error: error.message };
  }
}