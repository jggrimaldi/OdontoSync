package com.grimaldi.gestao_de_pacientes.model.dto;

import com.grimaldi.gestao_de_pacientes.model.entity.Patient;

import java.util.UUID;

public record PatientResponse(
        UUID id,
        String name,
        String cpf,
        String phone,
        Integer age,
        String notes,
        String imageUrl
    ) {
    public PatientResponse(Patient patient) {
        this(
                patient.getId(),
                patient.getName(),
                patient.getCpf(),
                patient.getPhone(),
                patient.getAge(),
                patient.getNotes(),
                patient.getImageUrl()
        );
    }
}
