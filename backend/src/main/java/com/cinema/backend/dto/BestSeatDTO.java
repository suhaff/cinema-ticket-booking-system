package com.cinema.backend.dto;

public class BestSeatDTO {
    public int row;
    public int col;
    public double score;
    public String reason;

    public BestSeatDTO(int row, int col, double score, String reason) {
        this.row = row;
        this.col = col;
        this.score = score;
        this.reason = reason;
    }
}