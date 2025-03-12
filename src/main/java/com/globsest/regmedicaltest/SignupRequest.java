package com.globsest.regmedicaltest;

import lombok.Data;

import java.util.Date;

@Data
public class SignupRequest {

    private String passport;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String snils;
    private Date birthDate;

}
