package com.grimaldi.gestao_de_pacientes.repository;

import com.grimaldi.gestao_de_pacientes.model.entity.Dentist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface DentistRepository extends JpaRepository<Dentist, UUID> {

    Optional<Dentist> findByEmail(String email);
}
