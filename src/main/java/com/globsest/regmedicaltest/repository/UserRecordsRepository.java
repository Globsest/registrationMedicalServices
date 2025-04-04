package com.globsest.regmedicaltest.repository;

import com.globsest.regmedicaltest.entity.PdfDocument;
import com.globsest.regmedicaltest.entity.ServiceForm;
import com.globsest.regmedicaltest.entity.UserRecords;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRecordsRepository extends JpaRepository<UserRecords,Long> {
    List<UserRecords> findByUser_Id(Long userId);
}
