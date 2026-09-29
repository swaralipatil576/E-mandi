package com.emandi.emandi_backend.service;

import com.emandi.emandi_backend.entity.*;
import com.emandi.emandi_backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class InventoryService {

    @Autowired private ProduceLotRepository produceLotRepository;
    @Autowired private StockMovementRepository stockMovementRepository;
    @Autowired private SaleRepository saleRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private MandiRepository mandiRepository;

    @Transactional
    public ProduceLot registerProduce(Long farmerId, Long mandiId, String cropName, Double quantity, Double threshold) {
        User farmer = userRepository.findById(farmerId).orElseThrow(() -> new RuntimeException("Farmer not found"));
        Mandi mandi = mandiRepository.findById(mandiId).orElse(null);

        ProduceLot lot = new ProduceLot();
        lot.setFarmer(farmer);
        lot.setMandi(mandi);
        lot.setCropName(cropName);
        lot.setQuantity(quantity);
        lot.setThreshold(threshold != null ? threshold : 100.0);
        lot.setStatus("ACTIVE");
        lot.setCreatedAt(LocalDateTime.now());
        lot.setHarvestDate(LocalDateTime.now());
        lot = produceLotRepository.save(lot);

        StockMovement movement = new StockMovement();
        movement.setProduceLot(lot);
        movement.setFarmer(farmer);
        movement.setCropName(cropName);
        movement.setQuantity(quantity);
        movement.setMovementType("IN");
        movement.setMovementDate(LocalDateTime.now());
        stockMovementRepository.save(movement);

        return lot;
    }

    @Transactional
    public Sale sellProduce(Long lotId, Long buyerId, Double quantityToSell, Double pricePerUnit) {
        ProduceLot lot = produceLotRepository.findById(lotId).orElseThrow(() -> new RuntimeException("Lot not found"));
        if (lot.getQuantity() < quantityToSell) {
            throw new RuntimeException("Not enough inventory");
        }

        User buyer = userRepository.findById(buyerId).orElseThrow(() -> new RuntimeException("Buyer not found"));

        // Deduct inventory
        lot.setQuantity(lot.getQuantity() - quantityToSell);
        if (lot.getQuantity() == 0) {
            lot.setStatus("SOLD");
        }
        produceLotRepository.save(lot);

        // Record Sale
        Sale sale = new Sale();
        sale.setProduceLot(lot);
        sale.setBuyer(buyer);
        sale.setFarmer(lot.getFarmer());
        sale.setMandi(lot.getMandi());
        sale.setQuantitySold(quantityToSell);
        sale.setPricePerUnit(pricePerUnit);
        sale.setTotalAmount(quantityToSell * pricePerUnit);
        sale.setSaleType("DIRECT");
        sale.setPaymentStatus("PENDING");
        sale.setSaleDate(LocalDateTime.now());
        sale = saleRepository.save(sale);

        // Record Stock OUT
        StockMovement movement = new StockMovement();
        movement.setProduceLot(lot);
        movement.setFarmer(lot.getFarmer());
        movement.setSale(sale);
        movement.setCropName(lot.getCropName());
        movement.setQuantity(quantityToSell);
        movement.setMovementType("OUT");
        movement.setMovementDate(LocalDateTime.now());
        stockMovementRepository.save(movement);

        return sale;
    }

    public Map<String, Object> getInventoryDashboard() {
        List<ProduceLot> activeLots = produceLotRepository.findByStatus("ACTIVE");
        double totalQuantity = 0;
        int lowStockCount = 0;
        int slowMovingCount = 0;

        List<Map<String, Object>> lotDetails = new ArrayList<>();
        Map<String, Double> cropWiseStock = new HashMap<>();

        for (ProduceLot lot : activeLots) {
            double q = lot.getQuantity() != null ? lot.getQuantity() : 0.0;
            totalQuantity += q;
            
            cropWiseStock.put(lot.getCropName(), cropWiseStock.getOrDefault(lot.getCropName(), 0.0) + q);

            double threshold = lot.getThreshold() != null ? lot.getThreshold() : 100.0;
            String alertLevel = "Healthy";
            if (q < threshold) {
                alertLevel = "Critical";
                lowStockCount++;
            } else if (q < (threshold * 1.5)) {
                alertLevel = "Attention Required";
            }

            long daysInInventory = 0;
            if (lot.getCreatedAt() != null) {
                daysInInventory = ChronoUnit.DAYS.between(lot.getCreatedAt(), LocalDateTime.now());
            }

            String ageStatus = "Healthy";
            if (daysInInventory > 7) {
                ageStatus = "Slow Moving";
                slowMovingCount++;
            } else if (daysInInventory > 3) {
                ageStatus = "Attention";
            }

            Map<String, Object> map = new HashMap<>();
            map.put("lotId", lot.getId());
            map.put("cropName", lot.getCropName());
            map.put("quantity", q);
            map.put("threshold", threshold);
            map.put("alertLevel", alertLevel);
            map.put("daysInInventory", daysInInventory);
            map.put("ageStatus", ageStatus);
            lotDetails.add(map);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("totalInventoryQuantity", totalQuantity);
        result.put("activeLotsCount", activeLots.size());
        result.put("lowStockCount", lowStockCount);
        result.put("slowMovingCount", slowMovingCount);
        result.put("cropWiseStock", cropWiseStock);
        result.put("lots", lotDetails);
        return result;
    }

    public List<StockMovement> getStockMovements() {
        return stockMovementRepository.findAllByOrderByMovementDateDesc();
    }
}
