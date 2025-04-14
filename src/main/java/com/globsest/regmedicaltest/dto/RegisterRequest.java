package com.globsest.regmedicaltest.dto;

import lombok.Data;

import java.util.Date;

@Data
public class RegisterRequest {

    private String passport;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String snils;
    private Date birthDate;

}
