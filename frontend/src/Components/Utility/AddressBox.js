import React from "react";
import {
  Page,
  Image,
  Text,
  View,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";

export default function AddressBox(props) {
  const styles = StyleSheet.create({
    headerContainer: {
      marginTop: 10,
    },
    AddressType: {
      marginTop: 10,
      paddingBottom: 3,
      fontFamily: "Helvetica-Oblique",
    },
  });
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.AddressType}>
        {props.type.toUpperCase() + " ADDRESS"}
      </Text>
      <Text>{props.name}</Text>
      <Text>{props.address}</Text>
      <Text>
        {props.area},{props.city}
      </Text>

      <Text>
        {props.state},{props.pincode}
      </Text>

      <Text>{props.mobile}</Text>
    </View>
  );
}
