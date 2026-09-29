package com.emandi.emandi_backend.controller;

import com.emandi.emandi_backend.entity.ProduceLot;
import com.emandi.emandi_backend.entity.Sale;
import com.emandi.emandi_backend.entity.StockMovement;
import com.emandi.emandi_backend.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "*")
public class InventoryController {

    @Autowired private InventoryService inventoryService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getInventory() {
        return ResponseEntity.ok(inventoryService.getInventoryDashboard());
    }

    @GetMapping("/movements")
    public ResponseEntity<List<StockMovement>> getMovements() {
        return ResponseEntity.ok(inventoryService.getStockMovements());
    }

    @PostMapping("/produce")
    public ResponseEntity<ProduceLot> registerProduce(@RequestParam Long farmerId, @RequestParam(required=false) Long mandiId, @RequestParam String cropName, @RequestParam Double quantity, @RequestParam(required=false) Double threshold) {
        return ResponseEntity.ok(inventoryService.registerProduce(farmerId, mandiId, cropName, quantity, threshold));
    }

    @PostMapping("/sell")
    public ResponseEntity<Sale> sellProduce(@RequestParam Long lotId, @RequestParam Long buyerId, @RequestParam Double quantityToSell, @RequestParam Double pricePerUnit) {
        return ResponseEntity.ok(inventoryService.sellProduce(lotId, buyerId, quantityToSell, pricePerUnit));
    }
}
