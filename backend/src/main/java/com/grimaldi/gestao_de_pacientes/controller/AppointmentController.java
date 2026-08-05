package com.grimaldi.gestao_de_pacientes.controller;

import com.grimaldi.gestao_de_pacientes.model.dto.AppointmentNoteUpdateRequest;
import com.grimaldi.gestao_de_pacientes.model.dto.AppointmentRequest;
import com.grimaldi.gestao_de_pacientes.model.dto.AppointmentResponse;
import com.grimaldi.gestao_de_pacientes.model.dto.AppointmentUpdateRequest;
import com.grimaldi.gestao_de_pacientes.model.entity.Appointment;
import com.grimaldi.gestao_de_pacientes.service.AppointmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(value = "/consultas")
@Tag(name = "Consultas", description = "Operações relacionadas a consulta")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping
    @Operation(summary = "Criar consulta")
    @ApiResponse(responseCode = "201", description = "Consulta criada com sucesso")
    @ApiResponse(responseCode = "400", description = "Bad Request")
    @ApiResponse(responseCode = "409", description = "Conflito")
    @ApiResponse(responseCode = "401", description = "Falha no token")
    public ResponseEntity<AppointmentResponse> createAppointment(@Valid @RequestBody AppointmentRequest request) {
        Appointment appointment = appointmentService.creatAppointment(request);

        AppointmentResponse response = new AppointmentResponse(appointment);
        return ResponseEntity.status(201).body(response);
    }


    @GetMapping
    @Operation(summary = "Listar consutas")
    @ApiResponse(responseCode = "200", description = "Busca feita com sucesso")
    @ApiResponse(responseCode = "404", description = "Não foi encontrado")
    @ApiResponse(responseCode = "403", description = "Tentando acessar a consulta de outro Dentista")
    public ResponseEntity<List<AppointmentResponse>> findAll() {
        return ResponseEntity.ok(appointmentService.findAll());
    }

    @GetMapping("/agenda")
    public ResponseEntity<List<AppointmentResponse>> getAgenda(@RequestParam LocalDate startDate, @RequestParam LocalDate endDate) {
        return ResponseEntity.ok(appointmentService.getAgenda(startDate,endDate));
    }

    @GetMapping("/{appointmentId}")
    @Operation(summary = "Buscar consulta por Id")
    @ApiResponse(responseCode = "200", description = "Busca feita com sucesso")
    @ApiResponse(responseCode = "404", description = "Não foi encontrado")
    @ApiResponse(responseCode = "403", description = "Tentando acessar a consulta de outro Dentista")
    public ResponseEntity<AppointmentResponse> findById(@PathVariable UUID appointmentId) {
        return ResponseEntity.ok(appointmentService.findById(appointmentId));
    }

    @GetMapping("/paciente/{patientId}")
    @Operation(summary = "Listar consultas por paciente")
    @ApiResponse(responseCode = "200", description = "Busca feita com sucesso")
    @ApiResponse(responseCode = "404", description = "Paciente não encontrado")
    @ApiResponse(responseCode = "403", description = "Tentando acessar consulta de outro dentista")
    public ResponseEntity<List<AppointmentResponse>> findByPatient(@PathVariable UUID patientId) {
        return ResponseEntity.ok(appointmentService.findByPatient(patientId));
    }

    @PatchMapping("/{appointmentId}/anotacao")
    @Operation(summary = "Adicionar nota no bloco de notas")
    @ApiResponse(responseCode = "200", description = "Atualização feita com sucesso")
    @ApiResponse(responseCode = "400", description = "Bad Request")
    @ApiResponse(responseCode = "404", description = "Não foi encontrado")
    @ApiResponse(responseCode = "403", description = "Tentando acessar a consulta de outro Dentista")
    public  ResponseEntity<AppointmentResponse> updateNotePad(@PathVariable UUID appointmentId , @RequestBody AppointmentNoteUpdateRequest updateRequest) {
        return ResponseEntity.ok(appointmentService.updateNotePad(appointmentId, updateRequest));
    }

    @PatchMapping("/{appointmentId}/detalhes")
    @Operation(summary = "Atualizar detalhes da consulta")
    @ApiResponse(responseCode = "200", description = "Atualização feita com sucesso")
    @ApiResponse(responseCode = "400", description = "Bad Request")
    @ApiResponse(responseCode = "404", description = "Não foi encontrado")
    @ApiResponse(responseCode = "403", description = "Tentando acessar a consulta de outro Dentista")
    public ResponseEntity<AppointmentResponse> updateDetails(
            @PathVariable UUID appointmentId, @RequestBody AppointmentUpdateRequest request) {
        return ResponseEntity.ok(appointmentService.updateDetails(appointmentId, request));
    }

    @PatchMapping("/{appointmentId}")
    @Operation(summary = "Finalizar consulta")
    @ApiResponse(responseCode = "200", description = "Atualização feita com sucesso")
    @ApiResponse(responseCode = "400", description = "Bad Request")
    @ApiResponse(responseCode = "404", description = "Não foi encontrado")
    @ApiResponse(responseCode = "403", description = "Tentando acessar a consulta de outro Dentista")
    public ResponseEntity<AppointmentResponse> finishAppointment(@PathVariable UUID appointmentId) {
        return ResponseEntity.ok(appointmentService.finishAppointment(appointmentId));
    }

    @PatchMapping("/{appointmentId}/cancelar")
    @Operation(summary = "Cancelar  consulta")
    @ApiResponse(responseCode = "200", description = "Atualização feita com sucesso")
    @ApiResponse(responseCode = "400", description = "Bad Request")
    @ApiResponse(responseCode = "404", description = "Não foi encontrado")
    @ApiResponse(responseCode = "403", description = "Tentando acessar a consulta de outro Dentista")
    public ResponseEntity<AppointmentResponse> cancelAppointment(@PathVariable UUID appointmentId) {
        return ResponseEntity.ok(appointmentService.cancelAppointment(appointmentId));
    }

    @PatchMapping("/{appointmentId}/reabrir")
    @Operation(summary = "Reabrir consulta (voltar status para Pendente)")
    @ApiResponse(responseCode = "200", description = "Atualização feita com sucesso")
    @ApiResponse(responseCode = "404", description = "Não foi encontrado")
    @ApiResponse(responseCode = "403", description = "Tentando acessar a consulta de outro Dentista")
    public ResponseEntity<AppointmentResponse> reopenAppointment(@PathVariable UUID appointmentId) {
        return ResponseEntity.ok(appointmentService.reopenAppointment(appointmentId));
    }

    @DeleteMapping("/{appointmentId}")
    @Operation(summary = "Deletar consulta")
    @ApiResponse(responseCode = "204", description = "Excluido com sucesso")
    @ApiResponse(responseCode = "409", description = "Conflito")
    @ApiResponse(responseCode = "403", description = "Tentando acessar a consulta de outro Dentista")
    public ResponseEntity<Void> delete(@PathVariable UUID appointmentId) {
        appointmentService.delete(appointmentId);
        return ResponseEntity.noContent().build();
    }

}

