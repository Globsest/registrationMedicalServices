package com.globsest.regmedicaltest.repository;

import com.globsest.regmedicaltest.entity.PdfDocument;
import com.globsest.regmedicaltest.entity.ServiceForm;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PdfDocumentRepository extends JpaRepository<PdfDocument, Long> {

    Optional<PdfDocument> findByRecord_RecordId(Long recordId);


}
