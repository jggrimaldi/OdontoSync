package com.grimaldi.gestao_de_pacientes.service;

import com.grimaldi.gestao_de_pacientes.model.dto.AppointmentNoteUpdateRequest;
import com.grimaldi.gestao_de_pacientes.model.dto.AppointmentRequest;
import com.grimaldi.gestao_de_pacientes.model.dto.AppointmentResponse;
import com.grimaldi.gestao_de_pacientes.model.dto.AppointmentUpdateRequest;
import com.grimaldi.gestao_de_pacientes.model.entity.Appointment;
import com.grimaldi.gestao_de_pacientes.model.entity.Dentist;
import com.grimaldi.gestao_de_pacientes.model.entity.Patient;
import com.grimaldi.gestao_de_pacientes.enums.AppointmentStatus;
import com.grimaldi.gestao_de_pacientes.exception.OwnershipException;
import com.grimaldi.gestao_de_pacientes.exception.IdNotExistException;
import com.grimaldi.gestao_de_pacientes.repository.AppointmentRepository;
import com.grimaldi.gestao_de_pacientes.repository.DentistRepository;
import com.grimaldi.gestao_de_pacientes.repository.PatientRepository;
import com.grimaldi.gestao_de_pacientes.service.validation.CreateAppointmentValidation;
import com.grimaldi.gestao_de_pacientes.service.validation.StatusPendingValidation;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class AppointmentService {

    private final List<CreateAppointmentValidation> createAppointmentValidations;
    private final List<StatusPendingValidation> statusPendingValidations;
    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DentistRepository dentistRepository;
    private final PatientService patientService;

    public AppointmentService(List<CreateAppointmentValidation> createAppointmentValidations, List<StatusPendingValidation> statusPendingValidations, AppointmentRepository appointmentRepository, PatientRepository patientRepository, DentistService dentistService, DentistRepository dentistRepository, PatientService patientService) {
        this.createAppointmentValidations = createAppointmentValidations;
        this.statusPendingValidations = statusPendingValidations;
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.dentistRepository = dentistRepository;
        this.patientService = patientService;
    }

    @Transactional
    public Appointment creatAppointment(AppointmentRequest request) {
        Patient patient = patientRepository.findById(request.patientId())
                .orElseThrow(() -> new IdNotExistException("Id não encontrado"));

        patientService.validateOwnership(patient);

        Dentist dentist = dentistRepository.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName())
                .orElseThrow(() -> new UsernameNotFoundException("Usuario não encontrado"));

        createAppointmentValidations.forEach(v -> v.validate(request));


        Appointment appointment = new Appointment();
        appointment.setStatus(AppointmentStatus.PENDING);
        appointment.setPatient(patient);
        appointment.setDentist(dentist);
        appointment.setDate(request.date());
        appointment.setTitle(request.title());

        return appointmentRepository.save(appointment);
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> findAll() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        //Busca no banco
        List<Appointment> appointments = appointmentRepository.findAllByDentistEmail(email);

        //transforma a entidade em novos objetos Response e devolve para lista
        return appointments.stream()
                .map(AppointmentResponse::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public AppointmentResponse findById(UUID appointmentId){
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new IdNotExistException("Id não encontrado"));

        // Valida se a consulta pertence à dentista logada
        validateOwnership(appointment);

        return new AppointmentResponse(appointment);
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> findByPatient(UUID patientId) {
        // Valida se o paciente existe antes de buscar
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new IdNotExistException("Id não encontrado"));

        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        return appointmentRepository.findByPatientIdAndDentistEmail(patientId, email)
                .stream()
                .map(AppointmentResponse::new)
                .toList();
    }

    @Transactional
    public  AppointmentResponse updateNotePad(UUID appointmentId, AppointmentNoteUpdateRequest updateRequest) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new IdNotExistException("Id não encontrado"));

        validateOwnership(appointment);

        //Verifica se foi recebido algo no DTO
        if (updateRequest.notes() != null) {
            appointment.setNotes(updateRequest.notes());
        }
        if (updateRequest.imageUrl() != null) {
            appointment.setImageUrl(updateRequest.imageUrl());
        }

        return new AppointmentResponse(appointmentRepository.save(appointment));
    }

    @Transactional
    public AppointmentResponse updateDetails(UUID appointmentId,AppointmentUpdateRequest updateRequest) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new IdNotExistException("Id não encontrado"));

        validateOwnership(appointment);

        //Verifica se foi recebido algo no DTO
        if (updateRequest.title() != null) {
            appointment.setTitle(updateRequest.title());
        }
        if (updateRequest.date() != null) {
            appointment.setDate(updateRequest.date());
        }

        return new AppointmentResponse(appointmentRepository.save(appointment));
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getAgenda(LocalDate startDate, LocalDate endDate) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        List<AppointmentStatus> validStatus = List.of(AppointmentStatus.PENDING, AppointmentStatus.FINISHED);

        //Define a regra de negócio dos status (Agenda só mostra Pendentes e Finalizados)
        List<Appointment> agenda = appointmentRepository.findByDateBetweenAndStatusInAndDentistEmailOrderByDateAsc(startDate, endDate, validStatus, email);

        return agenda.stream()
                .map(AppointmentResponse::new)
                .toList();
    }

    @Transactional
    public AppointmentResponse finishAppointment(UUID appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new IdNotExistException("Id não encontrado"));

        validateOwnership(appointment);

        statusPendingValidations.forEach(v -> v.validate(appointment));

        appointment.setStatus(AppointmentStatus.FINISHED);
        return new AppointmentResponse(appointmentRepository.save(appointment));
    }

    @Transactional
    public AppointmentResponse cancelAppointment(UUID appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new IdNotExistException("Id não encontrado"));

        validateOwnership(appointment);

        statusPendingValidations.forEach(v -> v.validate(appointment));

        appointment.setStatus(AppointmentStatus.CANCELED);
        return new AppointmentResponse(appointmentRepository.save(appointment));
    }

    @Transactional
    public void delete(UUID appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new IdNotExistException("Id não encontrado"));

        validateOwnership(appointment);


        appointmentRepository.delete(appointment);
    }

    //Verificar que  dentista está logado
    private void validateOwnership(Appointment appointment) {
        String loggedEmail = SecurityContextHolder.getContext().getAuthentication().getName();

        if (!appointment.getDentist().getEmail().equals(loggedEmail)) {
            // Lance uma exceção que resulte em 403 Forbidden
            throw new OwnershipException("Você não tem permissão para acessar esta consulta");
        }
    }
}
