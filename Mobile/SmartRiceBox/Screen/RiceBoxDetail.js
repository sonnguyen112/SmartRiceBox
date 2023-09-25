import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { Button } from 'react-native-paper';
import { Appbar } from 'react-native-paper';
import { Text } from 'react-native-paper';
import { Alert } from 'react-native';
import React from 'react';
import { API_URL } from '@env'

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
            <WebView
                originWhitelist={['*']}
                source={{
                    html: `<iframe width="100%" height="50%" src="${props.route.params.url_dashboard}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`
                }}
                style={{ marginTop: 20 }}></WebView>
        </View>

    )
}