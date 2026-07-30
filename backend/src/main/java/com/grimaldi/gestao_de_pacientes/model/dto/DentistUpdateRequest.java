package com.grimaldi.gestao_de_pacientes.model.dto;

import jakarta.validation.constraints.Email;

public record DentistUpdateRequest(String name, @Email String email, String password, String cro) {}