package com.grimaldi.gestao_de_pacientes.service.validation;

import com.grimaldi.gestao_de_pacientes.model.dto.AppointmentRequest;

public interface CreateAppointmentValidation {

    void validate(AppointmentRequest request);
}
