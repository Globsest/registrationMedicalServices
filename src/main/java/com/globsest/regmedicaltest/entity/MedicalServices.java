package com.globsest.regmedicaltest.entity;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "medical_service")
public class MedicalServices {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "service_id")
    private Long serviceId;

    @Column(name = "description")
    private String description;

    @Column(name = "is_active")
    private boolean isActive;
}
