package com.grimaldi.gestao_de_pacientes.exception;

public class EntityInUseException extends RuntimeException{
    public EntityInUseException(String message) {
        super(message);
    }
}
