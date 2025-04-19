package com.globsest.regmedicaltest.repository;

import com.globsest.regmedicaltest.entity.MedicalServices;
import com.globsest.regmedicaltest.entity.ServiceForm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceFormRepository extends JpaRepository<ServiceForm,Long> {
    ServiceForm findByMedicalService_ServiceId(Long serviceId);
    boolean existsByMedicalService(MedicalServices medicalService);

}
