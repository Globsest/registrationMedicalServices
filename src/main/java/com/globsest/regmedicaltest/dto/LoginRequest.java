package com.globsest.regmedicaltest.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String passport;
    private String password;
}
