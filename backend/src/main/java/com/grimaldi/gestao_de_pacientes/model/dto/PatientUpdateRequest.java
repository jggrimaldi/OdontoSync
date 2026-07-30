package com.grimaldi.gestao_de_pacientes.model.dto;

public record PatientUpdateRequest(
        String name,
        String phone,
        Integer age) {
}
