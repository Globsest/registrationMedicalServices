package com.globsest.regmedicaltest.repository;

import com.globsest.regmedicaltest.entity.MedicalServices;
import com.globsest.regmedicaltest.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MedicalServicesRepository extends JpaRepository<MedicalServices, Long> {

    List<MedicalServices> findByIsActiveTrue();

}
