import {
  SafeAreaView,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";
import * as Location from "expo-location";
import SelectDropdown from "react-native-select-dropdown";
import {
  Input,
  Box,
  NativeBaseProvider,
  Stack,
  Center,
  Select,
  CheckIcon,
} from "native-base";
import { OPENCAGE_API_KEY } from "@env";
import { API_URL } from '@env'
import Loader from "./Components/Loader";
import AsyncStorage from '@react-native-community/async-storage';

function change_alias(alias) {
  var str = alias;
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    " "
  );
  str = str.replace(/ + /g, " ");
  str = str.trim();
  return str;
}

function isNumeric(str) {
  str = str.toString()
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}


const SetUpRiceBoxScreen = (props) => {
  const [serial, setSerial] = useState("");
  const [name, setName] = useState("")
  // const [errortext, setErrortext] = useState('');
  // const [location, setLocation] = useState(null);
  const [citys, setCitys] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  // const [addressStreet, setAddressStreet] = useState("")
  const thresholds = [10, 20, 30, 40, 50];
  const [loading, setLoading] = useState(true);
  const [curCity, setCurCity] = useState(null);
  const [curDistrict, setCurDistrict] = useState(null);
  const [curWard, setCurWard] = useState(null);
  const [curRoad, setCurRoad] = useState(null);
  const [curThreshold, setCurThreshold] = useState(20);
  const [enabledSeri, setEnableSeri] = useState(true);
  const [long, setLong] = useState(null)
  const [lat, setLat] = useState(null)

  const handleSetUpPress = async () => {
    if (!serial) {
      alert("Vui lòng nhập số seri");
      return;
    }
    if (!name) {
      alert("Vui lòng nhập tên thùng gạo");
      return;
    }
    if (!curCity) {
      alert("Vui lòng chọn tỉnh/thành phố");
      return;
    }
    if (!curDistrict) {
      alert("Vui lòng chọn quận/huyện");
      return;
    }
    if (!curWard) {
      alert("Vui lòng chọn phường/xã");
      return;
    }
    if (!curRoad) {
      alert("Vui lòng nhập số nhà, đường");
      return;
    }
    if (/(?=.*[0-9])(?=.*[a-zA-Z])/.test(curRoad) == false) {
      alert("Vui lòng nhập địa chỉ hợp lệ(bao gồm số nhà và tên đường)");
      return;
    }
    if (!curThreshold) {
      alert("Vui lòng chọn mức ngưỡng");
      return;
    }
    setLoading(true)
    console.log(serial);
    console.log(curCity);
    console.log(curDistrict);
    console.log(curRoad);
    console.log(curThreshold);
    var token = await AsyncStorage.getItem("token")
    const response = await fetch(
      `${API_URL}/api/rice_box`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': "application/json"
        },
        method: "PUT",
        body: JSON.stringify({
          "rice_box_seri": serial,
          "name": name,
          "city": curCity.name,
          "ward": curWard.name,
          "district": curDistrict.name,
          "house_num_street": curRoad,
          "alarm_rice_threshold": curThreshold,
          "longitude": long,
          "latitude": lat
        })
      }
    )
    const responseJson = await response.json()
    console.log(responseJson)
    setLoading(false)
    props.navigation.navigate('DrawerNavigationRoutes')
  };

  //   setTimeout(async () => {
  //     const responseCitys = await fetch("https://provinces.open-api.vn/api/p/", {
  //       method: "GET",
  //     });
  //     const responseCitysJson = await responseCitys.json();
  //     setCitys(responseCitysJson);
  //     setLoading(false);
  //   }, 5000);

  const asyncCallWithTimeout = async (asyncPromise, timeLimit) => {
    let timeoutHandle;
    const timeoutPromise = new Promise((_resolve, reject) => {
      timeoutHandle = setTimeout(
        () => reject(new Error("Async call timeout limit reached")),
        timeLimit
      );
    });
    return Promise.race([asyncPromise, timeoutPromise]).then((result) => {
      clearTimeout(timeoutHandle);
      return result;
    });
  };

  useEffect(() => {
    (async () => {
      console.log("First");
      if (props.route.params) {
        setSerial(props.route.params.qr_value);
        setEnableSeri(false);
      }
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }
      try {
        const location = await asyncCallWithTimeout(Location.getCurrentPositionAsync({}), 5000);
        console.log(location);
        setLong(location.coords.longitude)
        setLat(location.coords.latitude)

        const responseCitys = await fetch(
          "https://provinces.open-api.vn/api/p/",
          {
            method: "GET",
          }
        );
        const responseCitysJson = await responseCitys.json();
        setCitys(responseCitysJson);

        if (!location) {
          const responseCitys = await fetch(
            "https://provinces.open-api.vn/api/p/",
            {
              method: "GET",
            }
          );
          const responseCitysJson = await responseCitys.json();
          setCitys(responseCitysJson);
          setLoading(false)
          return
        }
        const responseCurAddress = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${location.coords.latitude}+${location.coords.longitude}&key=${OPENCAGE_API_KEY}`
        );
        // console.log(
        //   `https://api.opencagedata.com/geocode/v1/json?q=${location.coords.latitude}+${location.coords.longitude}&key=${OPENCAGE_API_KEY}`
        // );
        const responseCurAddressJson = await responseCurAddress.json();
        // console.log(responseCurAddressJson);
        var curAdd = responseCurAddressJson.results[0].components;
        console.log(curAdd);
        if ("state" in curAdd) {
          var curCityVal = change_alias(curAdd.state)
            .replace(/city|province|saigon/g, "")
            .trim();
          var curDistrictVal = change_alias(curAdd.city)
            .replace("district", "")
            .trim();
        } else {
          var curCityVal = change_alias(curAdd.city)
            .replace(/city|province|saigon/g, "")
            .trim();
          var curDistrictVal = change_alias(curAdd.city_district)
            .replace("district", "")
            .trim();
        }
        var curWardVal = change_alias(curAdd.suburb).replace(/ward|phuong/g, "").trim();
        setCurRoad(curAdd.road);
        console.log(curCityVal, curDistrictVal, curWardVal);
        for (let i = 0; i < responseCitysJson.length; i++) {
          if (
            change_alias(responseCitysJson[i].name)
              .replace(/tinh|thanh pho/g, "")
              .trim() === curCityVal
          ) {
            setCurCity(responseCitysJson[i]);
            const responseDistricts = await fetch(
              `https://provinces.open-api.vn/api/p/${responseCitysJson[i].code}?depth=2`
            );
            const responseDistrictsJson = await responseDistricts.json();
            // console.log(responseDistrictsJson.districts)
            setDistricts(responseDistrictsJson.districts);
            for (let j = 0; j < responseDistrictsJson.districts.length; j++) {
              var district = change_alias(
                responseDistrictsJson.districts[j].name
              )
                .replace(/quan|huyen|thanh pho/g, "")
                .trim();
              if (isNumeric(district) && isNumeric(curDistrictVal)) {
                district = Number(district);
                curDistrictVal = Number(curDistrictVal);
              }
              if (district === curDistrictVal) {
                // console.log(curDistrict)
                setCurDistrict(responseDistrictsJson.districts[j]);
                const responseWards = await fetch(
                  `https://provinces.open-api.vn/api/d/${responseDistrictsJson.districts[j].code}?depth=2`
                );
                const responseWardsJson = await responseWards.json();
                console.log(responseWardsJson.wards)
                setWards(responseWardsJson.wards);
                for (let z = 0; z < responseWardsJson.wards.length; z++) {
                  var ward = change_alias(responseWardsJson.wards[z].name)
                    .replace(/phuong|xa/g, "")
                    .trim();
                    console.log("debug")
                  console.log(ward)
                  // console.log(curWardVal)
                  console.log("debug")

                  if (isNumeric(ward) && isNumeric(curWardVal)) {
                    console.log("Hello");
                    ward = Number(ward);
                    curWardVal = Number(curWardVal);
                  }
                  if (ward === curWardVal) {
                    setCurWard(responseWardsJson.wards[z]);
                    break;
                  }
                }
                break;
              }
            }
            break;
          }
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    })();

    return () => {
      props.navigation.navigate('homeScreenStack')
    }
  }, []);

  useEffect(() => {
    console.log("loading", loading);
  }, [loading]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Loader loading={loading} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <View style={{ alignItems: "center" }}>
          <Image
            source={require("../Image/viettel.png")}
            style={{
              width: "200%",
              height: 100,
              resizeMode: "contain",
              margin: 30,
            }}
          />
          <Text style={{ fontWeight: "bold", fontSize: 20 }}>
            Cấu hình thông số cho thùng gạo
          </Text>
        </View>
        <KeyboardAvoidingView enabled>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 15,
              marginStart: 40,
              marginBottom: -10,
              marginTop: 20,
            }}
          >
            Số Seri
          </Text>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              textAlign={"left"}
              onChangeText={(serial) => setSerial(serial)}
              underlineColorAndroid="#f000"
              placeholder="Nhập số seri "
              value={serial}
              placeholderTextColor="#8b9cb5"
              color="black"
              editable={enabledSeri}
              autoCapitalize="sentences"
              returnKeyType="next"
              // keyboardType="numeric"
              blurOnSubmit={false}
            />
          </View>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 15,
              marginStart: 40,
              marginBottom: -10,
              marginTop: 20,
            }}
          >
            Tên thùng gạo
          </Text>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              textAlign={"left"}
              onChangeText={(name) => setName(name)}
              underlineColorAndroid="#f000"
              placeholder="Nhập tên thùng gạo "
              value={name}
              placeholderTextColor="#8b9cb5"
              color="black"
              autoCapitalize="sentences"
              returnKeyType="next"
              // keyboardType="numeric"
              blurOnSubmit={false}
            />
          </View>

          <Text
            style={{
              fontWeight: "bold",
              fontSize: 15,
              marginStart: 40,
              marginBottom: -10,
              marginTop: 20,
            }}
          >
            Chọn Thành Phố
          </Text>
          <View style={styles.SectionStyle}>
            <SelectDropdown
              data={citys}
              // defaultValueByIndex={1}
              defaultValue={curCity}
              onSelect={async (selectedItem, index) => {
                setLoading(true);
                console.log(selectedItem, index);
                setCurCity(selectedItem);
                const responseDistricts = await fetch(
                  `https://provinces.open-api.vn/api/p/${selectedItem.code}?depth=2`
                );
                const responseDistrictsJson = await responseDistricts.json();
                // console.log(responseDistrictsJson.districts)
                setDistricts(responseDistrictsJson.districts);
                if (JSON.stringify(selectedItem) !== JSON.stringify(curCity)) {
                  setCurDistrict(null)
                  setCurWard(null)
                }
                setLoading(false);
              }}
              defaultButtonText={"Chọn thành phố"}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem.name;
              }}
              rowTextForSelection={(item, index) => {
                return item.name;
              }}
              buttonStyle={styles.inputStyle}
              buttonTextStyle={styles.dropdown1BtnTxtStyle}
              // renderDropdownIcon={isOpened => {
              //     return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#444'} size={18} />;
              // }}
              dropdownIconPosition={"right"}
              dropdownStyle={styles.dropdown1DropdownStyle}
              rowStyle={styles.dropdown1RowStyle}
              rowTextStyle={styles.dropdown1RowTxtStyle}
              selectedRowStyle={styles.dropdown1SelectedRowStyle}
              search
              searchInputStyle={styles.dropdown1searchInputStyleStyle}
              searchPlaceHolder={"Search here"}
              searchPlaceHolderColor={"darkgrey"}
            // renderSearchInputLeftIcon={() => {
            //     return <FontAwesome name={'search'} color={'#444'} size={18} />;
            // }}
            />
          </View>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 15,
              marginStart: 40,
              marginBottom: -10,
              marginTop: 20,
            }}
          >
            Chọn Quận/Huyện
          </Text>
          <View style={styles.SectionStyle}>
            <SelectDropdown
              data={districts}
              // defaultValueByIndex={1}
              defaultValue={curDistrict}
              onSelect={async (selectedItem, index) => {
                setLoading(true);
                console.log(selectedItem, index);
                setCurDistrict(selectedItem);
                const responseWards = await fetch(
                  `https://provinces.open-api.vn/api/d/${selectedItem.code}?depth=2`
                );
                const responseWardsJson = await responseWards.json();
                // console.log(responseWardsJson.wards)
                setWards(responseWardsJson.wards);
                if (JSON.stringify(curDistrict) !== JSON.stringify(selectedItem)) {
                  setCurWard(null)
                }
                setLoading(false);
              }}
              defaultButtonText={"Chọn quận/huyện"}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem.name;
              }}
              rowTextForSelection={(item, index) => {
                return item.name;
              }}
              buttonStyle={styles.inputStyle}
              buttonTextStyle={styles.dropdown1BtnTxtStyle}
              // renderDropdownIcon={isOpened => {
              //     return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#444'} size={18} />;
              // }}
              dropdownIconPosition={"right"}
              dropdownStyle={styles.dropdown1DropdownStyle}
              rowStyle={styles.dropdown1RowStyle}
              rowTextStyle={styles.dropdown1RowTxtStyle}
              selectedRowStyle={styles.dropdown1SelectedRowStyle}
              search
              searchInputStyle={styles.dropdown1searchInputStyleStyle}
              searchPlaceHolder={"Search here"}
              searchPlaceHolderColor={"darkgrey"}
            // renderSearchInputLeftIcon={() => {
            //     return <FontAwesome name={'search'} color={'#444'} size={18} />;
            // }}
            />
          </View>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 15,
              marginStart: 40,
              marginBottom: -10,
              marginTop: 20,
            }}
          >
            Chọn Phường/Xã
          </Text>
          <View style={styles.SectionStyle}>
            <SelectDropdown
              data={wards}
              // defaultValueByIndex={1}
              defaultValue={curWard}
              onSelect={(selectedItem, index) => {
                console.log(selectedItem, index);
                setCurWard(selectedItem);
              }}
              defaultButtonText={"Chọn phường"}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem.name;
              }}
              rowTextForSelection={(item, index) => {
                return item.name;
              }}
              buttonStyle={styles.inputStyle}
              buttonTextStyle={styles.dropdown1BtnTxtStyle}
              // renderDropdownIcon={isOpened => {
              //     return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#444'} size={18} />;
              // }}
              dropdownIconPosition={"right"}
              dropdownStyle={styles.dropdown1DropdownStyle}
              rowStyle={styles.dropdown1RowStyle}
              rowTextStyle={styles.dropdown1RowTxtStyle}
              selectedRowStyle={styles.dropdown1SelectedRowStyle}
              search
              searchInputStyle={styles.dropdown1searchInputStyleStyle}
              searchPlaceHolder={"Search here"}
              searchPlaceHolderColor={"darkgrey"}
            // renderSearchInputLeftIcon={() => {
            //     return <FontAwesome name={'search'} color={'#444'} size={18} />;
            // }}
            />
          </View>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 15,
              marginStart: 40,
              marginBottom: -10,
              marginTop: 20,
            }}
          >
            Số nhà, Đường
          </Text>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              textAlign={"left"}
              onChangeText={(road) => setCurRoad(road)}
              underlineColorAndroid="#f000"
              placeholder="Nhập địa chỉ nhà "
              value={curRoad}
              placeholderTextColor="#8b9cb5"
              color="black"
              //  autoCapitalize="sentences"
              returnKeyType="next"
              //  keyboardType="numeric"
              blurOnSubmit={false}
            ></TextInput>
          </View>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 15,
              marginStart: 40,
              marginBottom: -10,
              marginTop: 20,
            }}
          >
            Chọn ngưỡng gạo cần cảnh báo
          </Text>
          <View style={styles.SectionStyle}>
            <SelectDropdown
              data={thresholds}
              // defaultValueByIndex={1}
              defaultValue={20}
              onSelect={(selectedItem, index) => {
                setCurThreshold(selectedItem);
                console.log(selectedItem, index);
              }}
              defaultButtonText={"Chọn ngưỡng gạo cảnh báo"}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem + "%";
              }}
              rowTextForSelection={(item, index) => {
                return item + "%";
              }}
              buttonStyle={styles.inputStyle}
              buttonTextStyle={styles.dropdown1BtnTxtStyle}
              // renderDropdownIcon={isOpened => {
              //     return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#444'} size={18} />;
              // }}
              dropdownIconPosition={"right"}
              dropdownStyle={styles.dropdown1DropdownStyle}
              rowStyle={styles.dropdown1RowStyle}
              rowTextStyle={styles.dropdown1RowTxtStyle}
              selectedRowStyle={styles.dropdown1SelectedRowStyle}
              search
              searchInputStyle={styles.dropdown1searchInputStyleStyle}
              searchPlaceHolder={"Search here"}
              searchPlaceHolderColor={"darkgrey"}
            // renderSearchInputLeftIcon={() => {
            //     return <FontAwesome name={'search'} color={'#444'} size={18} />;
            // }}
            />
          </View>

          {/* {errortext != '' ? (
                        <Text style={styles.errorTextStyle}>
                            {errortext}
                        </Text>
                    ) : null} */}

          <TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={0.5}
            onPress={handleSetUpPress}
          >
            <Text style={styles.buttonTextStyle}>Thiết lập</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SetUpRiceBoxScreen;

const styles = StyleSheet.create({
  SectionStyle: {
    flexDirection: "row",
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: "#7DE24E",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#7DE24E",
    height: 40,
    alignItems: "center",
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 10,
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    color: "white",
    marginBottom: -10,
    paddingLeft: 25,
    fontSize: 20,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: "#dadae8",
  },
  errorTextStyle: {
    color: "red",
    textAlign: "center",
    fontSize: 14,
  },
  successTextStyle: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    padding: 30,
  },
  dropdown1BtnStyle: {
    width: "80%",
    height: 50,
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#444",
  },
  dropdown1BtnTxtStyle: { color: "black", textAlign: "left" },
  dropdown1DropdownStyle: { backgroundColor: "#EFEFEF" },
  dropdown1RowStyle: {
    backgroundColor: "#EFEFEF",
    borderBottomColor: "#C5C5C5",
  },
  dropdown1RowTxtStyle: { color: "#444", textAlign: "left" },
  dropdown1SelectedRowStyle: { backgroundColor: "rgba(0,0,0,0.1)" },
  dropdown1searchInputStyleStyle: {
    backgroundColor: "#EFEFEF",
    borderRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
});
