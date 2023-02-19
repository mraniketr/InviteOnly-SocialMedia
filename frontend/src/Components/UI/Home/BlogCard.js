import React from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import formatDate from "../../Utility/TimeStamp";

export default function BlogCard({
  image = null,
  imagetype = null,
  title,
  blogid,
  content,
  date,
  ...props
}) {
  return (
    <Card style={{ width: "90vw" }}>
      <Card.Text>{formatDate(date)}</Card.Text>
      {image ? (
        <Card.Img
          variant="top"
          src={`data:${imagetype}};base64,${Buffer.from(image.data).toString(
            "base64"
          )}`}
        />
      ) : (
        ""
      )}

      <Card.Body>
        <Card.Title>{title}</Card.Title>

        <Link
          to={{
            pathname: `/article/${blogid}`,
            content: {
              data: { image, imagetype, title, blogid, content, date },
            },
          }}
        >
          <Button variant="secondary">Read More</Button>
        </Link>
      </Card.Body>
    </Card>
  );
}
