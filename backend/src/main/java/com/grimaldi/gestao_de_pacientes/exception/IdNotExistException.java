package com.grimaldi.gestao_de_pacientes.exception;

public class IdNotExistException extends RuntimeException{

    public IdNotExistException(String message) {
        super(message);
    }
}
