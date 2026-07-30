package com.grimaldi.gestao_de_pacientes.model.dto;

import java.time.LocalDate;

public record AppointmentUpdateRequest(String title, LocalDate date) {
}
