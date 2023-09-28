import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from 'expo-location';

export default () => {
    const [userLocation, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    const [puntos, setPuntos] = useState([{
            "accuracy": 12.970999717712402,
            "altitude": 2479.2998046875,
            "altitudeAccuracy": 1.6438299417495728,
            "heading": 0,
            "latitude": -16.3924676,
            "longitude": -71.5085223,
            "speed": 0,
          },
          {
            "accuracy": 12.970999717712402,
            "altitude": 2479.2998046875,
            "altitudeAccuracy": 1.6438299417495728,
            "heading": 0,
            "latitude": -16.3924676,
            "longitude": -71.5085323,
            "speed": 0,
          },
          {
            "accuracy": 12.970999717712402,
            "altitude": 2479.2998046875,
            "altitudeAccuracy": 1.6438299417495728,
            "heading": 0,
            "latitude": -16.3924876,
            "longitude": -71.5085223,
            "speed": 0,
          }
    ]);

    const [curLoc, setCurLoc] = useState({
        latitude: 5.055252,
        longitude: 115.9456243,
        latitudeDelta: 0.004757,
        longitudeDelta: 0.006866,
    })

    /*marketToDisplay = [
        { latitude: 5.7689, longitude: 110.5677 },
        { latitude: 5.2345, longitude: 111.5623 },
        { latitude: 5.6652, longitude: 112.7890 },
    ]*/

    //const newPuntos = puntos.concat({ coordinate: NativeEvent.coordinate });

    useEffect(() => {
        (async () => {

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
    }, []);

    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
    } else if (userLocation) {
        text = JSON.stringify(userLocation);
        console.log(userLocation.coords);
    }
    return (
        <View style={styles.container}>
            <Text>{text}</Text>

            <MapView style={styles.map} initialRegion={curLoc}>
                {userLocation && <Marker coordinate={userLocation.coords} />}
                {puntos.map((index) => {
                    console.log(index);
                    <Marker
                        coordinate={index}
                    />
                })}
            </MapView>
        </View>
    );
}
const styles = StyleSheet.create({
    map: {
        height: Dimensions.get('window').height - 100,
        width: Dimensions.get('window').width,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
