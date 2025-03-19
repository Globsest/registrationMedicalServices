package com.globsest.regmedicaltest.repository;

import com.globsest.regmedicaltest.entity.ServiceForm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceFormRepository extends JpaRepository<ServiceForm,Long> {
    List<ServiceForm> findByMedicalService_ServiceId(Long service_id);
}
