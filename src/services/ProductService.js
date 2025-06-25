import api from "./api";

// Buscar lista de produtos (com moeda alvo, ex: BRL, USD)
export async function getProducts(targetCurrency = "BRL") {
  try {
    const response = await api.get(`/products/${targetCurrency}?size=40`);
    return {
      products: response.data.content,
      error: null,
    };
  } catch (error) {
    return { error: error.message };
  }
}

// Buscar produto individual por ID (com moeda alvo)
export async function getProductById(id, targetCurrency = "BRL") {
  try {
    const response = await api.get(`/products/${id}/${targetCurrency}`);
    return {
      product: response.data,
      error: null,
    };
  } catch (error) {
    return { error: error.message };
  }
}

// Criar um novo produto (requer token de autenticação)
export async function createProduct(productToCreate, token) {
  try {
    const response = await api.post("/ws/products", productToCreate, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      product: response.data,
      error: null,
    };
  } catch (error) {
    return { error: error.message };
  }
}

// Atualizar um produto existente (requer token de autenticação)
export async function updateProduct(id, productToUpdate, token) {
  try {
    const response = await api.put(`/ws/products/${id}`, productToUpdate, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      product: response.data,
      error: null,
    };
  } catch (error) {
    return { error: error.message };
  }
}

// Deletar um produto (requer token de autenticação)
export async function deleteProduct(id, token) {
  try {
    await api.delete(`/ws/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {}; // sucesso
  } catch (error) {
    return { error: error.message };
  }
}
