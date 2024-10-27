import {
  SafeAreaView,
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  ScrollView,
  Keyboard,
  Alert,
  Modal,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useState, useEffect } from 'react';
import HabitCard from './components/HabitCard';
import * as modalImagen from 'expo-image-picker'; //Esto es para la foto

//para los const, ' ' es cuando se espera un string, false o true cuando se espera un cambio de booleano, y null es cuando una cosa puede o no existir (cosas opcionales por asi decirlo)

//Para las tarjetitas use el comando de MOB-2, por eso esta como HabitCard el componente
const HelloScreen = ({ route }) => {
  const { nombre } = route.params; // Recibe el nombre pasado

  //const ejemplos (esto se borrara, pero es para mostrar que aparece algo)
  const [Completo, setCompleto] = useState([
    { id: 1, name: 'Habito 1' },
    { id: 2, name: 'Habito 2' },
  ]);
  //const para pantalla flotante
  const [modalVisible, setModalVisible] = useState(false);
  const [CompletoName, setCompletoName] = useState('');
  const [CompletoPlace, setCompletoPlace] = useState('');
  const [CompletoRating, setCompletoRating] = useState('');
  const [CompletoImage, setCompletoImage] = useState(null);
  //const para definir un nuevo habito (esto se cambiara)
  const [newCompleto, setNewCompleto] = useState('');

  // ELIMINAR HABITO (hay que cambiarlo como por ese swipe para eliminar)
  function handleCompletoDeletion(CompletoName) {
    setCompleto(Completo.filter((Completo) => Completo.name !== CompletoName));
  }
  // ABRE VENTANA EMERGENTE
  const handleAddCompleto = () => {
    setModalVisible(true);
  };
  // INFO DENTRO DE LA VENTANA EMERGENTE
  const handleSaveCompleto = () => {
    if (CompletoName.trim() !== '') {
      Keyboard.dismiss(); 
      setCompleto([
        ...Completo,
        {
          id: Date.now(),
          name: CompletoName,
          place: CompletoPlace,
          rating: CompletoRating,
          image: CompletoImage,
        },
      ]);
      setModalVisible(false);
      setCompletoName('');
      setCompletoPlace('');
      setCompletoRating('');
      setCompletoImage(null);
    } else {
      Alert.alert('Advertencia', 'Faltan secciones por rellenar.');
    }
  };
  //Esto es para la imagen, lo de let es para que selecciones y edites la foto. El if es para que se suba si identifica que hay una foto
  //creo que me esta dando un error, porque al subir la foto como que no se muestra en el cuadro, no se si eso tenga algo que ver ----(Toba)----
  const pickImage = async () => {
    let result = await modalImagen.launchImageLibraryAsync({
      mediaTypes: modalImagen.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      setCompletoImage(result.uri);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.timer}>¡Hola {nombre}!</Text>

      <View style={styles.inputContainer1}>
        <Button title="AGREGAR COMPLETO" onPress={handleAddCompleto} />
      </View>

      <ScrollView style={styles.inputContainer}>
        {Completo.map((Completo) => (
          <HabitCard
            key={Completo.id}
            name={Completo.name}
            place={Completo.place}
            rating={Completo.rating}
            image={Completo.image}
            onDelete={handleCompletoDeletion}
          />
        ))}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Agregar Completo</Text>
            <TouchableOpacity onPress={pickImage} style={styles.modalImagen}>
              {CompletoImage ? (
                <Image source={{ uri: CompletoImage }} style={styles.image} />
              ) : (
                <Text>Subir foto</Text>
              )}
            </TouchableOpacity>
            <TextInput
              placeholder="Nombre"
              style={styles.inputModal}
              value={CompletoName}
              onChangeText={setCompletoName}
            />
            <TextInput
              placeholder="Lugar"
              style={styles.inputModal}
              value={CompletoPlace}
              onChangeText={setCompletoPlace}
            />
            <TextInput
              placeholder="Calificación"
              style={styles.inputModal}
              keyboardType="numeric"
              value={CompletoRating}
              onChangeText={setCompletoRating}
            />

            <View style={styles.fixToText}>
              <Button
                title="Guardar"
                onPress={handleSaveCompleto}
                color="green"
              />
              <Text> </Text>
              <Button
                title="Cerrar"
                onPress={() => setModalVisible(false)}
                color="red"
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  inputContainer1: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  inputModal: {
    width: 200,
    flex: 1,
    flexDirection: 'row',
    borderColor: '#ccc',
    alignItems: 'center',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
    marginTop: 5,
  },
  timer: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //aca se usa rgba porque el ultimo coso (el 0.5) es como opacidad, entonces asi es mas facil que con HEX (eso lei xd)
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalImagen: {
    width: 150,
    height: 150,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
});

export default HelloScreen;
