package com.globsest.regmedicaltest.repository;

import com.globsest.regmedicaltest.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByPassport(String passport);
    User findByEmail(String email);

    Boolean existsByEmail(String email);
    Boolean existsBySnils(String snils);
    Boolean existsByPassport(String passport);
}
