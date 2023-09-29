import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { Button } from 'react-native-paper';
import { Appbar } from 'react-native-paper';
import { Text } from 'react-native-paper';
import { Alert } from 'react-native';
import React from 'react';
import { API_URL } from '@env'
import { Image } from 'react-native';
import { ScrollView } from 'react-native';

export default function RiceBoxDetail(props) {
    console.log(props.route.params.url_dashboard)

    const handleBuyRiceRequest = async () =>{
        console.log("hello")
        var response = await fetch(
            `${API_URL}/api/rice_box/send_buy_rice_request?rice_box_id=${props.route.params.rice_box_id}`,
            {
                method:"PUT"
            }
        )
        var responseJson = await response.json()
        console.log(responseJson)
        Alert.alert(
            "Thông báo",
            "Cám ơn quý khách đã gửi yêu cầu mua gạo, chúng tôi sẽ liên hệ với quý khách trong thời gian sớm nhất!",
            [
              { text: "OK"}
            ],
            { cancelable: false }
          );
    }

    const showAlert = () => {
        Alert.alert(
          "Xác nhận yêu cầu mua gạo",
          "Bạn có chắc chắn muốn gửi yêu cầu mua gạo?",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            },
            { text: "OK", onPress: () => handleBuyRiceRequest() }
          ],
          { cancelable: false }
        );
      };

      const renderImage = (amount)=>{
        if (0 < amount && amount < 20){
          return <Image source={require("../Image/rice_10.png")} style={{ width: 100, height: 100, margin:0}}></Image>
        }
        else if (20 < amount && amount < 30){
          return <Image source={require("../Image/rice_20.png")} style={{ width: 100, height: 100, margin:0}}></Image>
        }
        else if (31 < amount && amount < 40){
          return <Image source={require("../Image/rice_30.png")} style={{ width: 100, height: 100, margin:0}}></Image>
        }
        else if (40 < amount && amount < 50){
          return <Image source={require("../Image/rice_40.png")} style={{ width: 100, height: 100, margin:0}}></Image>
        }
        else if (50 < amount && amount < 60){
          return <Image source={require("../Image/rice_50.png")} style={{ width: 100, height: 100, margin:0}}></Image>
        }
        else if (60 < amount && amount < 70){
          return <Image source={require("../Image/rice_60.png")} style={{ width: 100, height: 100, margin:0}}></Image>
        }
        else if (70 < amount && amount < 80){
          return <Image source={require("../Image/rice_70.png")} style={{ width: 100, height: 100, margin:0}}></Image>
        }
        else if (80 < amount && amount < 90){
          return <Image source={require("../Image/rice_80.png")} style={{ width: 100, height: 100, margin:0}}></Image>
        }
        else{
          return <Image source={require("../Image/rice_90.png")} style={{ width: 100, height: 100, margin:0}}></Image>
        }
      }
    
    return (
        <View style={{ flex: 1 , backgroundColor:"white"}}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => { props.navigation.navigate("DrawerNavigationRoutes") }} />
                <Appbar.Content title="Thông tin thùng gạo" />
                <Appbar.Action icon="calendar" onPress={() => { }} />
                <Appbar.Action icon="cog" onPress={() => { }} />
            </Appbar.Header>
            <Button icon="send" mode="contained" onPress={() => showAlert()}>
                Gửi yêu cầu mua gạo
            </Button>
            <View style={{alignItems:"center", justifyContent:"center", marginTop:50}}>
            <Text variant="headlineLarge">Thông tin thùng gạo</Text>
            </View>
            <View style={{justifyContent:"center", alignItems:"center"}}>
              <Text>{props.route.params.cur_amount}%</Text>
              {renderImage(props.route.params.cur_amount)}
            </View>
            <WebView
                originWhitelist={['*']}
                source={{
                    html: `<iframe width="100%" height="50%" src="${props.route.params.url_dashboard}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`
                }}
                style={{ marginTop: 20, flex:1 }}></WebView>
        </View>

    )
}