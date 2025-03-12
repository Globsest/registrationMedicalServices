package com.globsest.regmedicaltest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class RegMedicalTestApplication {
    private JWTCore jwtCore;

    @Autowired
    public void setJwtCore(JWTCore jwtCore) {
        this.jwtCore = jwtCore;
    }

    public static void main(String[] args) {
        SpringApplication.run(RegMedicalTestApplication.class, args);
    }



}
