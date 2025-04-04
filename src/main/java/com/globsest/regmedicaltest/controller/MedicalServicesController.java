package com.globsest.regmedicaltest.controller;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.globsest.regmedicaltest.UserDetailsImpl;
import com.globsest.regmedicaltest.dto.FormDataDto;
import com.globsest.regmedicaltest.entity.MedicalServices;
import com.globsest.regmedicaltest.entity.ServiceForm;
import com.globsest.regmedicaltest.entity.User;
import com.globsest.regmedicaltest.repository.MedicalServicesRepository;
import com.globsest.regmedicaltest.service.FormService;
import com.globsest.regmedicaltest.service.MedicalServiceService;
import jakarta.validation.Valid;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class MedicalServicesController {

    private final MedicalServiceService medicalServiceService;
    private final FormService formService;

    @GetMapping
    ResponseEntity<List<MedicalServices>> getAllMedicalServices() {
        return ResponseEntity.ok(medicalServiceService.getAllMedicalServices());
    }


    @PostMapping("/submit")
    ResponseEntity<Long> submitForm(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody FormDataDto formDataDto) throws JsonProcessingException {

        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated");
        }

        Long recordId = formService.saveForm(
                userDetails.getId(),
                formDataDto.getServiceId(),
                formDataDto.getFormFields()
        );

        return ResponseEntity.ok(recordId);
    }
}
