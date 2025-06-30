// src/routes/routes.js
import React from "react";
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

// Telas de autenticação
import LoginScreen from "../pages/Auth/LoginScreen";
import RegisterScreen from "../pages/Auth/RegisterScreen";

// Telas de produtos
import HomeScreen from "../pages/HomeScreen";
import ProductDetail from "../pages/ProductDetail";
import OrderConfirmationScreen from "../pages/OrderConfirmation";
import ProductFormScreen from "../pages/ProductFormScreen";


import OrderDetailScreen from "../pages/OrderDetail";
import OrdersScreen from "../pages/OrdersScreen";

// Telas extras
import NovidadesScreen from "../pages/NovidadesScreen";
import SobreScreen from "../pages/SobreScreen";
import ContatoScreen from "../pages/ContatoScreen";
import SaleScreen from "../pages/SaleScreen";

import CartScreen from "../pages/CartScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function ProductsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetail} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} />
      <Stack.Screen name="ProductForm" component={ProductFormScreen} />
    </Stack.Navigator>
  );
}

function OrdersStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="OrdersScreen" component={OrdersScreen} />
      <Stack.Screen name="OrderDetailScreen" component={OrderDetailScreen} />
    </Stack.Navigator>
  );
}

function ExtrasStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Novidades" component={SaleScreen} />
      <Stack.Screen name="Sobre" component={SobreScreen} />
      <Stack.Screen name="Contato" component={ContatoScreen} />
    </Stack.Navigator>
  );
}

export default function Routes() {
  const { user } = useAuth();

  if (!user) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Cadastro" component={RegisterScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Produtos") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Pedidos") {
              iconName = focused ? "list" : "list-outline";
            } else if (route.name === "Mais") {
              iconName = focused ? "menu" : "menu-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#fff",
          tabBarInactiveTintColor: "gray",
          tabBarBackgroundColor: "#000",
          tabBarStyle: {backgroundColor: "#000"},
        })}
      >
        <Tab.Screen
          name="Produtos"
          component={ProductsStack}
          options={({ route }) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? "Home";

            if (
              ["ProductDetail", "Cart", "OrderConfirmation", "ProductForm"].includes(routeName)
            ) {
              return {
                tabBarStyle: { display: "none" },
                tabBarLabel: "Produtos",
                tabBarActiveTintColor: "#fff",
                tabBarInactiveTintColor: "gray",
                tabBarBackgroundColor: "#000",
                tabBarStyle: {backgroundColor: "#000"},
              };
            }

            return { tabBarLabel: "Produtos" };
          }}
        />
        <Tab.Screen
          name="Pedidos"
          component={OrdersStack}
          options={({ route }) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? "OrdersScreen";

            if (routeName === "OrderDetailScreen") {
              return {
                tabBarStyle: { display: "none" },
                tabBarLabel: "Pedidos",
                  tabBarActiveTintColor: "#fff",
            tabBarInactiveTintColor: "gray",
            tabBarBackgroundColor: "#000",
            tabBarStyle: {backgroundColor: "#000"},
              };
            }

            return { tabBarLabel: "Pedidos" };
          }}
        />
        <Tab.Screen
          name="Mais"
          component={ExtrasStack}
          options={{ tabBarLabel: "Mais" }}
          
          
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
