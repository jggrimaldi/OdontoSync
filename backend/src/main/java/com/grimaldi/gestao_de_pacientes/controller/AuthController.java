package com.grimaldi.gestao_de_pacientes.controller;

import com.grimaldi.gestao_de_pacientes.model.dto.AuthLoginResponse;
import com.grimaldi.gestao_de_pacientes.model.dto.DentistResponse;
import com.grimaldi.gestao_de_pacientes.model.dto.LoginRequest;
import com.grimaldi.gestao_de_pacientes.model.entity.Dentist;
import com.grimaldi.gestao_de_pacientes.repository.DentistRepository;
import com.grimaldi.gestao_de_pacientes.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private  final JwtUtil jwtUtil;
    private final DentistRepository dentistRepository;

    public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil, DentistRepository dentistRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.dentistRepository = dentistRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthLoginResponse> login(@RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        Dentist dentist = dentistRepository.findByEmail(request.email())
                .orElseThrow(() -> new UsernameNotFoundException("Dentista não encontrado"));

        String token = jwtUtil.generateToken(authentication.getName());

        return ResponseEntity.ok(new AuthLoginResponse(
                token,
                new DentistResponse(dentist)
        ));
    }
}
