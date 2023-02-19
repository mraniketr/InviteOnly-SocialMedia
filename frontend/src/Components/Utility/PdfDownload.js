import React from "react";
import { Link } from "react-router-dom";

import { PDFDownloadLink } from "@react-pdf/renderer";
import Button from "@restart/ui/esm/Button";
import PdfDocument from "./PdfDocument";

export default function FamilyPdf(props) {
  return (
    <PDFDownloadLink
      document={<PdfDocument profile={props.profile} members={props.members} />}
      fileName={props.members[0].membername + "-RD-Profile-"}
    >
      {({ url, loading, error }) =>
        loading ? (
          "Generating PDF File..."
        ) : (
          <Button className="m-2 p-2 btn btn-success bd-highlight profile-buttons">
            Download PDF
          </Button>
        )
      }
    </PDFDownloadLink>
  );
}
