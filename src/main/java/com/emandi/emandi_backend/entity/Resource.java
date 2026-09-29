package com.emandi.emandi_backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "resources")
@Data
public class Resource {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String resourceName;
    
    // Transport, Mandi Slot, Storage
    private String resourceType; 
    
    private String location;
    private Double capacity;
    
    // Available, Allocated, Unavailable
    private String status; 
}
