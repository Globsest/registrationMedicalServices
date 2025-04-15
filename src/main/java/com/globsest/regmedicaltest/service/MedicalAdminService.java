package com.globsest.regmedicaltest.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.globsest.regmedicaltest.dto.MedicalServiceDto;
import com.globsest.regmedicaltest.dto.ServiceFormDto;
import com.globsest.regmedicaltest.entity.MedicalServices;
import com.globsest.regmedicaltest.entity.ServiceForm;
import com.globsest.regmedicaltest.repository.MedicalServicesRepository;
import com.globsest.regmedicaltest.repository.ServiceFormRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class MedicalAdminService {

    private final MedicalServicesRepository medicalServicesRepository;
    private final ServiceFormRepository serviceFormRepository;
    private final ObjectMapper objectMapper;


    @Transactional
    public MedicalServices createMedicalService(MedicalServiceDto dto) {
        MedicalServices medicalService = new MedicalServices();
        medicalService.setDescription(dto.getDescription());
        medicalService.setActive(dto.isActive());
        return medicalServicesRepository.save(medicalService);
    }

    @Transactional
    public MedicalServices updateMedicalService(Long id, MedicalServiceDto dto) {
        MedicalServices medicalService = medicalServicesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medical service not found"));
        medicalService.setDescription(dto.getDescription());
        medicalService.setActive(dto.isActive());
        return medicalServicesRepository.save(medicalService);
    }

    @Transactional
    public void deleteMedicalService(Long id) {
        List<ServiceForm> forms = (List<ServiceForm>) serviceFormRepository.findByMedicalService_ServiceId(id);
        serviceFormRepository.deleteAll(forms);
        medicalServicesRepository.deleteById(id);
    }

    @Transactional
    public ServiceForm createServiceForm(ServiceFormDto dto) {
        ServiceForm form = new ServiceForm();
        form.setMedicalService(medicalServicesRepository.findById(dto.getServiceId())
                .orElseThrow(() -> new RuntimeException("Medical service not found")));
        form.setFormStruct(dto.getFormStruct());
        form.setPdf_template(dto.getPdfTemplate());
        return serviceFormRepository.save(form);
    }

    @Transactional
    public ServiceForm updateServiceFormStructure(Long formId, String jsonPatch) throws JsonProcessingException {
        ServiceForm form = serviceFormRepository.findById(formId)
                .orElseThrow(() -> new RuntimeException("Form not found"));

        form.setFormStruct(jsonPatch);
        return serviceFormRepository.save(form);
    }

    @Transactional
    public ServiceForm partialUpdateServiceForm(Long formId, String jsonUpdates) throws JsonProcessingException {
        ServiceForm form = serviceFormRepository.findById(formId)
                .orElseThrow(() -> new RuntimeException("Form not found"));

        JsonNode existingStruct = objectMapper.readTree(form.getFormStruct());

        JsonNode updates = objectMapper.readTree(jsonUpdates);

        if (existingStruct != null && updates instanceof ObjectNode) {
            ((ObjectNode) existingStruct).setAll((ObjectNode) updates);
        }

        form.setFormStruct(existingStruct.toString());
        return serviceFormRepository.save(form);
    }

    @Transactional
    public void deleteServiceForm(Long formId) {
        serviceFormRepository.deleteById(formId);
    }

    public List<MedicalServices> getAllMedicalServices() {
        return medicalServicesRepository.findAll();
    }

    public Optional<MedicalServices> getMedicalServiceById(Long id) {
        return medicalServicesRepository.findById(id);
    }

    public List<ServiceForm> getFormsByServiceId(Long serviceId) {
        return (List<ServiceForm>) serviceFormRepository.findByMedicalService_ServiceId(serviceId);
    }

    public Optional<ServiceForm> getFormById(Long formId) {
        return serviceFormRepository.findById(formId);
    }
}
