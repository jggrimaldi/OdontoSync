package com.grimaldi.gestao_de_pacientes.service.validation.impl;

import com.grimaldi.gestao_de_pacientes.model.entity.Appointment;
import com.grimaldi.gestao_de_pacientes.enums.AppointmentStatus;
import com.grimaldi.gestao_de_pacientes.exception.StatusNotPendingException;
import com.grimaldi.gestao_de_pacientes.service.validation.StatusPendingValidation;
import org.springframework.stereotype.Component;

@Component
public class ValidatePendingStatusImpl implements StatusPendingValidation {
    @Override
    public void validate(Appointment appointment) {
        if (appointment.getStatus() != AppointmentStatus.PENDING) {
            throw new StatusNotPendingException("Não foi possível confirmar a consulta");
        }
    }
}
