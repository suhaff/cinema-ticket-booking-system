package com.cinema.backend.dto;

public class BestSessionDTO {
    public String sessionTime;
    public String reason;

    public BestSessionDTO(String sessionTime, String reason) {
        this.sessionTime = sessionTime;
        this.reason = reason;
    }
}