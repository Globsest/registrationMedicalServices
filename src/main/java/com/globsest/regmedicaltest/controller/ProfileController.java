package com.globsest.regmedicaltest.controller;

import com.globsest.regmedicaltest.dto.DocumentDto;
import com.globsest.regmedicaltest.dto.UserInfoResponse;
import com.globsest.regmedicaltest.entity.User;
import com.globsest.regmedicaltest.entity.UserRecords;
import com.globsest.regmedicaltest.repository.UserRecordsRepository;
import com.globsest.regmedicaltest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final UserRepository userRepository;
    private final UserRecordsRepository userRecordsRepository;

    @GetMapping("/info")
    public ResponseEntity<UserInfoResponse> getProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        User user = userRepository.findByPassport(((UserDetails) authentication.getPrincipal()).getUsername());

        UserInfoResponse response = UserInfoResponse.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .passport(user.getPassport())
                .snils(user.getSnils())
                .email(user.getEmail())
                .birthDate(user.getBirthDate())
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/documents")
    public ResponseEntity<List<DocumentDto>> getDocuments() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        String passport = authentication.getName();
        List<UserRecords> records = userRecordsRepository.findByUser_Id(userRepository.findByPassport(passport).getId());

        List<DocumentDto> documents = records.stream()
                .map(record -> new DocumentDto(
                        record.getRecordId(),
                        record.getServices().getDescription(),
                        record.getCreatedAt()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(documents);
    }
}