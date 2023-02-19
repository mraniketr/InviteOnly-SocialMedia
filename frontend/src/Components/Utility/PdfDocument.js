import React from "react";
import { Page, View, Image, Document, StyleSheet } from "@react-pdf/renderer";
import logo from "./assets/logo.png";
import AddressBox from "./AddressBox";
import PageTitle from "./PageTitle";
import FamilyID from "./FamilyID";

import TableMembers from "./pdfTable/TableMembers";

export default function PdfDocument(props) {
  const styles = StyleSheet.create({
    page: {
      fontFamily: "Helvetica",
      fontSize: 11,
      paddingTop: 30,
      paddingLeft: 60,
      paddingRight: 60,
      lineHeight: 1.5,
      flexDirection: "column",
    },
    logo: {
      width: 74,
      height: 100,
      marginLeft: "auto",
      marginRight: "auto",
    },
    AddressBox: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
    },
  });
  return (
    <Document>
      <Page size="A3" style={styles.page}>
        <PageTitle title="Rinchher Darpan" />
        <Image style={styles.logo} src={logo} />
        <FamilyID
          title={props.members[0].membername}
          body={"Family ID-" + props.profile.familyid}
        />
        <View style={styles.AddressBox}>
          <AddressBox
            type="business"
            name={props.profile.businessname}
            address={props.profile.businessaddress}
            area={props.profile.businessarea}
            city={props.profile.businesscity}
            pincode={props.profile.businesspincode}
            state={props.profile.businessstate}
            mobile={props.profile.businessmobile}
          />
          <AddressBox
            type="home"
            name={props.profile.homename}
            address={props.profile.homeaddress}
            area={props.profile.homearea}
            city={props.profile.homecity}
            pincode={props.profile.homepincode}
            state={props.profile.homestate}
            mobile={props.profile.homemobile}
          />
        </View>
        <TableMembers members={props.members} />
      </Page>
    </Document>
  );
}
