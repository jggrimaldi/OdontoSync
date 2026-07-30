package com.grimaldi.gestao_de_pacientes.service.validation;

import com.grimaldi.gestao_de_pacientes.model.dto.PatientRequest;

public interface CreatePatientValidation {
    void validate(PatientRequest request);
}
