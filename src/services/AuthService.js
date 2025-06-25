import api from "./api";

export async function register(user) {
  try {
    const response = await api.post("/auth/signup", user);
    // Retornar dados do backend para o frontend (ex: mensagem de sucesso, usuário criado...)
    return response.data;
  } catch (error) {
    // Retorna a mensagem de erro do backend para exibir no frontend
    return { error: error.response?.data?.message || error.message };
  }
}

export async function login(credentials) {
  try {
    const response = await api.post("/auth/signin", credentials);
    return response.data; // retorno esperado: { user: ..., token: ... }
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
}
