package com.globsest.regmedicaltest.service;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.globsest.regmedicaltest.entity.MedicalServices;
import com.globsest.regmedicaltest.entity.User;
import com.globsest.regmedicaltest.entity.UserRecords;
import com.globsest.regmedicaltest.repository.MedicalServicesRepository;
import com.globsest.regmedicaltest.repository.UserRecordsRepository;
import com.globsest.regmedicaltest.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class FormService {

    private final UserRecordsRepository recordsRepo;
    private final UserRepository userRepo;
    private final MedicalServicesRepository medicalServiceRepo;
    private final ObjectMapper objectMapper;

    @Transactional
    public Long saveForm(Long userId, Long serviceId, Map<String, Object> formData)
            throws JsonProcessingException {

        User user = userRepo.findById(userId).orElseThrow();
        MedicalServices service = medicalServiceRepo.findById(serviceId).orElseThrow();

        UserRecords record = new UserRecords();
        record.setUser(user);
        record.setServices(service);
        record.setFormData(objectMapper.writeValueAsString(formData));

        return recordsRepo.save(record).getRecordId();
    }
}
