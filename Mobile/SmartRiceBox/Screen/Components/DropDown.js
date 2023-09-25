import React from "react";
import SelectDropdown from "react-native-select-dropdown";
import { StyleSheet } from "react-native";

export default class DropdownCustom extends React.PureComponent{
    render(){
        console.log("Render dropdown")
        return(
            <SelectDropdown
              data={[
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
                {"name": "AA"},
            ]}
              // defaultValueByIndex={1}
            //   defaultValue={curCity}
            //   onScrollEndReached={}
              onSelect={async (selectedItem, index) => {
                // setLoading(true);
                // console.log(selectedItem, index);
                // setCurCity(selectedItem);
                // const responseDistricts = await fetch(
                //   `https://provinces.open-api.vn/api/p/${selectedItem.code}?depth=2`
                // );
                // const responseDistrictsJson = await responseDistricts.json();
                // // console.log(responseDistrictsJson.districts)
                // setDistricts(responseDistrictsJson.districts);
                // setLoading(false);
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
        )
    }
}

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
  