// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, StyleSheet, StatusBar, Image, Modal, Alert, Button } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { API_URL } from '@env'
import Loader from '../Components/Loader';
import { useIsFocused } from '@react-navigation/native';
import { ScrollView, RefreshControl } from 'react-native';

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'Rice Box 1',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Rice Box 2',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Rice Box 3',
  }
];

const Item = ({ item, onPress, backgroundColor, textColor }) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, { backgroundColor }]}>
    <View style={{ flex: 1, justifyContent: "center" }}>
      <Text style={[styles.title, { color: textColor, fontSize:25 }]}>{item.name}</Text>
      <Text style={[styles.title, { color: textColor }]}>{`${item.house_num_street}, ${item.ward}, ${item.district}, ${item.city}`}</Text>
    </View>
    <View style={{ flex: 1 / 2, flexDirection: "col" }}>
      <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
        <Image source={require("../../Image/humidity.png")} style={{ width: 25, height: 25, backgroundColor: "transparent", marginLeft: 5 }} />
        <Text>{item.current_humidity} %</Text>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
        <Image source={require("../../Image/temperature.png")} style={{ width: 30, height: 25, backgroundColor: "transparent" }} />
        <Text>{item.current_temperature} °C</Text>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
        <Image source={require("../../Image/ricebox.png")} style={{ width: 30, height: 30, backgroundColor: "transparent" }} />
        <Text>{item.current_rice_amount}%</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const HomeScreen = (props) => {

  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true)
  const [riceBoxs, setRiceBoxs] = useState(null)

  const getRiceBoxApi = async () => {
    var token = await AsyncStorage.getItem("token")
    const response = await fetch(
      `${API_URL}/api/rice_box`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )
    if (response.ok) {
      const responseJson = await response.json()
      setRiceBoxs(responseJson)
    }
    else {
      props.navigation.navigate('Auth')
    }
  }

  useEffect(() => {
    console.log("rerender home")
    getRiceBoxApi()
  }, [])

  useEffect(() => {
    if (riceBoxs) {
      setLoading(false)
    }
  }, [riceBoxs, setRiceBoxs])

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getRiceBoxApi()
    setRefreshing(false)
  }, []);


  const renderItem = (item) => {
    const backgroundColor = '#3399ff'
    const color = 'black';

    return (
      <Item
        item={item}
        onPress={() => {
          props.navigation.navigate("RiceBoxDetail", {
            rice_box_id: item.id,
            url_dashboard: item.url_dashboard
          })
        }}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Loader loading={loading} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)} style={{ position: "absolute", right: 7, top: 4 }}>
              <Image source={require("../../Image/close.png")} style={{ width: 30, height: 30 }}></Image>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              setModalVisible(false)
              props.navigation.navigate('ScanQRScreen')
            }} style={{ flexDirection: "row", borderBottomColor: 'black', borderBottomWidth: 1, paddingBottom: 10 }}>
              <View style={{ justifyContent: "center", alignItems: "center", paddingEnd: 5 }}>
                <Image source={require("../../Image/scanqr.png")} style={{ width: 50, height: 50 }} />
              </View>
              <View style={{ justifyContent: "center", alignItems: "center", paddingStart: 5 }}>
                <Text>Scan QR Code</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              setModalVisible(false)
              props.navigation.navigate("SetUpRiceBoxScreen")
            }} style={{ flexDirection: "row", paddingTop: 10 }}>
              <View style={{ justifyContent: "center", alignItems: "center", paddingEnd: 5 }}>
                <Image source={require("../../Image/serial.png")} style={{ width: 50, height: 50 }} />
              </View>
              <View style={{ justifyContent: "center", alignItems: "center", paddingStart: 5 }}>
                <Text>Enter Serial Number</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <TouchableOpacity onPress={() => { setModalVisible(true) }} style={{ alignItems: "center", justifyContent: "center", padding: 10 }}>
        <Image source={require("../../Image/plus.png")} style={{ width: 100, height: 100 }} />
      </TouchableOpacity>
      <ScrollView
        contentContainerStyle={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        {/* <FlatList
          data={riceBoxs}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        /> */}
        {riceBoxs ? riceBoxs.map((item)=>{
          return renderItem(item)
        }) : null}
      </ScrollView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  title: {
    fontSize: 14,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});


export default HomeScreen;