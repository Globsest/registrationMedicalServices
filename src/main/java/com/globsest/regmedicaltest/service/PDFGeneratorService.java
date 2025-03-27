package com.globsest.regmedicaltest.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.globsest.regmedicaltest.entity.ServiceForm;
import com.globsest.regmedicaltest.entity.User;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class PDFGeneratorService {

    private final ObjectMapper objectMapper;


    public void export(HttpServletResponse response,
//                       ServiceForm serviceForm,
                       User user) throws IOException {

//        JsonNode formStructure = objectMapper.readTree(serviceForm.getFormStruct());

        Document document = new Document(PageSize.A4);
        PdfWriter pdfWriter = PdfWriter.getInstance(document, response.getOutputStream());

        document.open();

//        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16);
////        Paragraph title = new Paragraph(serviceForm.getMedicalService().getDescription(), titleFont);
//        title.setAlignment(Element.ALIGN_CENTER);
//        document.add(title);

        addUserInfo(document, user);
        document.close();

    }

    private void addUserInfo(Document document, User user) throws IOException {

        Paragraph userHeader = new Paragraph("Info about pacient:", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16));
        document.add(userHeader);

        Paragraph pacientFIO = new Paragraph("FIO: " + user.getLastName() + "  " + user.getFirstName(), FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12));
        pacientFIO.setAlignment(Element.ALIGN_LEFT);
        document.add(pacientFIO);

        Paragraph pacientEmail = new Paragraph("Email: " + user.getEmail(), FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12));
        pacientEmail.setAlignment(Element.ALIGN_LEFT);
        document.add(pacientEmail);

        Paragraph pacientSnils = new Paragraph("Snils: " + user.getSnils(), FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12));
        pacientSnils.setAlignment(Element.ALIGN_LEFT);
        document.add(pacientSnils);

    }

}
