package com.globsest.regmedicaltest.controller;


import com.globsest.regmedicaltest.entity.MedicalServices;
import com.globsest.regmedicaltest.entity.ServiceForm;
import com.globsest.regmedicaltest.repository.MedicalServicesRepository;
import com.globsest.regmedicaltest.service.MedicalServiceService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class MedicalServicesController {

    private final MedicalServiceService medicalServiceService;

    @GetMapping
    ResponseEntity<List<MedicalServices>> getAllMedicalServices() {
        return ResponseEntity.ok(medicalServiceService.getAllMedicalServices());
    }

    @GetMapping("/{serviceId}/form")
    ResponseEntity<List<ServiceForm>> getServiceByMedicalService(@PathVariable String serviceId) {
        return ResponseEntity.ok(medicalServiceService.getServiceByMedicalService(Long.valueOf(serviceId)));
    }
}
