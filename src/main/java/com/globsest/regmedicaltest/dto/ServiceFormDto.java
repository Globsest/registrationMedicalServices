package com.globsest.regmedicaltest.dto;

import lombok.Data;

@Data
public class ServiceFormDto {
    private Long serviceId;
    private String formStruct;
    private String pdfTemplate;

}