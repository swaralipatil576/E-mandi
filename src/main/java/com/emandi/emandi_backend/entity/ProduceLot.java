package com.emandi.emandi_backend.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
@Entity @Table(name = "produce_lots") @Data
public class ProduceLot {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne @JoinColumn(name = "farmer_id") private User farmer;
    @ManyToOne @JoinColumn(name = "mandi_id") private Mandi mandi;
    private String cropName; private String category; private Double quantity; private String unit;
    private String grade; private LocalDateTime harvestDate; private Double expectedPrice;
    private Double threshold; // Low-stock alert threshold
    private String status; // ACTIVE, SOLD, EXPIRED
    private LocalDateTime createdAt;
    @PrePersist protected void onCreate() { createdAt = LocalDateTime.now(); }
}
