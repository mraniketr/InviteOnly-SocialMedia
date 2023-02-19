import React from "react";
import { View, StyleSheet } from "@react-pdf/renderer";
import TableHeader from "./TableHeader";
import TableRows from "./TableRows";
const styles = StyleSheet.create({
  tableContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#bff0fd",
  },
});
export default function TableMembers(props) {
  return (
    <View style={styles.tableContainer}>
      <TableHeader />
      <TableRows members={props.members} />
      {/* <InvoiceTableFooter items={invoice.items} /> */}
    </View>
  );
}
