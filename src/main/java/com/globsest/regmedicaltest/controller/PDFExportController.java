package com.globsest.regmedicaltest.controller;

import com.globsest.regmedicaltest.entity.User;
import com.globsest.regmedicaltest.repository.UserRepository;
import com.globsest.regmedicaltest.service.MedicalServiceService;
import com.globsest.regmedicaltest.service.PDFGeneratorService;
import com.globsest.regmedicaltest.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

@RequiredArgsConstructor
@RestController
@RequestMapping("/pdf")
public class PDFExportController {

    private final MedicalServiceService medicalServiceService;

    private final PDFGeneratorService pdfGeneratorService;
    private final UserRepository userRepository;


    @GetMapping("/generate")
    public void generatePDF(HttpServletResponse response, String passport) throws Exception {
        response.setContentType("application/pdf");
        DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy:HH:mm:ss");
        String currentDateTime = dateFormat.format(new Date());

        User user = userRepository.findByPassport(passport);

        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=pdf_" + currentDateTime + ".pdf";
        response.setHeader(headerKey, headerValue);

        this.pdfGeneratorService.export(response, user);
    }
}
