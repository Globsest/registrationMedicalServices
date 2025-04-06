package com.globsest.regmedicaltest.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.globsest.regmedicaltest.entity.ServiceForm;
import com.globsest.regmedicaltest.entity.User;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.BaseFont;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.io.IOException;
import java.util.Map;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PDFGeneratorService {

    private final ObjectMapper objectMapper;
    private Font baseFont;
    private Font boldFont;

    public void export(HttpServletResponse response,
                       ServiceForm serviceForm,
                       User user,
                       Map<String, String> formData) throws IOException {

        Document document = new Document(PageSize.A4);
        PdfWriter pdfWriter = PdfWriter.getInstance(document, response.getOutputStream());

        document.open();
        document.addTitle("Медицинская карта");

        addUserInfo(document, user);
        addServiceInfo(document, serviceForm);
        addFormData(document, formData);
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

        PdfPCell headerCell = new PdfPCell(new Phrase("Услуга", new Font(baseFont.getBaseFont(), 12)));
        headerCell.setColspan(2);
        headerCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        headerCell.setBackgroundColor(new Color(220, 220, 220));
        table.addCell(headerCell);

        addTableRow(table, "Услуга", serviceForm.getMedicalService().getDescription());

        document.add(table);
    }

    private void addFormData(Document document, Map<String, String> formData)
            throws DocumentException, IOException {

        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(90);
        table.setSpacingBefore(15f);
        table.setHorizontalAlignment(Element.ALIGN_CENTER);

        // Заголовок раздела
        PdfPCell headerCell = new PdfPCell(new Phrase("Информация об услуге", new Font(baseFont.getBaseFont(), 12)));
        headerCell.setColspan(2);
        headerCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        headerCell.setBackgroundColor(new Color(220, 220, 220));
        table.addCell(headerCell);
        System.out.println(formData);

        for (Map.Entry<String, String> entry : formData.entrySet()) {
            addTableRow(table, entry.getKey(), entry.getValue());
        }

        document.add(table);
    }

    @PostConstruct
    public void initFonts() throws DocumentException, IOException {
        // Путь к шрифтам в resources (arial.ttf и arialbd.ttf должны быть в src/main/resources/fonts)
        String regularFontPath = "/fonts/arialmt.ttf";
        String boldFontPath = "/fonts/arial_bolditalicmt.ttf";

        BaseFont base = BaseFont.createFont(regularFontPath, BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
        BaseFont bold = BaseFont.createFont(boldFontPath, BaseFont.IDENTITY_H, BaseFont.EMBEDDED);

        this.baseFont = new Font(base, 10);
        this.boldFont = new Font(bold, 10);
    }
}
