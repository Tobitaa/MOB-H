import { Text, View, StyleSheet, Button, Alert, Image } from 'react-native';
import { Card } from 'react-native-paper';
import { useState } from 'react';

// NO TOCAR ESTE ARCHIVO
export default function HabitCard(props) {
    const [count, setCount] = useState(0); // Estado para el contador de hábitos, inicialmente 0

    function handleIncrease() { // Añade 1 al contador de hábitos
        setCount((prevCount) => prevCount + 1);
    }

    function handleDecrease() { // Quita 1 al contador de hábitos
      if (count > 0){
        setCount((prevCount) => Math.max(prevCount - 1, 0));
      }
      else{
        Alert.alert('Advertencia','No se pueden tener números negativos');
      }
    }

    function handleDelete() { // Llama a la función onDelete del componente padre con el nombre del hábito
        props.onDelete(props.name);
        

    }
    return (
        <Card style={styles.habitCard}>
            <View style={styles.row}>
                <Image source={{ uri: props.image }} style={styles.habitImage} />
                <Text style={styles.habitName}>{props.name}</Text>

                <View style={styles.counterContainer}>
                    <Button onPress={handleDecrease} title="-" />
                    <Text style={styles.counter}>{count}</Text>
                    <Button onPress={handleIncrease} title="+" />
                </View>
            </View>
              <Text style={styles.habitInfo}>Ubicación: {props.place}</Text>
              <Text  style={styles.habitInfo}>Calificación (1-7): {props.rating}</Text>
        </Card>
    );
}

const styles = StyleSheet.create({
    habitCard: {
        padding: 10,
        marginBottom: 10,
        borderRadius: 8,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    counterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    habitName: {
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1,
        marginLeft: 10,
    },
    habitInfo: {
        fontSize: 16,


        marginLeft: 10,
    },
    counter: {
        fontSize: 16,
        fontWeight: 'bold',
        marginHorizontal: 10,
    },
    habitImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
});