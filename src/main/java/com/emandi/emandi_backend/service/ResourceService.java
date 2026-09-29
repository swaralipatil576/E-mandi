package com.emandi.emandi_backend.service;

import com.emandi.emandi_backend.entity.*;
import com.emandi.emandi_backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class ResourceService {

    @Autowired private ResourceRepository resourceRepository;
    @Autowired private ResourceRequestRepository requestRepository;
    @Autowired private ProduceLotRepository produceLotRepository;
    @Autowired private UserRepository userRepository;

    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    public List<ResourceRequest> getAllRequests() {
        return requestRepository.findAll();
    }

    @Transactional
    public ResourceRequest createRequest(Long farmerId, Long lotId, String resourceType, Double requiredCapacity, LocalDateTime preferredDate) {
        User farmer = userRepository.findById(farmerId).orElseThrow(() -> new RuntimeException("Farmer not found"));
        ProduceLot lot = produceLotRepository.findById(lotId).orElse(null);

        ResourceRequest req = new ResourceRequest();
        req.setRequester(farmer);
        req.setProduceLot(lot);
        req.setResourceType(resourceType);
        req.setRequiredCapacity(requiredCapacity);
        req.setPreferredDate(preferredDate);
        req.setStatus("PENDING");
        return requestRepository.save(req);
    }

    @Transactional
    public ResourceRequest allocateResource(Long requestId, Long resourceId) {
        ResourceRequest req = requestRepository.findById(requestId).orElseThrow(() -> new RuntimeException("Request not found"));
        Resource res = resourceRepository.findById(resourceId).orElseThrow(() -> new RuntimeException("Resource not found"));

        // Conflict Detection
        // For simplicity, we assume a resource can only have 1 allocation per day.
        LocalDateTime startOfDay = req.getPreferredDate().toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);
        
        List<ResourceRequest> conflicts = requestRepository.findByAllocatedResourceIdAndStatusAndPreferredDateBetween(
                resourceId, "ALLOCATED", startOfDay, endOfDay
        );

        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Conflict Detected: Resource " + res.getResourceName() + " is already allocated on this date.");
        }

        req.setAllocatedResource(res);
        req.setStatus("ALLOCATED");
        requestRepository.save(req);

        res.setStatus("Allocated");
        resourceRepository.save(res);

        return req;
    }

    @Transactional
    public ResourceRequest rejectRequest(Long requestId) {
        ResourceRequest req = requestRepository.findById(requestId).orElseThrow();
        req.setStatus("REJECTED");
        return requestRepository.save(req);
    }

    public Map<String, Object> getUtilizationDashboard() {
        List<Resource> resources = resourceRepository.findAll();
        long total = resources.size();
        long available = resources.stream().filter(r -> "Available".equalsIgnoreCase(r.getStatus())).count();
        long allocated = resources.stream().filter(r -> "Allocated".equalsIgnoreCase(r.getStatus())).count();
        long unavailable = resources.stream().filter(r -> "Unavailable".equalsIgnoreCase(r.getStatus())).count();

        Map<String, Object> utilizationByGroup = new HashMap<>();
        Map<String, long[]> groups = new HashMap<>(); // [allocated, total]
        for (Resource r : resources) {
            String type = r.getResourceType();
            groups.putIfAbsent(type, new long[]{0, 0});
            groups.get(type)[1]++;
            if ("Allocated".equalsIgnoreCase(r.getStatus())) {
                groups.get(type)[0]++;
            }
        }

        for (Map.Entry<String, long[]> entry : groups.entrySet()) {
            double percent = (entry.getValue()[1] == 0) ? 0 : (entry.getValue()[0] * 100.0 / entry.getValue()[1]);
            utilizationByGroup.put(entry.getKey() + " Utilization", String.format("%.0f%%", percent));
        }

        Map<String, Object> result = new HashMap<>();
        result.put("total", total);
        result.put("available", available);
        result.put("allocated", allocated);
        result.put("unavailable", unavailable);
        result.put("utilization", utilizationByGroup);
        return result;
    }
}
