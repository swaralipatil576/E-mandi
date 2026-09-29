package com.emandi.emandi_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "stock_movements")
@Data
public class StockMovement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "produce_lot_id")
    private ProduceLot produceLot;

    @ManyToOne
    @JoinColumn(name = "farmer_id")
    private User farmer;

    @ManyToOne
    @JoinColumn(name = "sale_id", nullable = true)
    private Sale sale;

    private String cropName;
    private Double quantity;
    private String movementType; // "IN" or "OUT"
    private LocalDateTime movementDate;

    @PrePersist
    protected void onCreate() {
        if (movementDate == null) {
            movementDate = LocalDateTime.now();
        }
    }
}
