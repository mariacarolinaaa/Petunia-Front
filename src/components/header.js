import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import logo from '../../assets/logo.jpg';

const Header = ({ title = "Meu App", onMenuPress, onSearchPress, onNovidadesPress, onSobrePress, onContatoPress, }) => {
  return (
    <View style={styles.header}>
      {/* Parte superior: menu, logo e lupa */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onMenuPress}>
          <Icon name="menu" size={24} color="#fff" />
        </TouchableOpacity>

        <Image source={logo} style={styles.logo} resizeMode="contain" />

        <TouchableOpacity onPress={onSearchPress}>
          <Icon name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Parte inferior: links de navegação */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.novidades} onPress={onNovidadesPress}>
          <Text style={styles.linkText}>Novidades</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.sobre} onPress={onSobrePress}>
          <Text style={styles.linkText}>Sobre</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.contato} onPress={onContatoPress}>
          <Text style={styles.linkText}>Contato</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%', // ocupa a largura total
    backgroundColor: '#1E1E1E',
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomBar: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logo: {
    height: 60,
    width: 200,
  },
  linkText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  novidades: {
   paddingRight: 10,
   paddingLeft: 10,
  },
  sobre: {
   paddingRight: 15,
   paddingLeft: 8,
  },
  contato: {
   paddingRight: 10,
   paddingLeft: 10,
  },
});

export default Header;
