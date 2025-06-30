import api from "./api";

export async function createOrder(productList, token) {
  try {
    const items = productList.map((product) => ({
      productId: product.id,
      quantity: product.quantity,
    }));

    const response = await api.post(
      "/ws/orders",
      { items },
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

export async function getOrders(token, currency = "BRL", pageToLoad = 0, size = 10) {
  try {
    const response = await api.get(`/ws/orders/${currency}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        size,
        page: pageToLoad,
      },
    });

    return {
      orders: response.data.content,
      error: null,
    };
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    return { error: error.message };
  }
}
