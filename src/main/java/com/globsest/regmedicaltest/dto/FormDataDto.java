package com.globsest.regmedicaltest.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Map;

@Data
public class FormDataDto {
    @NotNull
    private Long serviceId;
    @NotEmpty
    private Map<String, Object> formFields;
}
