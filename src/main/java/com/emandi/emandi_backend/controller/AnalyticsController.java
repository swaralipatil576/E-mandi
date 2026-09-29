package com.emandi.emandi_backend.controller;
import com.emandi.emandi_backend.dto.AnalyticsOverviewDto;
import com.emandi.emandi_backend.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {
    @Autowired private AnalyticsService analyticsService;
    
    @GetMapping("/overview") public ResponseEntity<AnalyticsOverviewDto> getOverview() { return ResponseEntity.ok(analyticsService.getOverview()); }
    @GetMapping("/crop-performance") public ResponseEntity<List<Map<String, Object>>> getCropPerformance() { return ResponseEntity.ok(analyticsService.getCropPerformance()); }
    @GetMapping("/inventory") public ResponseEntity<List<Map<String, Object>>> getInventory() { return ResponseEntity.ok(analyticsService.getInventoryInsights()); }
    @GetMapping("/insights") public ResponseEntity<List<String>> getInsights() { return ResponseEntity.ok(analyticsService.getSmartInsights()); }
    @GetMapping("/forecast") public ResponseEntity<Map<String, Object>> getForecast() { return ResponseEntity.ok(analyticsService.getForecast()); }
}
