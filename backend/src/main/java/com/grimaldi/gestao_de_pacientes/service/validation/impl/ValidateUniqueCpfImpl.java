package com.grimaldi.gestao_de_pacientes.service.validation.impl;

import com.grimaldi.gestao_de_pacientes.model.dto.PatientRequest;
import com.grimaldi.gestao_de_pacientes.exception.DuplicateCpfException;
import com.grimaldi.gestao_de_pacientes.repository.PatientRepository;
import com.grimaldi.gestao_de_pacientes.service.validation.CreatePatientValidation;
import org.springframework.stereotype.Component;

@Component
public class ValidateUniqueCpfImpl implements CreatePatientValidation {

    private final PatientRepository patientRepository;

    public ValidateUniqueCpfImpl(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    @Override
    public void validate(PatientRequest request) {
        if(patientRepository.findByCpf(request.cpf()).isPresent()) {
            throw new DuplicateCpfException("Cpf duplicado");
        }
    }
}
