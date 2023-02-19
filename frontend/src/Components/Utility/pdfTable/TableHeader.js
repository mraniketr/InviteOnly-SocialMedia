import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const borderColor = "white";
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#620303",
    alignItems: "center",
    height: 24,
    textAlign: "center",
    fontStyle: "bold",
    flexGrow: 1,
    width: "95%",
  },
  wide: {
    width: "20%",
    color: "white",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  normal: {
    width: "15%",
    color: "white",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  end: {
    color: "white",
    width: "20%",
  },
});
export default function TableHeader() {
  return (
    <View style={styles.container}>
      <Text style={styles.wide}>Name</Text>
      <Text style={styles.normal}>Relation</Text>
      <Text style={styles.normal}>DOB</Text>
      <Text style={styles.normal}>Education</Text>
      {/* <Text style={styles.normal}>Spec.</Text> */}
      <Text style={styles.normal}>Mobile</Text>
      <Text style={styles.end}>Sankhe</Text>
    </View>
  );
}
