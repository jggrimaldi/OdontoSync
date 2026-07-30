package com.grimaldi.gestao_de_pacientes.repository;

import com.grimaldi.gestao_de_pacientes.model.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PatientRepository extends JpaRepository<Patient, UUID> {

    //evita erro de null
    Optional<Patient> findByPhone(String phone);

    Optional<Patient> findByCpf(String cpf);

    List<Patient> findAllByDentistEmail(String email);
}
