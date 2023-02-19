import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "column",
    marginTop: 10,
  },
  reportSTitle: {
    color: "#620303",
    letterSpacing: 4,
    fontSize: 20,
    textAlign: "center",
    textTransform: "uppercase",
  },
  reportSmallText: {
    color: "#620303",
    letterSpacing: 4,
    fontSize: 15,
    textAlign: "center",
    textTransform: "uppercase",
  },
});
export default function PageTitle(props) {
  return (
    <View style={styles.titleContainer}>
      <Text style={styles.reportSTitle}>{props.title}</Text>
      <Text style={styles.reportSmallText}>{props.body}</Text>
    </View>
  );
}
