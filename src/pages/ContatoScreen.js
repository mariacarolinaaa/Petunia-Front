import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TextInput, TouchableOpacity } from 'react-native';
import Header from '../components/header';
import Footer from '../components/footer';
import logo from '../../assets/logo.jpg';

export default function ContatoScreen() {
  const navigation = useNavigation();

  // Estados para os inputs
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [motivo, setMotivo] = useState('');

  const handleEnviar = () => {
    console.log('Dados enviados:', { nome, email, whatsapp, motivo });
    // Aqui você pode adicionar lógica de envio (ex: API)
  };

  return (
    <View style={styles.container}>
      <Header
        logo={logo}
        onMenuPress={() => navigation.openDrawer()}
        onSearchPress={() => console.log('Pesquisar')}
        onNovidadesPress={() => navigation.navigate('Novidades')}
        onSobrePress={() => navigation.navigate('Sobre')} 
        onContatoPress={() => navigation.navigate('Contato')} 
      />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Fale Conosco</Text>

        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu nome"
          value={nome}
          onChangeText={setNome}
        />

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu e-mail"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>WhatsApp</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu número"
          keyboardType="phone-pad"
          value={whatsapp}
          onChangeText={setWhatsapp}
        />

        <Text style={styles.label}>Motivo do contato</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Digite sua mensagem"
          multiline
          value={motivo}
          onChangeText={setMotivo}
        />

        <TouchableOpacity style={styles.button} onPress={handleEnviar}>
          <Text style={styles.buttonText}>Enviar</Text>
        </TouchableOpacity>
      </ScrollView>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A62422', // Container vermelho
  },
  content: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 16,
  },
  title: {
    marginTop: 40,
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#A62422',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    color: '#000',
  },
  button: {
    backgroundColor: '#A62422',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
