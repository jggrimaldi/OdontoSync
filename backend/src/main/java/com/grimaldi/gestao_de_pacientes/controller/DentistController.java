package com.grimaldi.gestao_de_pacientes.controller;

import com.grimaldi.gestao_de_pacientes.model.dto.DentistRequest;
import com.grimaldi.gestao_de_pacientes.model.dto.DentistResponse;
import com.grimaldi.gestao_de_pacientes.model.dto.DentistUpdateProfileRequest;
import com.grimaldi.gestao_de_pacientes.model.dto.DentistUpdateRequest;
import com.grimaldi.gestao_de_pacientes.model.entity.Dentist;
import com.grimaldi.gestao_de_pacientes.service.DentistService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/dentista")
@Tag(name = "Dentista", description = "Operações relacionadas a dentista")
public class DentistController {

    private final DentistService dentistService;

    public DentistController(DentistService dentistService) {
        this.dentistService = dentistService;
    }

    @Operation(summary = "Criar dentista")
    @PostMapping
    public ResponseEntity<DentistResponse> createDentist(@Valid @RequestBody DentistRequest request) {
        Dentist dentist = dentistService.createDentist(request);
        DentistResponse response = new DentistResponse(dentist);

        return ResponseEntity.status(201).body(response);
    }
    @Operation(summary = "Buscar dentista logado")
    @GetMapping("/me")
    public ResponseEntity<DentistResponse> getCurrentDentist(Authentication authentication) {
        Dentist dentist = dentistService.getDentistByEmail(authentication.getName());
        return ResponseEntity.ok(new DentistResponse(dentist));
    }

    @Operation(summary = "Editar dentista logado")
    @PatchMapping({ "", "/me" })
    public ResponseEntity<DentistResponse> updateCurrentDentist(
            Authentication authentication,
            @Valid @RequestBody DentistUpdateRequest request
    ) {
        Dentist updated = dentistService.updateDentistByEmail(authentication.getName(), request);
        return ResponseEntity.ok(new DentistResponse(updated));
    }

    @Operation(summary = "Editar dentista logado")
    @PatchMapping({"", "/me/profile"})
    public ResponseEntity<DentistResponse> updateProfileImageDentist(Authentication authentication, @Valid @RequestBody DentistUpdateProfileRequest request) {
        return ResponseEntity.ok(dentistService.updateImageProfile(authentication.getName(), request));
    }
}
