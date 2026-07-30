package com.grimaldi.gestao_de_pacientes.exception;

public class PastDateException extends RuntimeException{

    public PastDateException(String message) {
        super(message);
    }
}
