import React, { useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { createOrder } from "../services/OrderService";

const DEFAULT_IMAGE = require("../../assets/default_image.png");
const LOGO_IMAGE = require("../../assets/logo.jpg");

export default function CartScreen() {
  const navigation = useNavigation();
  const {
    cartItems,
    clearCart,
    removeFromCart,
    decreaseQuantity,
    increaseQuantity,
  } = useCart();
  const { token, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const total = cartItems.reduce(
    (sum, item) => sum + item.convertedPrice * item.quantity,
    0
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: "#000",
      },
      headerTitle: () => (
        <Image
          source={LOGO_IMAGE}
          style={{ width: 140, height: 40, resizeMode: "contain" }}
        />
      ),
      headerTitleAlign: "center",
       headerTintColor: "#fff", // cor do botão de voltar
      headerLeft: () => null,
      headerRight: () => (
        <TouchableOpacity style={{ marginRight: 16 }} onPress={logout}>
          <Ionicons name="log-out-outline" size={23} color="#fff" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, logout]);

  const handleFinishOrder = async () => {
    if (cartItems.length === 0) {
      Alert.alert("Carrinho vazio", "Adicione produtos antes de finalizar.");
      return;
    }

    try {
      setLoading(true);
      const response = await createOrder(cartItems, token);
      const order = response.order;
      clearCart();
      navigation.navigate("OrderConfirmation", { order });
    } catch (error) {
      Alert.alert(
        "Erro",
        "Não foi possível finalizar o pedido. Tente novamente mais tarde."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = (id) => {
    Alert.alert("Remover", "Tem certeza que deseja remover este item?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: () => removeFromCart(id),
      },
    ]);
  };

  const renderItem = ({ item }) => {
    const imageSource =
      item.imageUrl && item.imageUrl.trim() !== ""
        ? { uri: item.imageUrl }
        : DEFAULT_IMAGE;

    return (
      <View style={styles.item}>
        <Image source={imageSource} style={styles.productImage} />
        <View style={styles.details}>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.brand}>{item.brand}</Text>
          <Text style={styles.priceUnit}>
            Preço unitário: R$ {item.price.toFixed(2)}
          </Text>

          <View style={styles.quantityContainer}>
            <View style={styles.quantityControls}>
              <TouchableOpacity onPress={() => decreaseQuantity(item.id)}>
                <Ionicons
                  name="remove-circle-outline"
                  size={24}
                  color="#ff7675"
                />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{item.quantity}</Text>
              <TouchableOpacity onPress={() => increaseQuantity(item.id)}>
                <Ionicons
                  name="add-circle-outline"
                  size={24}
                  color="#55efc4"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => handleRemoveItem(item.id)}>
              <Ionicons name="trash-outline" size={22} color="#d63031" />
            </TouchableOpacity>
          </View>

          <Text style={styles.totalItemPrice}>
            Total: R$ {(item.convertedPrice * item.quantity).toFixed(2)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {cartItems.length === 0 ? (
        <Text style={styles.empty}>Seu carrinho está vazio.</Text>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
          />

          <View style={styles.footer}>
            <Text style={styles.total}>Total Geral: R$ {total.toFixed(2)}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={handleFinishOrder}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Finalizar Pedido</Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FAFAFA", // fundo branco suave
  },
  empty: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 32,
    color: "#999",
  },
  list: {
    paddingBottom: 16,
  },
  item: {
    flexDirection: "row",
    backgroundColor: "#EAEAEA", // cinza claro
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#ccc",
  },
  details: {
    flex: 1,
    justifyContent: "space-between",
  },
  description: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  brand: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  priceUnit: {
    fontSize: 14,
    color: "#444",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 8,
    color: "#333",
  },
  totalItemPrice: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "bold",
    color: "#C1272D",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 16,
    marginTop: 10,
  },
  total: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "right",
    color: "#000", // total em preto
  },
  button: {
    backgroundColor: "#C1272D",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
