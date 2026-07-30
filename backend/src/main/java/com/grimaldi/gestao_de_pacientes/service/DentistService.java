package com.grimaldi.gestao_de_pacientes.service;

import com.grimaldi.gestao_de_pacientes.exception.IdNotExistException;
import com.grimaldi.gestao_de_pacientes.model.dto.*;
import com.grimaldi.gestao_de_pacientes.model.entity.Appointment;
import com.grimaldi.gestao_de_pacientes.model.entity.Dentist;
import com.grimaldi.gestao_de_pacientes.exception.DuplicateEmailException;
import com.grimaldi.gestao_de_pacientes.repository.DentistRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class DentistService {

    private final DentistRepository dentistRepository;
    private final PasswordEncoder passwordEncoder;

    public DentistService(DentistRepository dentistRepository, PasswordEncoder passwordEncoder) {
        this.dentistRepository = dentistRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Dentist createDentist (DentistRequest request) {
        //Validar se o e-mail já está em uso
        if (dentistRepository.findByEmail(request.email()).isPresent()) {
            throw new DuplicateEmailException("E-mail já cadastrado"); // Use uma exception customizada aqui
        }

        Dentist dentist = new Dentist();

        dentist.setName(request.name());
        dentist.setEmail(request.email());

        //Criptografia obrigatória para o Spring Security
        dentist.setPassword(passwordEncoder.encode(request.password()));
        dentist.setCro(request.cro());

        //Forçar a Role correta
        dentist.setRole("ROLE_DENTIST");

        return dentistRepository.save(dentist);
    }

    public Dentist getDentistByEmail(String email) {
        return dentistRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Dentista não encontrado: " + email));
    }

    @Transactional
    public DentistResponse updateImageProfile(String email, DentistUpdateProfileRequest updateRequest) {
        Dentist dentist = getDentistByEmail(email);

        //Verifica se foi recebido algo no DTO
        if (updateRequest.imageUrl() != null) {
            dentist.setImageUrl(updateRequest.imageUrl());
        }

        return new DentistResponse(dentistRepository.save(dentist));
    }

    public Dentist updateDentistByEmail(String email, DentistUpdateRequest request) {
        Dentist dentist = getDentistByEmail(email);

        if (request.name() != null && !request.name().isBlank()) {
            dentist.setName(request.name().trim());
        }

        if (request.cro() != null) {
            dentist.setCro(request.cro());
        }

        if (request.email() != null && !request.email().isBlank()) {
            String newEmail = request.email().trim();
            if (!newEmail.equals(dentist.getEmail()) &&
                    dentistRepository.findByEmail(newEmail).isPresent()) {
                throw new DuplicateEmailException("E-mail já cadastrado");
            }
            dentist.setEmail(newEmail);
        }

        if (request.password() != null && !request.password().isBlank()) {
            dentist.setPassword(passwordEncoder.encode(request.password()));
        }

        return dentistRepository.save(dentist);
    }
}



