package com.grimaldi.gestao_de_pacientes.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.UUID;

public record AppointmentRequest(@NotNull UUID patientId, @NotBlank String title, @NotNull LocalDate date) {
}
