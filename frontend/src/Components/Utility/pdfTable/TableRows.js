import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const borderColor = "#90e5fc";
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    borderBottomColor: "#bff0fd",
    borderBottomWidth: 1,
    alignItems: "center",
    height: 24,
    fontStyle: "bold",
  },
  wide: {
    width: "20%",
    textAlign: "left",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingLeft: 8,
  },
  normal: {
    width: "15%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "right",
    paddingRight: 8,
  },
  end: {
    width: "20%",

    textAlign: "right",
    paddingRight: 8,
  },
  amount: {
    width: "15%",
    textAlign: "right",
    paddingRight: 8,
  },
});

export default function TableRows(props) {
  return props.members.map((member) => (
    <View style={styles.row} key={member.memberid.toString()}>
      <Text style={styles.wide}>{member.membername}</Text>
      <Text style={styles.normal}>{member.relation}</Text>
      <Text style={styles.normal}>{member.dob}</Text>
      <Text style={styles.normal}>{member.education}</Text>
      <Text style={styles.normal}>{member.mobile}</Text>
      <Text style={styles.end}>{member.sankhe}</Text>
    </View>
  ));
}
