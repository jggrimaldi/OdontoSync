# 📋 Documentação - Alinhamento de DTOs Backend/Frontend

## ✅ Atualizações Realizadas no Frontend

### Tipos TypeScript Alinhados (`src/types/index.ts`)

Os tipos foram atualizados para espelhar exatamente os DTOs do backend:

#### DentistRequest (POST /dentista)
```typescript
{
  name: string;
  email: string;
  password: string;
  cro: string;
}
```

#### DentistResponse (Retorno)
```typescript
{
  id: string;           // UUID
  name: string;
  email: string;
  cro: string | null;
  role: string;         // "ROLE_DENTIST"
}
```

#### Outros DTOs Alinhados
- **PatientResponse**: id (UUID), name, cpf, phone, age, notes, imageUrl ✅
- **PatientRequest**: name, cpf, phone, age ✅
- **PatientUpdateRequest**: name, phone, age ✅
- **PatientNoteUpdateRequest**: notes, imageUrl ✅
- **AppointmentRequest**: patientId (UUID), title, date (LocalDate) ✅
- **AppointmentResponse**: id, date, title, notes, imageUrl, status, patientName, patientPhone, dentistName, dentistId (UUID), updatedAt ✅

---

## ⚡ Mudanças no Frontend

### 1. **loginPage.tsx**
- ❌ Removido campo `phone`
- ❌ Removido campo `specialization`
- ✅ Mantidos campos: name, email, password, cro

### 2. **authService.ts**
O serviço foi atualizado para lidar com a resposta real do backend:
- Login retorna apenas `TokenResponse` (token string)
- Registro retorna `DentistResponse`
- TODO: Backend precisa de endpoint `GET /dentista/me` para retornar dentista completo após login

### 3. **Header.tsx**
- ❌ Removida exibição de `specialization`
- ✅ Adicionada exibição de `cro` (CRO do dentista)

### 4. **Types.ts**
- ❌ Removido `DentistRegisterRequest`
- ✅ Adicionado `DentistRequest` (alinhado com backend)
- ✅ `DentistResponse` agora tem `role` ao invés de `specialization`

---

## 🔧 O QUE PRECISA SER FEITO NO BACKEND

### ⚠️ Issue 1: Endpoint de Login Incompleto
**Problema**: O endpoint `POST /auth/login` retorna apenas `TokenResponse`. O frontend precisa dos dados do dentista.

**Solução Recomendada - Opção 1 (Melhor):**
Criar um novo endpoint que retorna dentista + token:

```java
// Novo DTO
public record AuthLoginResponse(String token, DentistResponse dentist) {}

// Atualizar AuthController
@PostMapping("/login")
public ResponseEntity<AuthLoginResponse> login(@RequestBody LoginRequest request) {
    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(request.email(), request.password())
    );
    
    Dentist dentist = dentistRepository.findByEmail(request.email())
        .orElseThrow(() -> new UsernameNotFoundException("Dentista não encontrado"));
    
    String token = jwtUtil.generateToken(authentication.getName());
    
    return ResponseEntity.ok(new AuthLoginResponse(
        token, 
        new DentistResponse(dentist)
    ));
}
```

**Solução Alternativa - Opção 2:**
Criar um endpoint `GET /dentista/me` que retorna o dentista autenticado:

```java
@GetMapping("/me")
@PreAuthorize("isAuthenticated()")
public ResponseEntity<DentistResponse> getCurrentDentist() {
    Dentist dentist = getAuthenticatedDentist(); // método auxiliar
    return ResponseEntity.ok(new DentistResponse(dentist));
}
```

---

### ⚠️ Issue 2: Endpoint de Registro
**Atual**: `POST /dentista` retorna apenas `DentistResponse`
**Esperado**: Deveria fazer login automático e retornar token + dentista

**Solução**:
```java
@PostMapping
public ResponseEntity<AuthLoginResponse> createDentist(@Valid @RequestBody DentistRequest request) {
    Dentist dentist = dentistService.createDentist(request);
    
    // Gerar token
    String token = jwtUtil.generateToken(request.email());
    
    // Retornar token + dentista
    return ResponseEntity.status(201).body(new AuthLoginResponse(
        token,
        new DentistResponse(dentist)
    ));
}
```

---

## 🔄 Fluxo de Autenticação Esperado

```
┌─────────────────────────────────────────────────────────────┐
│ FRONTEND - Login                                            │
└─────────────────────────────────────────────────────────────┘
                    │
                    ▼
        POST /auth/login (email, password)
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│ BACKEND - AuthController                                    │
│ Autentica credenciais                                       │
│ Gera JWT Token                                              │
│ Busca DentistResponse                                       │
└─────────────────────────────────────────────────────────────┘
                    │
                    ▼
        ✅ RESPOSTA: { token, dentist }
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│ FRONTEND - AuthContext                                      │
│ Armazena token + dentista                                   │
│ Redireciona para /pacientes                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 📝 Resumo de Mapeamento de DTOs

| Frontend Type | Backend DTO | Status |
|---|---|---|
| `DentistRequest` | `DentistRequest` | ✅ Alinhado |
| `DentistResponse` | `DentistResponse` | ✅ Alinhado |
| `PatientRequest` | `PatientRequest` | ✅ Alinhado |
| `PatientResponse` | `PatientResponse` | ✅ Alinhado |
| `AppointmentRequest` | `AppointmentRequest` | ✅ Alinhado |
| `AppointmentResponse` | `AppointmentResponse` | ✅ Alinhado |
| `TokenResponse` | `TokenResponse` | ✅ Alinhado |
| `AuthResponse` | ❌ Não existe | ⚠️ Precisa criar |

---

## 🚀 Próximos Passos

1. **Backend**: Implementar resposta de login com token + dentista
2. **Backend**: Criar endpoint `GET /dentista/me` (opcional, mas recomendado)
3. **Frontend**: Vai funcionar automaticamente após o backend retornar os dados completos
4. **Testes**: Testar fluxo completo de login e registro

---

## 💡 Notas Importantes

- Os valores de data no backend usam `LocalDate` (formato YYYY-MM-DD)
- IDs usam `UUID` no backend, armazenados como strings no frontend
- O role padrão é `"ROLE_DENTIST"`
- CRO pode ser null

