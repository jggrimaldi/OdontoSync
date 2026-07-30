package com.grimaldi.gestao_de_pacientes.repository;

import com.grimaldi.gestao_de_pacientes.model.entity.Appointment;
import com.grimaldi.gestao_de_pacientes.enums.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {

    //para ordenar automaticamente por horário
    List<Appointment> findByDateBetweenAndStatusInOrderByDateAsc(
            LocalDate startDate,
            LocalDate endDate,
            List<AppointmentStatus> status
    );

    List<Appointment> findByPatientIdOrderByDateDesc(UUID patientId);

    Boolean existsByPatientId(UUID patientId);

    List<Appointment> findAllByDentistEmail(String email);

// Filtra por: Período de Data + Lista de Status + E-mail da Dentista
    List<Appointment> findByDateBetweenAndStatusInAndDentistEmailOrderByDateAsc(
            LocalDate startDate,
            LocalDate endDate,
            List<AppointmentStatus> status,
            String email
    );

    // Filtra o histórico do paciente apenas para as consultas daquele dentista
    List<Appointment> findByPatientIdAndDentistEmail(UUID patientId, String email);
}

