package com.grimaldi.gestao_de_pacientes.controller;

import com.grimaldi.gestao_de_pacientes.model.dto.PatientNoteUpdateRequest;
import com.grimaldi.gestao_de_pacientes.model.dto.PatientRequest;
import com.grimaldi.gestao_de_pacientes.model.dto.PatientResponse;
import com.grimaldi.gestao_de_pacientes.model.dto.PatientUpdateRequest;
import com.grimaldi.gestao_de_pacientes.model.entity.Patient;
import com.grimaldi.gestao_de_pacientes.service.PatientService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/pacientes")
@Tag(name = "Pacientes", description = "Operações relacionadas a pacientes")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @PostMapping
    @Operation(summary = "Criar Paciente")
    @ApiResponse(responseCode = "201", description = "Paciente criada com sucesso")
    @ApiResponse(responseCode = "400", description = "Bad Request")
    @ApiResponse(responseCode = "409", description = "Conflito")
    @ApiResponse(responseCode = "401", description = "Falha no token")
    public ResponseEntity<PatientResponse> createPatient(@Valid @RequestBody PatientRequest request) {
        Patient patient =  patientService.createPatient(request);

        PatientResponse response = new PatientResponse(patient);
        return ResponseEntity.status(201).body(response);
    }

    @GetMapping
    @Operation(summary = "Listar todos Pacientes")
    @ApiResponse(responseCode = "200", description = "Busca feita com sucesso")
    @ApiResponse(responseCode = "404", description = "Não foi encontrado")
    @ApiResponse(responseCode = "403", description = "Tentando acessar um paciente de outro Dentista")
    public ResponseEntity<List<PatientResponse>> findAll() {
        return ResponseEntity.ok(patientService.findAll());
    }

    @GetMapping("/{patientId}")
    @Operation(summary = "Listar todos Pacientes por ID")
    @ApiResponse(responseCode = "200", description = "Busca feita com sucesso")
    @ApiResponse(responseCode = "404", description = "Não foi encontrado")
    @ApiResponse(responseCode = "403", description = "Tentando acessar um paciente de outro Dentista")
    public ResponseEntity<PatientResponse> findById(@PathVariable UUID patientId) {
        return ResponseEntity.ok(patientService.findById(patientId));
    }

    @PatchMapping("/{patientId}/anotacao")
    @Operation(summary = "Adicionar nota no bloco de notas")
    @ApiResponse(responseCode = "200", description = "Atualização feita com sucesso")
    @ApiResponse(responseCode = "400", description = "Bad Request")
    @ApiResponse(responseCode = "404", description = "Não foi encontrado")
    @ApiResponse(responseCode = "403", description = "Tentando acessar a paciente de outro Dentista")
    public ResponseEntity<PatientResponse> updateNotes(@PathVariable UUID patientId, @RequestBody PatientNoteUpdateRequest updateRequest) {
        return ResponseEntity.ok(patientService.updatePatientNotes(patientId, updateRequest));
    }

    @PatchMapping("/{patientId}/detalhes")
    @Operation(summary = "Atualziar Paciente")
    @ApiResponse(responseCode = "200", description = "Atualização feita com sucesso")
    @ApiResponse(responseCode = "400", description = "Bad Request")
    @ApiResponse(responseCode = "404", description = "Não foi encontrado")
    @ApiResponse(responseCode = "403", description = "Tentando acessar a paciente de outro Dentista")
    public ResponseEntity<PatientResponse> updateDetails(@PathVariable UUID patientId, @RequestBody PatientUpdateRequest updateRequest) {
        return ResponseEntity.ok(patientService.updateDetails(patientId, updateRequest));
    }

    @DeleteMapping("/{patientId}")
    @Operation(summary = "Deletar Paciente")
    @ApiResponse(responseCode = "204", description = "Excluido com sucesso")
    @ApiResponse(responseCode = "409", description = "Paciente com cansultas")
    @ApiResponse(responseCode = "403", description = "Tentando acessar a consulta de outro Dentista")
    public ResponseEntity<PatientResponse> delete(@PathVariable UUID patientId) {
        patientService.delete(patientId);
        return ResponseEntity.noContent().build();
    }
}
