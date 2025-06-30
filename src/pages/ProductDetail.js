import React, { useState, useCallback, useLayoutEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { getProductById, deleteProduct } from "../services/ProductService";
import { useFocusEffect } from "@react-navigation/native";

export default function ProductDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const { cartItems, addToCart } = useCart();
  const { user, token, logout } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  const DEFAULT_IMAGE = require("../../assets/logo.jpg");

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await getProductById(id);
      setProduct(response.product);
    } catch (error) {
      Alert.alert("Erro ao carregar produto", error?.message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProduct();
    }, [id])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: "#000",
      },
      headerTitle: () => (
        <Image
          source={require("../../assets/logo.jpg")}
          style={{ width: 140, height: 40, resizeMode: "contain" }}
        />
      ),
      headerTitleAlign: "center",
      headerTintColor: "#fff", // cor do botão de voltar
    });
  }, [navigation]);

  const handleAddToCart = () => {
    addToCart(product);
    Alert.alert("Carrinho", "Produto adicionado com sucesso!");
  };

  const handleEdit = () => {
    navigation.navigate("ProductForm", { product });
  };

  const handleDelete = () => {
    Alert.alert("Excluir produto", "Tem certeza que deseja excluir este produto?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteProduct(id, token);
            Alert.alert("Sucesso", "Produto excluído.");
            navigation.goBack();
          } catch (error) {
            Alert.alert("Erro", error?.message || "Erro ao excluir.");
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A62422" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.emptyText}>Produto não encontrado.</Text>
      </View>
    );
  }

  const imageSource =
    product.imageUrl && product.imageUrl.trim() !== ""
      ? { uri: product.imageUrl }
      : DEFAULT_IMAGE;

  return (
    <View style={styles.pageContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={imageSource} style={styles.productImage} />
        <Text style={styles.productDescription}>{product.description}</Text>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Marca:</Text>
          <Text style={styles.value}>{product.brand}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Modelo:</Text>
          <Text style={styles.value}>{product.model}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Preço:</Text>
          <Text style={styles.price}>
            R$ {product.convertedPrice?.toFixed(2) || "Indisponível"}
          </Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Estoque:</Text>
          <Text style={styles.value}>{product.stock}</Text>
        </View>
      </ScrollView>

      {user?.type === "Admin" ? (
        <View style={styles.adminActions}>
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Excluir</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
          <Text style={styles.addButtonText}>Adicionar ao carrinho</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  container: {
    padding: 24,
    alignItems: "center",
    paddingBottom: 180,
  },
  productImage: {
    width: "100%",
    height: 260,
    borderRadius: 20,
    backgroundColor: "#E6E6E6",
    marginBottom: 24,
  },
  productDescription: {
    fontSize: 22,
    fontWeight: "600",
    color: "#3C3C3C",
    textAlign: "center",
    marginBottom: 18,
  },
  infoBox: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    shadowColor: "#CCC",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#888",
  },
  value: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#C1272D",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
  },
  emptyText: {
    fontSize: 18,
    color: "#AAA",
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    left: 24,
    right: 24,
    backgroundColor: "#C1272D",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#C1272D",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 1,
  },
  adminActions: {
    position: "absolute",
    bottom: 20,
    left: 24,
    right: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  editButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#C1272D",
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#C1272D",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "600",
    fontSize: 15,
    color: "#C1272D",
  },
  deleteButtonText: {
    fontWeight: "600",
    fontSize: 15,
    color: "#fff",
  },
});
