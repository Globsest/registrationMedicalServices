package com.globsest.regmedicaltest;

import lombok.Data;

@Data
public class SigninRequest {
    private String passport;
    private String password;
}
