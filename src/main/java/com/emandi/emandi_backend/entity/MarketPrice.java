package com.emandi.emandi_backend.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
@Entity @Table(name = "market_prices") @Data
public class MarketPrice {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne @JoinColumn(name = "mandi_id") private Mandi mandi;
    private String cropName; private LocalDate priceDate;
    private Double minPrice; private Double maxPrice; private Double modalPrice;
}
