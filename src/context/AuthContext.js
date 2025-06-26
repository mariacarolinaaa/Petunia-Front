import { createContext, useContext, useState, useEffect } from "react";
import { login, register } from "../services/AuthService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator } from "react-native";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadCredentials() {
      setLoading(true);
      const credentials = await AsyncStorage.getItem("@APP_userCredentials");
      if (credentials) {
        const { email, password } = JSON.parse(credentials);
        await signIn({ email, password }, true);
      }
      setLoading(false);
    }
    loadCredentials();
  }, []);

  async function signIn(credentials, isInit) {
    const response = await login(credentials);

    if (response?.error) {
      return { error: response.error };
    }

    setUser(response.user);
    setToken(response.token);

    if (!isInit) {
      await AsyncStorage.setItem(
        "@APP_userCredentials",
        JSON.stringify(credentials)
      );
    }
  }

  async function signUp(credentials) {
    const response = await register(credentials);

    if (response?.error) {
      return { error: response.error };
    }
  }

  async function logout() {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem("@APP_userCredentials");
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ user, token, signIn, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);