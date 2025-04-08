package com.globsest.regmedicaltest.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.globsest.regmedicaltest.entity.ServiceForm;
import com.globsest.regmedicaltest.entity.User;
import com.globsest.regmedicaltest.entity.UserRecords;
import com.globsest.regmedicaltest.repository.ServiceFormRepository;
import com.globsest.regmedicaltest.repository.UserRecordsRepository;
import com.globsest.regmedicaltest.repository.UserRepository;
import com.globsest.regmedicaltest.service.MedicalServiceService;
import com.globsest.regmedicaltest.service.PDFGeneratorService;
import com.globsest.regmedicaltest.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/pdf")
public class PDFExportController {


    private final UserRecordsRepository userRecordsRepository;
    private final PDFGeneratorService pdfGeneratorService;
    private final UserRepository userRepository;
    private final ServiceFormRepository serviceFormRepository;
    private final ObjectMapper objectMapper;

    @GetMapping("/{recordId}/pdf")
    public void generatePDF(@PathVariable Long recordId, HttpServletResponse response) throws Exception {

        UserRecords record = userRecordsRepository.findById(recordId).orElseThrow();
        User user = userRepository.findById(record.getUser().getId()).orElseThrow();
        ServiceForm form = (ServiceForm) serviceFormRepository.findByMedicalService_ServiceId(record.getServices().getServiceId());

        Map<String, Object> formData = objectMapper.readValue(
                record.getFormData(),
                new TypeReference<Map<String, Object>>() {}
        );


        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "filename=\"medical_form_"+recordId+".pdf\"");

        this.pdfGeneratorService.export(response,form,user,formData, record);
    }
}
