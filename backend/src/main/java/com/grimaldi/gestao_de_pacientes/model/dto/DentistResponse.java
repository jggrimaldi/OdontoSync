package com.grimaldi.gestao_de_pacientes.model.dto;

import com.grimaldi.gestao_de_pacientes.model.entity.Dentist;

import java.util.UUID;

public record DentistResponse(UUID id,  String name,String email, String cro, String role, String imageUrl) {
    public DentistResponse(Dentist dentist) {
        this(
                dentist.getId(),
                dentist.getName(),
                dentist.getEmail(),
                dentist.getCro(),
                dentist.getRole(),
                dentist.getImageUrl()
        );
    }
}
