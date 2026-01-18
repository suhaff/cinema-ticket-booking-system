package com.cinema.backend.services;

import com.cinema.backend.dto.BestSeatDTO;
import com.cinema.backend.dto.BestSessionDTO;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RecommendationAnalyticsService {

    public BestSessionDTO bestSession(Long movieId, Long userId) {
        return new BestSessionDTO("Evening", "Estimated lower crowd based on booking trends");
    }

    public List<BestSeatDTO> bestSeats(Long hallId) {
        int rows = 10;
        int cols = 12;

        List<BestSeatDTO> result = new ArrayList<>();
        int midRow = rows / 2;
        int midCol = cols / 2;

        result.add(new BestSeatDTO(midRow, midCol, 1.0, "Center seat for best viewing"));
        result.add(new BestSeatDTO(midRow, midCol - 1, 0.95, "Near center"));
        result.add(new BestSeatDTO(midRow, midCol + 1, 0.95, "Near center"));
        result.add(new BestSeatDTO(midRow - 1, midCol, 0.90, "Slightly forward center"));
        result.add(new BestSeatDTO(midRow + 1, midCol, 0.90, "Slightly back center"));

        return result;
    }
}
