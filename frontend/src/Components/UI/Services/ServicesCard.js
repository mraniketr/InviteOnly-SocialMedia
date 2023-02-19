import React from "react";
import { Link } from "react-router-dom";
export default function ServicesCard(props) {
  // const Icon = FaUsers;
  const Icon = props.icon;
  return (
    <div className="col">
      <Link to={props.url}>
        <div className="card services-card ">
          <div>
            <Icon className="services-card-icon" color={props.color} />
          </div>
          <div>
            <h6 className="services-card-title text-center">{props.title}</h6>
          </div>
        </div>
      </Link>
    </div>
  );
}
