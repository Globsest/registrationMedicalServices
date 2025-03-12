package com.globsest.regmedicaltest;

import lombok.Data;

@Data
public class SignupRequest {
    private String snils;
    private String email;
    private String password;

}
