import React from "react";
import { Card, Button } from "react-bootstrap";
import { FaPhone, FaPhoneAlt, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function FamilyCard(props) {
  return (
    <Card style={{ width: "90vw" }}>
      {props.familydata.image ? (
        <Card.Img
          variant="top"
          src={`data:${props.familydata.imagetype}};base64,${Buffer.from(
            props.familydata.image.data
          ).toString("base64")}`}
        />
      ) : (
        <div>
          <FaUser size="5rem" color="grey" />
        </div>
      )}

      <Card.Body>
        <Card.Title>{props.familydata.membername}</Card.Title>
        <Card.Text>
          {`${props.familydata.homeaddress},  ${props.familydata.homearea},${props.familydata.homestate}, ${props.familydata.homepincode}`}
        </Card.Text>
        <div className="caller">
          {props.familydata.mobile && (
            <Button
              variant="success"
              onClick={() => window.open(`tel:${props.familydata.mobile}`)}
            >
              {props.familydata.mobile}
            </Button>
          )}
          <Button variant="primary">
            <Link
              to={{
                pathname: `/profile`,
                family_id: props.familydata.familyid,
              }}
            >
              View Profile
            </Link>
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
