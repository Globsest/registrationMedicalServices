package com.globsest.regmedicaltest.dto;

import jakarta.persistence.Column;
import lombok.Data;

@Data
public class MedicalServiceDto {
    private Long serviceId;
    private String description;
    private boolean isActive;
}
