package com.globsest.regmedicaltest.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

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

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "form_struct", columnDefinition = "JSONB")
    private String formStruct;

    @Column(name = "pdf_template")
    private String pdf_template;
}