import { useNavigation, useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState, useLayoutEffect } from 'react';
import {
  View, StyleSheet, ScrollView, Text,
  ActivityIndicator, Alert, Image
} from 'react-native';

import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/ProductService';

const DEFAULT_IMAGE = require('../../assets/logo.jpg');

export default function NovidadesScreen() {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts('BRL');
      setProducts(response.products);
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: "#000",
      },
      headerTitle: () => (
        <Image
          source={require('../../assets/logo.jpg')}
          style={{ width: 140, height: 40, resizeMode: 'contain' }}
        />
      ),
      headerTitleAlign: 'center',
      headerTintColor: '#fff', // cor do botão de voltar
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <ActivityIndicator size="large" color="#A62422" style={{ marginTop: 40 }} />
        ) : (
          products.length === 0 ? (
            <Text style={{ textAlign: 'center', marginTop: 20 }}>Nenhum produto encontrado.</Text>
          ) : (
           products
              .slice(0, 6) // <- limita para os 6 primeiros
              .reduce((acc, curr, idx) => {
                if (idx % 2 === 0) acc.push([curr]);
                else acc[acc.length - 1].push(curr);
                return acc;
              }, [])
              .map((pair, index) => (
                <View key={index} style={styles.row}>
                  {pair.map((item) => (
                    <ProductCard
                      key={item.id}
                      image={item.imageUrl ? { uri: item.imageUrl } : DEFAULT_IMAGE}
                      name={item.description}
                      description={`R$ ${item.convertedPrice.toFixed(2)}`}
                      imageHeight={400}
                    />
                  ))}
                </View>
              ))
          )
        )}
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
    marginTop: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
    textAlign: 'center',
  },
});
