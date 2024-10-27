import { SafeAreaView, View, Text, Button, StyleSheet, TextInput} from 'react-native';
import { useState, useEffect } from 'react';


const HomeScreen = ({ navigation }) => {
  const [nombre, setNombre] = useState('');
  //con el comando a continuacion mandamos el nombre a la pantalla HOLA
  const irHola = () => {
    navigation.navigate('Menu', { nombre }); // si se quiere pasar a otra pantalla, se hace lo mismo, solo se cambia 'Hola'
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.box}>
        <Text>
          <Text style={styles.negrita}>⚠️ATENCIÓN⚠️:</Text> Esta aplicacion esta hecha para los amantes de los completos.
        </Text>
        <Text style={styles.espacio}> </Text>
        <Text> Hola </Text>
        <TextInput  placeholder="Ingrese su nombre" style={styles.input} value={nombre} onChangeText={setNombre}/>
        <Text>¿Qué quieres ver hoy acerca de tu relación con los completos? </Text>
        <Text style={styles.espacio}> </Text>
        <Button title="Ir a" onPress={irHola} />
      </View>
      <View>
        <Text style={styles.mensaje}>
          Hecho con 💜 y completos
        </Text>
      </View>
    </SafeAreaView>
  );
};

//onPress y todo ese comando sirve para mandarte a la pantalla Hola con el nombre que pusiste, lo que hacemos al apretar el boton es activar el const irHola, que es el que se va a hola con el nombre

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  box: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { //Esto le agrega como una sombrita al cuadrado
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 3,
    borderRadius: 10,
    width: '80%',
  },
  mensaje: {
    marginTop: 20,
    textAlign: 'center',
    color: '#888',
  },
  negrita: {
    fontWeight: 'bold',
  },
  espacio: {
    height: 20,
  },
});

export default HomeScreen;