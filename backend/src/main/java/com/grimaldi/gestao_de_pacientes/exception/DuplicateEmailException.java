package com.grimaldi.gestao_de_pacientes.exception;

public class DuplicateEmailException extends RuntimeException{
    public DuplicateEmailException(String message) {super(message);}
}
