package com.globsest.regmedicaltest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class DocumentDto {
    private Long recordId;
    private String serviceName;
    private LocalDateTime createdAt;
}
