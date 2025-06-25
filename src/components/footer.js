import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const Footer = () => {
  return (
    <View style={styles.footer}>
      <TouchableOpacity>
        <Icon name="home-outline" size={28} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity>
        <Icon name="notifications-outline" size={28} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity>
        <Icon name="cart-outline" size={28} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity>
        <Icon name="person-outline" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#1E1E1E',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});

export default Footer;
