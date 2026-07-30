package com.grimaldi.gestao_de_pacientes.exception;

public class StatusNotPendingException extends RuntimeException{

    public StatusNotPendingException(String menssage) {
        super(menssage);
    }
}
