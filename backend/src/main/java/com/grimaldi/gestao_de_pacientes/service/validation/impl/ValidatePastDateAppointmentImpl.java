package com.grimaldi.gestao_de_pacientes.service.validation.impl;

import com.grimaldi.gestao_de_pacientes.model.dto.AppointmentRequest;
import com.grimaldi.gestao_de_pacientes.exception.PastDateException;
import com.grimaldi.gestao_de_pacientes.service.validation.CreateAppointmentValidation;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class ValidatePastDateAppointmentImpl implements CreateAppointmentValidation {
    @Override
    public void validate(AppointmentRequest request) {
        if (request.date().isBefore(LocalDate.now())) {
            throw new PastDateException("Data inválida");
        }
    }
}
