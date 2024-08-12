import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text } from 'react-native';
import {
    addInventario, getAllSedes, getAllAlmacenes, getAllEstado, getAllClasificacion, getInventarioById, updateInventario, getSedeByID, getEmplazamientoByID, getEstadoByID, getClasificacionByID, getUsuarioByIdIdEmplazamiento, getAllDistinctUsuarios, autocomplete
} from "./db";

const Autocomplete = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    /*useEffect(() => {
        if (query.length > 0) {
            db.transaction(tx => {
                tx.executeSql(
                    'SELECT * FROM items WHERE name LIKE ?',
                    [`%${query}%`],
                    (_, { rows: { _array } }) => {
                        setResults(_array);
                    }
                );
            });
        } else {
            setResults([]);
        }
    }, [query]);*/

    async function autocompletar(query) {
        return await autocomplete(query);
    }
    useEffect(() => {
        if (query.length > 0) {
            setResults(autocompletar(query));
        } else {
            setResults([]);
        }
    }, [query]);

    return (
        <View style={{ flex: 1 }}>
            <Text style={styles.label}>Código Material:</Text>
            <TextInput
                placeholder="Código Material"
                placeholderTextColor="#B2BABB"
                style={styles.textInput}
                value={query}
                onChangeText={setQuery}
            />
            <ScrollView style={styles.scrollView}>
                {results.map(item => (
                    <View key={item.id} style={styles.resultItem}>
                        <Text>{item.name}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

export default Autocomplete;
