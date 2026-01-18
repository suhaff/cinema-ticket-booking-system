package com.cinema.backend.controllers;

import com.cinema.backend.dto.BestSeatDTO;
import com.cinema.backend.dto.BestSessionDTO;
import com.cinema.backend.services.RecommendationAnalyticsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reco")
public class RecommendationAnalyticsController {

    private final RecommendationAnalyticsService service;

    public RecommendationAnalyticsController(RecommendationAnalyticsService service) {
        this.service = service;
    }

    @GetMapping("/best-session")
    public BestSessionDTO bestSession(@RequestParam Long movieId, @RequestParam Long userId) {
        return service.bestSession(movieId, userId);
    }

    @GetMapping("/best-seats")
    public List<BestSeatDTO> bestSeats(@RequestParam Long hallId) {
        return service.bestSeats(hallId);
    }
}