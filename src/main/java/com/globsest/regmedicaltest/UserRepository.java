package com.globsest.regmedicaltest;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findBySnils(String snils);
    User findByEmail(String email);

    Boolean existsByEmail(String email);
    Boolean existsBySnils(String snils);
}
