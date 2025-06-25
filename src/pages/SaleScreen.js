import { useNavigation, useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert 
} from 'react-native';

import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/ProductService';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function SaleScreen() {
  const navigation = useNavigation();
  const { logout, user } = useAuth();
  const { cartCount } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const DEFAULT_IMAGE = require('../../assets/logo.jpg');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts('BRL');
      // Filtra só produtos com "sale" no nome ou descrição, por exemplo
      const saleProducts = response.products?.filter(p =>
        p.description.toLowerCase().includes('sale') ||
        p.name?.toLowerCase().includes('sale')
      ) ?? [];
      setProducts(saleProducts);
    } catch (error) {
      Alert.alert('Erro ao carregar produtos', error.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [])
  );

  return (
    <View style={styles.container}>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>SALE PTN</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#A62422" style={{ marginTop: 40 }} />
        ) : (
          <>
            {products.length === 0 ? (
              <Text style={{ textAlign: 'center', marginTop: 20 }}>Nenhum produto encontrado.</Text>
            ) : (
              products.reduce((acc, curr, idx) => {
                if (idx % 2 === 0) acc.push([curr]);
                else acc[acc.length - 1].push(curr);
                return acc;
              }, []).map((pair, index) => (
                <View key={index} style={styles.row}>
                  {pair.map((item) => (
                    <ProductCard
                      key={item.id}
                      image={item.imageUrl ? { uri: item.imageUrl } : DEFAULT_IMAGE}
                      name={item.description}
                      description={`R$ ${item.convertedPrice.toFixed(2)}`}
                    />
                  ))}
                </View>
              ))
            )}
          </>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.buttonText}>Voltar para Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  scrollContent: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
    paddingHorizontal: 8,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#A62422',
    paddingVertical: 26,
    borderRadius: 8,
    marginTop: 12,
    padding: 32,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Notable',
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
