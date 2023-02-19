import React from "react";
import ServicesCard from "../Components/UI/Services/ServicesCard";
import { FaUsers, FaHourglassEnd, FaPhone } from "react-icons/fa";
import { GiBullseye, GiFlowerEmblem } from "react-icons/gi";

export default function Services() {
  return (
    <div className="container services-container">
      <div className="row align-items-start p-2">
        <ServicesCard
          icon={FaHourglassEnd}
          title="History"
          url="/history"
          color="brown"
        />
        <ServicesCard
          icon={GiBullseye}
          title="Vision and mission"
          url="/Vision-Mission"
          color="brown"
        />
      </div>
      {/* ROW 2 */}
      <div className="row align-items-start p-2">
        <ServicesCard
          icon={FaUsers}
          title="Family Directory"
          url="/family-directory"
          color="brown"
        />
      </div>

      <div className="row align-items-start p-2">
        <ServicesCard
          icon={GiFlowerEmblem}
          title="Announcement"
          url="/"
          color="brown"
        />
        <ServicesCard
          icon={FaPhone}
          title="Contact Us"
          url="/contact"
          color="brown"
        />
      </div>
    </div>
  );
}
