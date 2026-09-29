package com.emandi.emandi_backend.controller;

import com.emandi.emandi_backend.entity.Resource;
import com.emandi.emandi_backend.entity.ResourceRequest;
import com.emandi.emandi_backend.service.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "*")
public class ResourceController {

    @Autowired private ResourceService resourceService;

    @GetMapping
    public ResponseEntity<List<Resource>> getAllResources() {
        return ResponseEntity.ok(resourceService.getAllResources());
    }

    @GetMapping("/requests")
    public ResponseEntity<List<ResourceRequest>> getAllRequests() {
        return ResponseEntity.ok(resourceService.getAllRequests());
    }

    @PostMapping("/requests")
    public ResponseEntity<ResourceRequest> createRequest(@RequestParam Long farmerId, @RequestParam Long lotId, @RequestParam String resourceType, @RequestParam Double requiredCapacity, @RequestParam String preferredDate) {
        LocalDateTime date = LocalDateTime.parse(preferredDate);
        return ResponseEntity.ok(resourceService.createRequest(farmerId, lotId, resourceType, requiredCapacity, date));
    }

    @PutMapping("/requests/{id}/allocate")
    public ResponseEntity<?> allocateResource(@PathVariable Long id, @RequestParam Long resourceId) {
        try {
            return ResponseEntity.ok(resourceService.allocateResource(id, resourceId));
        } catch(RuntimeException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("error", ex.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/requests/{id}/reject")
    public ResponseEntity<ResourceRequest> rejectRequest(@PathVariable Long id) {
        return ResponseEntity.ok(resourceService.rejectRequest(id));
    }

    @GetMapping("/utilization")
    public ResponseEntity<Map<String, Object>> getUtilization() {
        return ResponseEntity.ok(resourceService.getUtilizationDashboard());
    }
}
