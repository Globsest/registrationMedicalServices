package com.globsest.regmedicaltest.dto;

import lombok.Data;

@Data
public class EmailRequest {
    private String email;
    private Long recordId;
}
