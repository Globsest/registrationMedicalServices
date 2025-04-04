package com.globsest.regmedicaltest;

import lombok.Data;

@Data
public class SigninResponse {
    private String token;

    public SigninResponse(String token) {
        this.token = token;
    }
}
