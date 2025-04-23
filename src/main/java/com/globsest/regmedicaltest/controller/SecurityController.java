package com.globsest.regmedicaltest.controller;

import com.globsest.regmedicaltest.dto.*;
import com.globsest.regmedicaltest.service.UserService;
import com.globsest.regmedicaltest.token.JWTCore;
import com.globsest.regmedicaltest.entity.User;
import com.globsest.regmedicaltest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class SecurityController {

    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private AuthenticationManager authenticationManager;
    private JWTCore jwtCore;
    private UserService userService;

    @Autowired
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    @Autowired
    public void setPasswordEncoder(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }
    @Autowired
    public void setAuthenticationManager(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    @Autowired
    public void setJwtCore(JWTCore jwtCore) {
        this.jwtCore = jwtCore;
    }
    @Autowired
    public void setUserService(UserService userService) {
        this.userService = userService;
    }


    @PostMapping("/register")
    ResponseEntity<?> signup(@RequestBody RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            return ResponseEntity.status(HttpStatus.FOUND).build();
        }
        if (userRepository.existsBySnils(registerRequest.getSnils())) {
            return ResponseEntity.status(HttpStatus.FOUND).build();
        }
        if (userRepository.existsByPassport(registerRequest.getPassport())) {
            return ResponseEntity.status(HttpStatus.FOUND).build();
        }

        User user = new User();
        user.setPassport(registerRequest.getPassport());
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setSnils(registerRequest.getSnils());
        user.setBirthDate(registerRequest.getBirthDate());
        userRepository.save(user);
        return ResponseEntity.ok("User created successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getPassport(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        String accessToken = jwtCore.generateAccessToken(userDetails);
        String refreshToken = jwtCore.generateRefreshToken(userDetails);

        return ResponseEntity.ok(new AuthResponse(
                accessToken,
                refreshToken
        ));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody RefreshRequest refreshRequest) {
        if (!jwtCore.validateToken(refreshRequest.getRefreshToken(), true)) {
            return ResponseEntity.badRequest().body("Invalid refresh token");
        }

        String passport = jwtCore.getUsernameFromToken(refreshRequest.getRefreshToken(), true);
        UserDetails userDetails = userService.loadUserByUsername(passport);

        String newAccessToken = jwtCore.generateAccessToken(userDetails);
        String newRefreshToken = jwtCore.generateRefreshToken(userDetails);

        return ResponseEntity.ok(new AuthResponse(
                newAccessToken,
                newRefreshToken
        ));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok("Logout successful");
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest changePasswordRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }

        String passport = null;

        //Из UserDetails
        if (authentication.getPrincipal() instanceof UserDetails) {
            passport = ((UserDetails) authentication.getPrincipal()).getUsername();
        }
        //Из строки
        else if (authentication.getPrincipal() instanceof String) {
            passport = (String) authentication.getPrincipal();
        }
        //Из имени аутентификации
        else {
            passport = authentication.getName();
        }

        User user = userRepository.findByPassport(passport);

        if (!passwordEncoder.matches(changePasswordRequest.getCurrentPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid current password");
        }

        if (passwordEncoder.matches(changePasswordRequest.getNewPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("New password must be different from old password");
        }

        user.setPassword(passwordEncoder.encode(changePasswordRequest.getNewPassword()));
        userRepository.save(user);

        //принудительный выход
        SecurityContextHolder.clearContext();

        return ResponseEntity.ok("Password changed successfully. Please login again.");
        
    }

}
