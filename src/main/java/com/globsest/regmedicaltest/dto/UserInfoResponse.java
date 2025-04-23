package com.globsest.regmedicaltest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.Date;

@Data
@Builder
public class UserInfoResponse {
    private String firstName;
    private String lastName;
    private String passport;
    private String snils;
    private String email;
    private Date birthDate;
}
