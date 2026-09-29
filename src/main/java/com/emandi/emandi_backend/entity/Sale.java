package com.emandi.emandi_backend.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
@Entity @Table(name = "sales") @Data
public class Sale {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne @JoinColumn(name = "produce_lot_id") private ProduceLot produceLot;
    @ManyToOne @JoinColumn(name = "buyer_id") private User buyer;
    @ManyToOne @JoinColumn(name = "farmer_id") private User farmer;
    @ManyToOne @JoinColumn(name = "mandi_id") private Mandi mandi;
    private Double quantitySold; private Double pricePerUnit; private Double totalAmount;
    private String saleType; // AUCTION, DIRECT
    private String paymentStatus; // PENDING, PAID, PARTIAL
    private LocalDateTime saleDate;
}
