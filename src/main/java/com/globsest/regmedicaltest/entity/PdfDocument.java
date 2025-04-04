package com.globsest.regmedicaltest.entity;


import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "pdf_documents")
public class PdfDocument {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "pdfdocuments_seq")
    @SequenceGenerator(name = "pdfdocuments_seq", sequenceName = "pdfdocuments_document_id_seq")
    @Column(name = "document_id")
    private Long documentId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "record_id", nullable = false)
    private UserRecords record;

    @Column(name = "file_path", nullable = false)
    private String filePath;

    @Column(name = "generated_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime generatedAt;
}