package com.globsest.regmedicaltest.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.globsest.regmedicaltest.entity.ServiceForm;
import com.globsest.regmedicaltest.entity.User;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PDFGeneratorService {

    private final ObjectMapper objectMapper;


    public void export(HttpServletResponse response,
                       ServiceForm serviceForm,
                       User user,
                       Map<String, Object> formData) throws IOException {

        Document document = new Document(PageSize.A4);
        PdfWriter pdfWriter = PdfWriter.getInstance(document, response.getOutputStream());

        document.open();


        addUserInfo(document, user);
        addServiceInfo(document, serviceForm);
        addFormData(document, serviceForm.getFormStruct(), formData);
        document.close();

    }

    private void addUserInfo(Document document, User user) throws DocumentException {
//        Paragraph userHeader = new Paragraph("Patient Information:", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14));
//        document.add(userHeader);

        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10f);

        addTableRow(table, "Full Name", user.getLastName() + " " + user.getFirstName());
        addTableRow(table, "Email", user.getEmail());
        addTableRow(table, "SNILS", user.getSnils());
        addTableRow(table, "Passport", user.getPassport());
        addTableRow(table, "Birth Date", user.getBirthDate().toString());

        document.add(table);
    }


    private void addTableRow(PdfPTable table, String label, String value) {
        Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10);

        PdfPCell labelCell = new PdfPCell(new Phrase(label, boldFont));
        labelCell.setBorderWidth(0.5f);

        PdfPCell valueCell = new PdfPCell(new Phrase(value));
        valueCell.setBorderWidth(0.5f);

        table.addCell(labelCell);
        table.addCell(valueCell);
    }

    private void addServiceInfo(Document document, ServiceForm serviceForm) throws DocumentException {
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(90);
        table.setSpacingBefore(15f);
        table.setHorizontalAlignment(Element.ALIGN_CENTER);

        PdfPCell headerCell = new PdfPCell(new Phrase("Информация об услуге",
                FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14)));
        headerCell.setColspan(2);
        headerCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        headerCell.setBackgroundColor(new Color(220, 220, 220));
        table.addCell(headerCell);

        addTableRow(table, "Услуга", serviceForm.getMedicalService().getDescription());

        document.add(table);
    }

    private void addFormData(Document document, String formStructJson, Map<String, Object> formData)
            throws DocumentException, IOException {

        JsonNode formStructure = objectMapper.readTree(formStructJson);
        JsonNode fields = formStructure.path("fields");

        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(90);
        table.setSpacingBefore(15f);
        table.setHorizontalAlignment(Element.ALIGN_CENTER);

        PdfPCell headerCell = new PdfPCell(new Phrase("Данные формы",
                FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14)));
        headerCell.setColspan(2);
        headerCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        headerCell.setBackgroundColor(new Color(220, 220, 220));
        table.addCell(headerCell);

        fields.forEach(field -> {
            String fieldName = field.path("name").asText();
            String fieldLabel = field.path("label").asText(fieldName);
            Object value = formData.get(fieldName);

            addTableRow(table, fieldLabel, value != null ? value.toString() : "Не указано");
        });

        document.add(table);
    }

}
