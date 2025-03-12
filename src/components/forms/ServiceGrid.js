import React from "react";
import "../../styles/HomePage.css";

const ServiceGrid = ({ services, onSelect }) => {
  return (
    <div className="serviceGrid">
      {services.map((service) => (
        <div
          key={service.id}
          className="serviceCard"
          onClick={() => onSelect(service)}
        >
          <h3>{service.name}</h3>
          <p>Нажмите, чтобы заполнить форму</p>
        </div>
      ))}
    </div>
  );
};

export default ServiceGrid;