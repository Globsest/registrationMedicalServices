package com.globsest.regmedicaltest.service;

import com.globsest.regmedicaltest.UserDetailsImpl;
import com.globsest.regmedicaltest.entity.MedicalServices;
import com.globsest.regmedicaltest.entity.ServiceForm;
import com.globsest.regmedicaltest.entity.User;
import com.globsest.regmedicaltest.repository.MedicalServicesRepository;

import com.globsest.regmedicaltest.repository.ServiceFormRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MedicalServiceService {

    private final MedicalServicesRepository medicalServicesRepository;
    private final ServiceFormRepository serviceFormRepository;

    public List<MedicalServices> getAllMedicalServices() {
        return medicalServicesRepository.findByIsActiveTrue();
    }

    public ServiceForm getServiceByMedicalService(Long service_id) {
        return serviceFormRepository.findByMedicalService_ServiceId(service_id);
    }


}
