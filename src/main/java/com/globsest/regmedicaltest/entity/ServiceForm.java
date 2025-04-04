package com.globsest.regmedicaltest.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "Service_Forms")
public class ServiceForm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "form_id")
    private Long formId;

    @ManyToOne
    @JoinColumn(name = "service_id", nullable = false)
    private MedicalServices medicalService;

    @Column(name = "form_struct", columnDefinition = "JSONB")
    private String formStruct;

    @Column(name = "pdf_template")
    private String pdf_template;
}