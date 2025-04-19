package com.globsest.regmedicaltest.controller;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.globsest.regmedicaltest.dto.MedicalServiceDto;
import com.globsest.regmedicaltest.dto.ServiceFormDto;
import com.globsest.regmedicaltest.entity.MedicalServices;
import com.globsest.regmedicaltest.entity.ServiceForm;
import com.globsest.regmedicaltest.service.MedicalAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    private final MedicalAdminService adminService;

    @PostMapping("/createService")
    public ResponseEntity<MedicalServices> createService(@RequestBody MedicalServiceDto dto) {
        return ResponseEntity.ok(adminService.createMedicalService(dto));
    }

    @PutMapping("/updateService/{id}")
    public ResponseEntity<MedicalServices> updateService(
            @PathVariable Long id,
            @RequestBody MedicalServiceDto dto) {
        return ResponseEntity.ok(adminService.updateMedicalService(id, dto));
    }

    @DeleteMapping("/deleteService/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        adminService.deleteMedicalService(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/createForm")
    public ResponseEntity<ServiceForm> createForm(@RequestBody ServiceFormDto dto) {
        return ResponseEntity.ok(adminService.createServiceForm(dto));
    }

    @PutMapping("/updateForm/{id}")
    public ResponseEntity<ServiceForm> updateFullFormStructure(
            @PathVariable Long id,
            @RequestBody String jsonStructure) throws JsonProcessingException {
        return ResponseEntity.ok(adminService.updateServiceFormStructure(id, jsonStructure));
    }

    @PatchMapping("/updateForm/{id}/structure")
    public ResponseEntity<ServiceForm> partialUpdateFormStructure(
            @PathVariable Long id,
            @RequestBody String jsonUpdates) throws JsonProcessingException {
        return ResponseEntity.ok(adminService.partialUpdateServiceForm(id, jsonUpdates));
    }

    @DeleteMapping("/deleteForm/{id}")
    public ResponseEntity<Void> deleteForm(@PathVariable Long id) {
        adminService.deleteServiceForm(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("{serviceId}/forms")
    public ResponseEntity<List<ServiceForm>> getFormsByService(@PathVariable Long serviceId) {
        return ResponseEntity.ok(adminService.getFormsByServiceId(serviceId));
    }

    @GetMapping("/forms/{id}")
    public ResponseEntity<ServiceForm> getFormById(@PathVariable Long id) {
        return adminService.getFormById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

