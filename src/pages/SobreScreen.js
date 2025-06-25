import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import Header from '../components/header';
import Footer from '../components/footer';
import logo from '../../assets/logo.jpg';

export default function SobreScreen() {
  const navigation = useNavigation(); 

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

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Conheça-nos</Text>

        <Text style={styles.sectionTitle}>Visão:</Text>
        <Text style={styles.text}>
          Ser referência no mundo do skate, unindo qualidade, estilo e inovação
          para fortalecer a cultura do skate e inspirar novas gerações a viverem
          sobre rodas.
        </Text>

        <Text style={styles.sectionTitle}>Missão:</Text>
        <Text style={styles.text}>
          Oferecer skates, peças e acessórios de alta qualidade, promovendo a
          liberdade, a criatividade e a expressão pessoal por meio do skate.
          Criamos um espaço para skatistas de todos os níveis se conectarem,
          evoluírem e compartilharem a paixão pelo esporte.
        </Text>

        <Text style={styles.sectionTitle}>Valores:</Text>
        <Text style={styles.text}>Autenticidade, comunidade, qualidade e inovação.</Text>

        <Text style={styles.sectionTitle}>História:</Text>
        <Text style={styles.text}>
          Petunia Boards foi fundada em fevereiro de 2025, pelos alunos Alisson de
          Morais Bosa, Carlos Eduardo Tonhelski, Caio do Prado, João Vinícius Lago
          dos Santos, Júlia Miranda, Júlia Wonsick, Laura Cemion Iora e Maria Carolina
          Pegoraro.
        </Text>
        <Text style={styles.text}>
          Com o propósito de ser o projeto de desenvolvimento mobile do terceiro nanodegree
          de Ciência da Computação, da instituição de ensino Atitus Educação, na matéria de
          Projeto, Design e Engenharia de Processos. Ministrada pelos Professores Alan da Cruz
          Mafalda e Augusto Ortolan.
        </Text>
      </ScrollView>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#000',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 10,
    display: 'flex',
    alignItems: 'center',
    color: '#A62422',
  },
  item: {
    fontSize: 16,
    marginLeft: 10,
    marginBottom: 4,
    color: '#555',
  },
  text: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 10,
  },
});
