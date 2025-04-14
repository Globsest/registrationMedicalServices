"use client"
import "../../styles/HomePage.css"

const ServiceGrid = ({ services, onSelect, isAuthenticated }) => {
  console.log("Services in ServiceGrid:", services)

  // If services is not an array or is empty, show a message
  if (!Array.isArray(services) || services.length === 0) {
    return <div className="no-services">Нет доступных услуг</div>
  }

  return (
    <div className="serviceGrid">
      {services.map((service) => {
        // Log each service for debugging
        console.log("Rendering service:", service)

        // Generate a unique key
        const key = service.serviceId || service.id || Math.random()

        // Get the name with fallback
        const name = service.name || service.serviceName || "Медицинская услуга"

        return (
          <div
            key={key}
            className={`serviceCard ${!isAuthenticated ? "serviceCard-disabled" : ""}`}
            onClick={() => {
              if (isAuthenticated) {
                console.log("Service selected:", service)
                onSelect(service)
              } else {
                window.location.href = "/auth"
              }
            }}
          >
            <h3>{name}</h3>
            <p>{isAuthenticated ? "Нажмите, чтобы заполнить форму" : "Авторизуйтесь для заполнения формы"}</p>
            {service.description && <p className="service-description">{service.description}</p>}
          </div>
        )
      })}
    </div>
  )
}

export default ServiceGrid
