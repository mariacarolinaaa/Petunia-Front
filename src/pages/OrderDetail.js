import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const DEFAULT_IMAGE = require("../../assets/logo.jpg");

export default function OrderDetailScreen({ route }) {
  const navigation = useNavigation();
  const { order } = route.params;

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderItem = ({ item }) => {
    const product = item.product || {};
    const imageSource =
      product.imageUrl && product.imageUrl !== "string"
        ? { uri: product.imageUrl }
        : DEFAULT_IMAGE;

    return (
      <View style={styles.itemContainer}>
        <Image
          source={imageSource}
          style={styles.productImage}
          resizeMode="cover"
        />
        <View style={styles.details}>
          <Text style={styles.description}>{product.description || "Sem descrição"}</Text>
          <Text style={styles.brandModel}>{product.brand} - {product.model}</Text>
          <Text style={styles.text}>Quantidade: {item.quantity ?? 0}</Text>
          <Text style={styles.text}>
            Preço unitário: R$ {item.convertedPriceAtPruchase?.toFixed(2)}
          </Text>
          <Text style={styles.text}>
            Total: R$ {(item.convertedPriceAtPruchase * (item.quantity ?? 0)).toFixed(2)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Detalhes do Pedido #{order.id}</Text>
      <Text style={styles.date}>Data: {formatDate(order.orderDate)}</Text>

      <FlatList
        data={order.items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        scrollEnabled={false}
        contentContainerStyle={{ paddingBottom: 16 }}
      />

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>
          Total do Pedido: R$ {order.totalConvertedPrice.toFixed(2)}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.buttonText}>Voltar para a Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f2f2f2",
    padding: 16,
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#A62422",
    textAlign: "center",
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: "#6c757d",
    textAlign: "center",
    marginBottom: 12,
  },
  itemContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
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
  brandModel: {
    fontSize: 14,
    color: "#6c757d",
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    color: "#495057",
  },
  totalContainer: {
    borderTopWidth: 1,
    borderTopColor: "#dee2e6",
    paddingTop: 12,
    marginTop: 12,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
    color: "#212529",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#A62422",
    paddingVertical: 14,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});
