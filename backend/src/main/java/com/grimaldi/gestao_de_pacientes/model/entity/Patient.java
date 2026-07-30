package com.grimaldi.gestao_de_pacientes.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "dentist_id")
    private Dentist dentist;

    @OneToMany(mappedBy = "patient")
    private List<Appointment> appointments;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String cpf;

    @Column(nullable = false, unique = true)
    private String phone; // Chave para o fluxo do WhatsApp

    private Integer age;

    @Lob
    private String notes;

    @Column(columnDefinition = "TEXT")
    private String imageUrl;
}
