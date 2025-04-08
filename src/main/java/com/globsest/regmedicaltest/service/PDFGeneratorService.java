package com.globsest.regmedicaltest.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.globsest.regmedicaltest.entity.ServiceForm;
import com.globsest.regmedicaltest.entity.User;
import com.globsest.regmedicaltest.entity.UserRecords;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.Image;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.BaseFont;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.Map;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PDFGeneratorService {

    private final ObjectMapper objectMapper;
    private Font baseFont;
    private Font boldFont;
    private Font titleFont;
    private Font headerFont;

    public void export(HttpServletResponse response,
                       ServiceForm serviceForm,
                       User user,
                       Map<String, Object> formData,
                       UserRecords record) throws IOException {

        Document document = new Document(PageSize.A4);
        PdfWriter pdfWriter = PdfWriter.getInstance(document, response.getOutputStream());

        document.open();

        document.addTitle("Медицинская карта");
        addLogo(document);
        addDocumentHeader(document);

        addIntroText(document, user, serviceForm);
        addUserInfo(document, user);
        addAgree(document);

        addServiceInfo(document, serviceForm);
        addFormData(document, formData);
        addConcludingText(document);
        addSignatureAndDate(document, record);

        document.close();

    }

    private void addLogo(Document document) throws DocumentException, IOException {
        try {
            Image logo = Image.getInstance(new ClassPathResource("img/logo_black.png").getURL());
            logo.scalePercent(15);
            logo.setAlignment(Image.ALIGN_LEFT);
            document.add(logo);
        } catch (Exception e) {
            Paragraph noLogo = new Paragraph("Медицинский центр", titleFont);
            noLogo.setAlignment(Element.ALIGN_CENTER);
            document.add(noLogo);
        }
        document.add(new Paragraph(" "));
    }

    private void addDocumentHeader(Document document) throws DocumentException {
        Paragraph header = new Paragraph("Запись на прием", titleFont);
        header.setAlignment(Element.ALIGN_CENTER);
        header.setSpacingAfter(20f);
        document.add(header);
    }


    private void addIntroText(Document document, User user, ServiceForm serviceForm) throws DocumentException {
        Paragraph intro = new Paragraph();
        intro.setFirstLineIndent(20);
        intro.setFont(baseFont);
        intro.setAlignment(Element.ALIGN_JUSTIFIED);
        intro.add("Я, ");
        intro.add(new Phrase(user.getLastName() + " " + user.getFirstName() + " ", boldFont));
        intro.add(", настоящим заявлением подтверждаю свое согласие на оказание медицинской услуги \"");
        intro.add(new Phrase(serviceForm.getMedicalService().getDescription(), boldFont));
        intro.add("\" и предоставляю следующие персональные данные:");
        intro.setSpacingAfter(10f);
        document.add(intro);
    }

    private void addUserInfo(Document document, User user) throws DocumentException {
//        Paragraph userHeader = new Paragraph("Patient Information:", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14));
//        document.add(userHeader);

        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10f);

        addTableRow(table, "Полное имя", user.getLastName() + " " + user.getFirstName());
        addTableRow(table, "Почта", user.getEmail());
        addTableRow(table, "Снилс", user.getSnils());
        addTableRow(table, "Паспортные данные", user.getPassport());
        addTableRow(table, "Дата рождения", user.getBirthDate().toString());

        document.add(table);
    }

    private void addAgree(Document document) throws DocumentException {
        Paragraph details = new Paragraph();
        details.setFirstLineIndent(20);
        details.setFont(baseFont);
        details.setAlignment(Element.ALIGN_JUSTIFIED);
        details.add("Подтверждаю, что ознакомлен(а) с условиями оказания медицинской услуги " +
                "включая возможные противопоказания и ограничения." +
        "Я даю согласие на обработку моих персональных данных" +
                " в соответствии с Федеральным законом №152-ФЗ \"О персональных данных\".");
        details.setSpacingBefore(10f);
        details.setSpacingAfter(15f);
        document.add(details);
    }

    private void addTableRow(PdfPTable table, String label, String value) {
            PdfPCell labelCell = new PdfPCell(new Phrase(label, boldFont));
            labelCell.setBorderWidth(0.5f);

            PdfPCell valueCell = new PdfPCell(new Phrase(value));
            valueCell.setBorderWidth(0.5f);

            table.addCell(labelCell);
            table.addCell(valueCell);
    }


    private void addConcludingText(Document document) throws DocumentException {
        Paragraph concluding = new Paragraph();
        concluding.setFont(baseFont);
        concluding.setFirstLineIndent(20);
        concluding.setAlignment(Element.ALIGN_JUSTIFIED);
        concluding.add("Подписав настоящее заявление, я подтверждаю достоверность предоставленных сведений и свое согласие на оказание медицинской услуги в соответствии с установленными стандартами и правилами медицинского учреждения.");
        concluding.setSpacingBefore(15f);
        concluding.setSpacingAfter(20f);
        document.add(concluding);
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

    private void addSignatureAndDate(Document document, UserRecords record) throws DocumentException {
        document.add(new Paragraph(" "));
        document.add(new Paragraph(" "));

        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{1, 1});
        table.setSpacingBefore(20f);

        PdfPCell dateCell = new PdfPCell();
        dateCell.setBorder(Rectangle.NO_BORDER);
        dateCell.setHorizontalAlignment(Element.ALIGN_LEFT);

        Paragraph dateParagraph = new Paragraph();
        dateParagraph.add(new Phrase("Дата записи: ", baseFont));

        String formattedDate;
        try {
            LocalDateTime recordDate = record != null ? record.getCreatedAt() : null;
            formattedDate = recordDate != null ?
                    recordDate.format(DateTimeFormatter.ofPattern("dd.MM.yyyy")) :
                    LocalDate.now().format(DateTimeFormatter.ofPattern("dd.MM.yyyy"));
        } catch (Exception e) {
            formattedDate = LocalDate.now().format(DateTimeFormatter.ofPattern("dd.MM.yyyy"));
        }

        dateParagraph.add(new Phrase(formattedDate, baseFont));
        dateCell.addElement(dateParagraph);
        table.addCell(dateCell);

        PdfPCell signatureCell = new PdfPCell();
        signatureCell.setBorder(Rectangle.NO_BORDER);
        signatureCell.setHorizontalAlignment(Element.ALIGN_RIGHT);

        Paragraph signatureParagraph = new Paragraph();
        signatureParagraph.add(new Phrase("Подпись: _________________", baseFont));
        signatureParagraph.setSpacingBefore(30f);
        signatureCell.addElement(signatureParagraph);
        table.addCell(signatureCell);

        document.add(table);
    }


    private void addFormData(Document document, Map<String, Object> formData)
            throws DocumentException, IOException {

        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(90);
        table.setSpacingBefore(15f);
        table.setHorizontalAlignment(Element.ALIGN_CENTER);

        PdfPCell headerCell = new PdfPCell(new Phrase("Информация об услуге", new Font(baseFont.getBaseFont(), 12)));
        headerCell.setColspan(2);
        headerCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        headerCell.setBackgroundColor(new Color(220, 220, 220));
        table.addCell(headerCell);
        System.out.println(formData);

        for (Map.Entry<String, Object> entry : formData.entrySet()) {
            String value = entry.getValue() != null ? entry.getValue().toString() : "";
            addTableRow(table, entry.getKey(), value);
        }

        document.add(table);
    }

    @PostConstruct
    public void initFonts() throws DocumentException, IOException {

        String regularFontPath = "/fonts/Arial.ttf";
        String boldFontPath = "/fonts/Arialbold.ttf";

        BaseFont base = BaseFont.createFont(regularFontPath, BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
        BaseFont bold = BaseFont.createFont(boldFontPath, BaseFont.IDENTITY_H, BaseFont.EMBEDDED);

        this.baseFont = new Font(base, 12);
        this.boldFont = new Font(bold, 12);
        this.headerFont = new Font(bold, 14);
        this.titleFont = new Font(base, 16, Font.BOLD);
    }
}
