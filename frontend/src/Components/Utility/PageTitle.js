import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  reportTitle: {
    color: "#620303",
    letterSpacing: 4,
    fontSize: 25,
    textAlign: "center",
    textTransform: "uppercase",
  },
});
export default function PageTitle(props) {
  return (
    <View style={styles.titleContainer}>
      <Text style={styles.reportTitle}>{props.title}</Text>
    </View>
  );
}
