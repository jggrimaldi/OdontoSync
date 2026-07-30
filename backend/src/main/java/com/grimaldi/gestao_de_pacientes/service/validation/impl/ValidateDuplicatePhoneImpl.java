package com.grimaldi.gestao_de_pacientes.service.validation.impl;

import com.grimaldi.gestao_de_pacientes.model.dto.PatientRequest;
import com.grimaldi.gestao_de_pacientes.exception.DuplicatePhoneException;
import com.grimaldi.gestao_de_pacientes.repository.PatientRepository;
import com.grimaldi.gestao_de_pacientes.service.validation.CreatePatientValidation;
import org.springframework.stereotype.Component;

@Component
public class ValidateDuplicatePhoneImpl implements CreatePatientValidation {

    public PatientRepository patientRepository;


    public ValidateDuplicatePhoneImpl(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    @Override
    public void validate(PatientRequest request) {
        if (patientRepository.findByPhone(request.phone()).isPresent()) {
            throw new DuplicatePhoneException("Telefone duplicado");
        }
    }
}
