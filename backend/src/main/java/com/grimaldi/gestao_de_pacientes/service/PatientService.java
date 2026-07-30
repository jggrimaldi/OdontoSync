package com.grimaldi.gestao_de_pacientes.service;

import com.grimaldi.gestao_de_pacientes.model.dto.PatientNoteUpdateRequest;
import com.grimaldi.gestao_de_pacientes.model.dto.PatientRequest;
import com.grimaldi.gestao_de_pacientes.model.dto.PatientResponse;
import com.grimaldi.gestao_de_pacientes.model.dto.PatientUpdateRequest;
import com.grimaldi.gestao_de_pacientes.model.entity.Dentist;
import com.grimaldi.gestao_de_pacientes.model.entity.Patient;
import com.grimaldi.gestao_de_pacientes.exception.OwnershipException;
import com.grimaldi.gestao_de_pacientes.exception.DuplicatePhoneException;
import com.grimaldi.gestao_de_pacientes.exception.EntityInUseException;
import com.grimaldi.gestao_de_pacientes.exception.IdNotExistException;
import com.grimaldi.gestao_de_pacientes.repository.AppointmentRepository;
import com.grimaldi.gestao_de_pacientes.repository.DentistRepository;
import com.grimaldi.gestao_de_pacientes.repository.PatientRepository;
import com.grimaldi.gestao_de_pacientes.service.validation.CreatePatientValidation;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class PatientService {

    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final DentistRepository dentistRepository;
    private final List<CreatePatientValidation> createPatientValidations;

    public PatientService(PatientRepository patientRepository, AppointmentRepository appointmentRepository, DentistRepository dentistRepository, List<CreatePatientValidation> createPatientValidations) {
        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
        this.dentistRepository = dentistRepository;
        this.createPatientValidations = createPatientValidations;
    }

    @Transactional
    public Patient createPatient(PatientRequest request) {
        Dentist dentist = dentistRepository.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName())
                .orElseThrow(() -> new UsernameNotFoundException("Usuario não encontrado"));;

        createPatientValidations.forEach(v-> v.validate(request));
        Patient patient = new Patient();

        patient.setName(request.name());
        patient.setCpf(request.cpf());
        patient.setPhone(request.phone());
        patient.setAge(request.age());
        patient.setDentist(dentist);

        return patientRepository.save(patient);
    }

    @Transactional(readOnly = true)
    public List<PatientResponse> findAll(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        List<Patient> patients = patientRepository.findAllByDentistEmail(email);

        //Transforma a lista em uma esteira, transforma as entidades em objetos DTO e transforma em lista
        return patients.stream()
                .map(PatientResponse::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public PatientResponse findById(UUID patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new IdNotExistException("Id não existe"));

        validateOwnership(patient);

        return new PatientResponse(patient);
    }

    @Transactional
    public PatientResponse updatePatientNotes(UUID patientId, PatientNoteUpdateRequest updateRequest){
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new IdNotExistException("Id não existe"));

        validateOwnership(patient);

        if (updateRequest.notes() != null) {
            patient.setNotes(updateRequest.notes());
        }
        if (updateRequest.imageUrl() != null) {
            patient.setImageUrl(updateRequest.imageUrl());
        }

        return new PatientResponse(patientRepository.save(patient));
    }

    @Transactional
    public PatientResponse updateDetails(UUID patientId, PatientUpdateRequest updateRequest) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new IdNotExistException("Id não existe"));

        validateOwnership(patient);

        //So valida se n for nulo e n for igual ao antigo telefone
        if (updateRequest.phone() != null && !updateRequest.phone().equals(patient.getPhone())) {
            if (patientRepository.findByPhone(updateRequest.phone()).isPresent()) {
                throw new DuplicatePhoneException("Este telefone já está em uso por outro paciente");
            }
            patient.setPhone(updateRequest.phone());
        }
        if (updateRequest.name() != null) {
            patient.setName(updateRequest.name());
        }
        if (updateRequest.age() != null) {
            patient.setAge(updateRequest.age());
        }

        return new PatientResponse(patientRepository.save(patient));
    }

    @Transactional
    public void delete(UUID patientId) {
        String loggedEmail = SecurityContextHolder.getContext().getAuthentication().getName();

        // Busca o paciente
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new IdNotExistException("Id não existe"));

        //Valida se o paciente pertence a quem está logado
        if (!patient.getDentist().getEmail().equals(loggedEmail)) {
            throw new OwnershipException("Você não tem permissão para excluir este paciente");
        }

        // Valida integridade referencial
        Boolean hasAppointment = appointmentRepository.existsByPatientId(patientId);
        if (hasAppointment) {
            throw new EntityInUseException("O paciente possui consultas e não pode ser excluído");
        }

        patientRepository.deleteById(patientId);
    }

    public void validateOwnership(Patient patient) {
        String loggedEmail = SecurityContextHolder.getContext().getAuthentication().getName();

        Dentist loggedDentist = dentistRepository.findByEmail(loggedEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Email não encontrado"));

        if (!patient.getDentist().getId().equals(loggedDentist.getId())) {
            // Lance uma exceção que resulte em 403 Forbidden
            throw new OwnershipException("Você não tem permissão para acessar esta consulta");
        }
    }
}
