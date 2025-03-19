package com.globsest.regmedicaltest.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Entity
@Data
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String passport;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String snils;
    private Date birthDate;

}
