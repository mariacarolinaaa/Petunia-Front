import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

// Imagem padrão local
const DEFAULT_IMAGE = require("../../assets/logo.jpg");

export default function OrderConfirmationScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  const { order } = route.params || {};

  // Debug
  console.log("Order recebido:", order);
  console.log("Itens do pedido:", order?.items);

  const hasValidOrder =
    order &&
    typeof order === "object" &&
    Array.isArray(order.items) &&
    order.items.length > 0;

  if (!hasValidOrder) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Erro</Text>
        <Text style={styles.subtitle}>
          Nenhuma informação de pedido encontrada.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.buttonText}>Voltar para a Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const formatPrice = (price) => {
    if (typeof price !== "number" || isNaN(price) || price <= 0) {
      return "R$ 0,00";
    }
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const isValidImageUrl = (url) => {
    return typeof url === "string" && url.trim() !== "" && url !== "string";
  };

  const renderItem = ({ item }) => {
    const product = item.product || {};
    const imageSource = isValidImageUrl(product.imageUrl)
      ? { uri: product.imageUrl }
      : DEFAULT_IMAGE;

    const unitPrice =
      item.convertedPriceAtPurchase > 0
        ? item.convertedPriceAtPurchase
        : item.priceAtPurchase;

    return (
      <View style={styles.item}>
        <Image source={imageSource} style={styles.productImage} />
        <View style={styles.details}>
          <Text style={styles.description}>
            {product.description || "Sem descrição"}
          </Text>
          <Text style={styles.brand}>
            {product.brand || "Marca desconhecida"}
          </Text>
          <Text style={styles.quantity}>
            Quantidade: {item.quantity ?? 0}
          </Text>
          <Text style={styles.price}>
            Preço unitário: {formatPrice(unitPrice)}
          </Text>
          <Text style={styles.totalPrice}>
            Total: {formatPrice(unitPrice * (item.quantity ?? 0))}
          </Text>
        </View>
      </View>
    );
  };

  const totalOrderPrice =
    order.totalConvertedPrice > 0
      ? order.totalConvertedPrice
      : order.totalPrice;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pedido Confirmado!</Text>
      <Text style={styles.subtitle}>Número do pedido: {order.id}</Text>
      <Text style={styles.subtitle}>Data: {order.orderDate}</Text>

      <FlatList
        data={order.items}
        keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />

      <Text style={styles.total}>
        Total do Pedido: {formatPrice(totalOrderPrice)}
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.buttonText}>Voltar para a Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fc",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#28a745",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#6c757d",
    marginBottom: 4,
  },
  list: {
    paddingVertical: 16,
  },
  item: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#e9ecef",
  },
  details: {
    flex: 1,
    justifyContent: "space-between",
  },
  description: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#343a40",
  },
  brand: {
    fontSize: 14,
    color: "#6c757d",
    marginBottom: 4,
  },
  quantity: {
    fontSize: 14,
    color: "#495057",
  },
  price: {
    fontSize: 14,
    color: "#495057",
  },
  totalPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#212529",
    marginTop: 2,
  },
  total: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
    color: "#343a40",
    marginTop: 16,
  },
  button: {
    backgroundColor: "#4e73df",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
    fontSize: 16,
  },
});
