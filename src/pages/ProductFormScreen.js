import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../context/AuthContext";
import { createProduct, updateProduct } from "../services/ProductService";
import { uploadImage } from "../services/ImageService";

export default function ProductFormScreen({ navigation, route }) {
  const existingProduct = route.params?.product;
  const { token } = useAuth();

  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [currency, setCurrency] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const DEFAULT_IMAGE = require("../../assets/logo.jpg");

  useEffect(() => {
    if (existingProduct) {
      setDescription(existingProduct.description || "");
      setBrand(existingProduct.brand || "");
      setModel(existingProduct.model || "");
      setCurrency(existingProduct.currency || "BRL");
      setPrice(existingProduct.price?.toString() || "");
      setImage(existingProduct.imageUrl ? { uri: existingProduct.imageUrl } : null);
    }
  }, [existingProduct]);

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
  const handleSubmit = async () => {
    if (!description || !brand || !model || !currency || !price) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    let imageResult = {};

    try {
      if (image?.base64) {
        imageResult = await uploadImage(image);
      } else {
        imageResult = { imageUrl: image?.uri || null };
      }

      const productData = {
        description,
        brand,
        model,
        currency,
        price: parseFloat(price),
        imageUrl: imageResult.imageUrl,
      };

      let response;

      if (existingProduct) {
        response = await updateProduct(existingProduct.id, productData, token);
        if (response.error) throw new Error(response.error);
        Alert.alert("Sucesso", "Produto atualizado com sucesso!");
      } else {
        response = await createProduct(productData, token);
        if (response.error) throw new Error(response.error);
        Alert.alert("Sucesso", "Produto cadastrado com sucesso!");
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert("Erro", error.message || "Erro ao salvar produto.");
    } finally {
      setLoading(false);
    }
  };

  const pickImageFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.6,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão necessária", "Você precisa permitir acesso à câmera.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.6,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Digite a descrição"
      />

      <Text style={styles.label}>Marca</Text>
      <TextInput
        style={styles.input}
        value={brand}
        onChangeText={setBrand}
        placeholder="Digite a marca"
      />

      <Text style={styles.label}>Modelo</Text>
      <TextInput
        style={styles.input}
        value={model}
        onChangeText={setModel}
        placeholder="Digite o modelo"
      />

      <Text style={styles.label}>Moeda</Text>
      <TextInput
        style={styles.input}
        value={currency}
        onChangeText={setCurrency}
        placeholder="Ex: BRL"
      />

      <Text style={styles.label}>Preço</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        placeholder="Digite o preço"
        keyboardType="numeric"
      />

      <View style={styles.imageButtons}>
        <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
          <Text style={styles.imageButtonText}>📷 Tirar Foto</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.imageButton} onPress={pickImageFromGallery}>
          <Text style={styles.imageButtonText}>🖼️ Galeria</Text>
        </TouchableOpacity>
      </View>

      {image && (
        <Image
          source={{ uri: image.uri }}
          style={styles.previewImage}
        />
      )}

      <TouchableOpacity style={styles.saveButton} onPress={handleSubmit} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons name="save-outline" size={20} color="#fff" />
            <Text style={styles.saveButtonText}>
              {existingProduct ? "Salvar Alterações" : "Salvar Produto"}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f2f2f2",
    flexGrow: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 14,
  },
  imageButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  imageButton: {
    backgroundColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  imageButtonText: {
    textAlign: "center",
    fontWeight: "600",
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
  },
  saveButton: {
    flexDirection: "row",
    backgroundColor: "#A62422",
    padding: 14,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
    fontSize: 16,
  },
});
