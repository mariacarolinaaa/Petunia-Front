import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { getOrders } from "../services/OrderService";

export default function OrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const navigation = useNavigation();
  const { token } = useAuth();

  const fetchOrders = async (pageToLoad = 0, append = false) => {
    try {
      if (pageToLoad === 0 && !append) {
        setLoading(true);
        setError(null);
      } else if (append) {
        setLoadingMore(true);
      }

      const response = await getOrders(token, "BRL", pageToLoad);

      const newOrders = response.orders || [];

      setHasMore(newOrders.length > 0);

      if (append) {
        setOrders((prev) => [...prev, ...newOrders]);
      } else {
        setOrders(newOrders);
      }
    } catch (err) {
      setError("Erro ao carregar pedidos. Tente novamente.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setPage(0);
      fetchOrders(0, false);
    }, [token])
  );

  const handleLoadMore = () => {
    if (!loadingMore && hasMore && !refreshing) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchOrders(nextPage, true);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(0);
    fetchOrders(0, false);
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const renderOrder = ({ item }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => navigation.navigate("OrderDetailScreen", { order: item })}
    >
      <Text style={styles.orderId}>Pedido #{item.id}</Text>
      <Text style={styles.orderDate}>Data: {formatDate(item.orderDate)}</Text>
      <Text style={styles.orderTotal}>
        Total: R$ {item.totalConvertedPrice.toFixed(2)}
      </Text>
      <Text style={styles.orderItems}>
        Itens: {item.items ? item.items.length : 0}
      </Text>
    </TouchableOpacity>
  );

  const renderFooter = () =>
    loadingMore ? (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#4e73df" />
      </View>
    ) : null;

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4e73df" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.noOrdersText}>Você ainda não tem pedidos.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderOrder}
      contentContainerStyle={styles.list}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.3}
      ListFooterComponent={renderFooter}
      refreshing={refreshing}
      onRefresh={handleRefresh}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    padding: 16,
  },
  footer: {
    paddingVertical: 16,
    alignItems: "center",
  },
  orderCard: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    height: 300,
  },
  orderId: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
    color: "#343a40",
  },
  orderDate: {
    fontSize: 14,
    marginBottom: 4,
    color: "#6c757d",
  },
  orderTotal: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#28a745",
  },
  orderItems: {
    fontSize: 14,
    color: "#495057",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  noOrdersText: {
    fontSize: 16,
    color: "#6c757d",
  },
});