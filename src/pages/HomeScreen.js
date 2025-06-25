import React, { useCallback, useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import Footer from "../components/footer";
import { getProducts } from "../services/ProductService";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function HomeScreen() {
  const navigation = useNavigation();
  const { logout, user } = useAuth();
  const { cartCount } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const DEFAULT_IMAGE = require("../../assets/logo.jpg");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts("BRL");
      setProducts(Array.isArray(response.products) ? response.products : []);
    } catch (error) {
      Alert.alert("Erro ao carregar produtos", error?.message || "Erro desconhecido");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: "#000", // fundo preto
      },
      headerTitle: () => (
        <Image
          source={require("../../assets/logo.jpg")} // logo central
          style={{ width: 140, height: 40, resizeMode: "contain" }}
        />
      ),
      headerTitleAlign: "center",
      headerLeft: () => (
        <TouchableOpacity style={{ marginLeft: 16, }} onPress={() => navigation.navigate("Cart")}>
          <Ionicons name="cart-outline" size={23} color="#fff" />
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount > 9 ? "9+" : cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity style={{ marginRight: 16 }} onPress={logout}>
          <Ionicons name="log-out-outline" size={23} color="#fff" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, logout, cartCount]);

  const renderItem = ({ item }) => {
    const imageSource =
      item.imageUrl && item.imageUrl.trim() !== ""
        ? { uri: item.imageUrl }
        : DEFAULT_IMAGE;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("ProductDetail", { id: item.id })}
      >
        <Image source={imageSource} style={styles.productImage} />
        <Text style={styles.productName}>{item.description || "Sem descrição"}</Text>
        <Text style={styles.productPrice}>
          {item.convertedPrice ? `R$ ${item.convertedPrice.toFixed(2)}` : "Preço indisponível"}
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A62422" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Sale")}
      >
        <Text style={styles.buttonText}>SALE PTN</Text>
      </TouchableOpacity>

      {user?.type === "Admin" && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate("ProductForm")}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
    flex: 1,
    marginHorizontal: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  productImage: {
    width: "100%",
    height: 120,
    borderRadius: 10,
    marginBottom: 15,
    resizeMode: "cover",
    backgroundColor: "#f8f9f1",
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
    textAlign: "center",
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#A62422",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadge: {
    position: "absolute",
    top: -4,
    right: -10,
    backgroundColor: "#1E1E1E",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    zIndex: 10,
  },
  cartBadgeText: {
    color: "#fff", // corrigido para branco
    fontSize: 12,
    fontWeight: "700",
  },
  button: {
    backgroundColor: "#A62422",
    paddingVertical: 24,
    paddingHorizontal: 32,
    margin: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    fontFamily: "Notable",
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 80,
    backgroundColor: "#A62422",
    width: 46,
    height: 46,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
