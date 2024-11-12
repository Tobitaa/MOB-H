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
  PanResponder,
  FlatList,
  Animated,
} from 'react-native';
import { useState, useEffect } from 'react';
import HabitCard from './components/HabitCard';
import * as modalImagen from 'expo-image-picker'; //Esto es para la foto
import * as Sharing from 'expo-sharing'; //Para compartir la info por las RRSS
import { Audio } from 'expo-av';//sonido de agregar completo
import * as Clipboard from 'expo-clipboard';

//para los const, ' ' es cuando se espera un string, false o true cuando se espera un cambio de booleano, y null es cuando una cosa puede o no existir (cosas opcionales por asi decirlo)

//Para las tarjetitas use el comando de MOB-2, por eso esta como HabitCard el componente
const HelloScreen = ({ route }) => {
  const { nombre } = route.params; // Recibe el nombre pasado
  const [sound, setSound] = useState();//Definimos un estado para el sonido
  //const ejemplos (esto se borrara, pero es para mostrar que aparece algo)
  const [Completo, setCompleto] = useState([]);
  //const para pantalla flotante
  const [modalVisible, setModalVisible] = useState(false);
  const [CompletoName, setCompletoName] = useState('');
  const [CompletoPlace, setCompletoPlace] = useState('');
  const [CompletoRating, setCompletoRating] = useState('');
  const [CompletoImage, setCompletoImage] = useState(null);
  //const para definir un nuevo habito (esto se cambiara)
  const [newCompleto, setNewCompleto] = useState('');
  const [theme, setTheme] = useState('light');
  //Función para compartir la info en RRSS y no compartir nada
  const handleShareCompleto = async () => {
      const message = `Mira este Completo!\n\nLugar: ${CompletoPlace}\nCalificación: ${CompletoRating}`;
      Clipboard.setString(message);
      alert('Texto copiado');
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable && CompletoImage) {
          await Sharing.shareAsync(CompletoImage, {
              dialogTitle: 'Compartir Completo',
          });
      }
  };

  //definimos la función para el sonido
const RepSonido = async () => {
  const { sound } = await Audio.Sound.createAsync(
    require('./assets/voz_riko.m4a')
  );
  await sound.playAsync();
};
  //el tema parte siendo claro, ahora definimos algo que nos permita modificarlo
  const toggleTheme = () => {
    setTheme((antThem) => (antThem === 'light' ? 'dark' : 'light'));
  };
  // ABRE VENTANA EMERGENTE
  const handleAddCompleto = () => {
    setModalVisible(true);
  };
  // INFO DENTRO DE LA VENTANA EMERGENTE
  const handleSaveCompleto = () => {
    if (CompletoName.trim() !== '') {
      RepSonido(); // Reproducir el sonido antes de cerrar el modal
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
      setCompletoImage(result.assets[0].uri);
    }
  };
  const handleDeleteCompleto = (id) => {
    setCompleto(Completo.filter((habit) => habit.id !== id));
  };

  const renderItem = ({ item }) => {
    const pan = new Animated.Value(0);

    const PanResponder1 = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        pan.setValue(gestureState.dx);
      },
      onPanResponderRelease: (_, { dx }) => {
        if (dx < -100) {
          Animated.timing(pan, {
            toValue: -400,
            duration: 300,
            useNativeDriver: 'true',
          }).start(() => handleDeleteCompleto(item.id));
        } else {
          Animated.spring(pan, {
            toValue: 0,
            useNativeDriver: 'true',
          }).start();
        }
      },
    });
    const backgroundColor = pan.interpolate({
      inputRange: [-100, 0],
      outputRange: ['rgba(255,0,0,0.5)', 'white'],
      extrapolate: 'clamp',
    });
    return (
      <View style={styles.itemContainer}>
        <Animated.View
          style={[styles.animatedBackground, { backgroundColor }]}
        />
        <Animated.View
          {...PanResponder1.panHandlers}
          style={[styles.habitContainer, { transform: [{ translateX: pan }] }]}>
          <HabitCard
            key={item.id}
            name={item.name}
            place={item.place}
            rating={item.rating}
            image={item.image}
          />
        </Animated.View>
      </View>
    );
  };
  return (
    <SafeAreaView
      style={[
        styles.container,
        theme === 'dark' ? darkStyles.container : lightStyles.container,
      ]}>
      <Text
        style={[
          styles.timer,
          theme === 'dark' ? darkStyles.timer : lightStyles.timer,
        ]}>
        ¡Hola {nombre}!
      </Text>

      <View style={styles.inputContainer1}>
        <TouchableOpacity style={styles.button} onPress={handleAddCompleto}>
          <Text style={styles.buttonText}>AGREGAR COMPLETO</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={toggleTheme}>
          <Text style={styles.buttonText}>{
            theme === 'light' ? 'Dark' : 'Light'
          } Mode</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={Completo}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
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
                title="Compartir"
                onPress={handleShareCompleto}
                color="blue"
              />
              <Text> </Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  timer: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  itemContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
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
    color: 'black',
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
  inputModal: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    borderColor: '#ccc',
    alignItems: 'center',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
    marginTop: 5,
    fontSize: 10,
    backgroundColor: 'lightgrey',
    color: 'black',
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  animatedBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 7,
    backgroundColor: 'rgba(255,0,0)',
  },
  habitContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  button: {
    width: 150,
    height: 50,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
const lightStyles = StyleSheet.create({
  container: {
    backgroundColor: '#ecf0f1',
  },
  timer: {
    color: 'black',
  },
});
const darkStyles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
  },
  timer: {
    color: 'lightgrey',
  },
});
export default HelloScreen;