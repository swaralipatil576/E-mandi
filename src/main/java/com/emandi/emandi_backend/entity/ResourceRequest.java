package com.emandi.emandi_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "resource_requests")
@Data
public class ResourceRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "farmer_id")
    private User requester;

    @ManyToOne
    @JoinColumn(name = "produce_lot_id")
    private ProduceLot produceLot;

    @ManyToOne
    @JoinColumn(name = "allocated_resource_id")
    private Resource allocatedResource;

    private String resourceType; // e.g. Transport, Storage
    private Double requiredCapacity;
    private LocalDateTime preferredDate;
    
    // PENDING, APPROVED, REJECTED, ALLOCATED
    private String status; 
    
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
