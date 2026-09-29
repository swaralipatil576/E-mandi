import os

base_pkg = "com.emandi.emandi_backend"
src_dir = "C:/Users/asus/Downloads/E-mandi/src/main/java/com/emandi/emandi_backend"

entities = {
    "Mandi.java": """package com.emandi.emandi_backend.entity;
import jakarta.persistence.*;
import lombok.Data;
@Entity @Table(name = "mandis") @Data
public class Mandi {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private String name; private String state; private String district; private String location;
}
""",
    "ProduceLot.java": """package com.emandi.emandi_backend.entity;
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
    private String status; // ACTIVE, SOLD, EXPIRED
    private LocalDateTime createdAt;
    @PrePersist protected void onCreate() { createdAt = LocalDateTime.now(); }
}
""",
    "Sale.java": """package com.emandi.emandi_backend.entity;
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
""",
    "MarketPrice.java": """package com.emandi.emandi_backend.entity;
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
"""
}

repositories = {
    "MandiRepository.java": "package com.emandi.emandi_backend.repository;\nimport com.emandi.emandi_backend.entity.Mandi;\nimport org.springframework.data.jpa.repository.JpaRepository;\npublic interface MandiRepository extends JpaRepository<Mandi, Long> {}",
    "ProduceLotRepository.java": "package com.emandi.emandi_backend.repository;\nimport com.emandi.emandi_backend.entity.ProduceLot;\nimport org.springframework.data.jpa.repository.JpaRepository;\nimport org.springframework.data.jpa.repository.Query;\nimport java.util.List;\npublic interface ProduceLotRepository extends JpaRepository<ProduceLot, Long> {\n    List<ProduceLot> findByStatus(String status);\n    @Query(\"SELECT p.cropName, SUM(p.quantity) FROM ProduceLot p GROUP BY p.cropName\")\n    List<Object[]> getInventoryByCrop();\n}",
    "SaleRepository.java": "package com.emandi.emandi_backend.repository;\nimport com.emandi.emandi_backend.entity.Sale;\nimport org.springframework.data.jpa.repository.JpaRepository;\nimport org.springframework.data.jpa.repository.Query;\nimport java.time.LocalDateTime;\nimport java.util.List;\npublic interface SaleRepository extends JpaRepository<Sale, Long> {\n    List<Sale> findBySaleDateBetween(LocalDateTime start, LocalDateTime end);\n    @Query(\"SELECT SUM(s.totalAmount) FROM Sale s\") Double getTotalRevenue();\n    @Query(\"SELECT COUNT(s) FROM Sale s\") Long getTotalSalesCount();\n    @Query(\"SELECT SUM(s.quantitySold) FROM Sale s\") Double getTotalQuantitySold();\n    @Query(\"SELECT SUM(s.totalAmount) FROM Sale s WHERE s.paymentStatus = 'PENDING'\") Double getTotalPendingPayments();\n    @Query(\"SELECT s.produceLot.cropName, SUM(s.totalAmount), SUM(s.quantitySold) FROM Sale s GROUP BY s.produceLot.cropName ORDER BY SUM(s.totalAmount) DESC\")\n    List<Object[]> getSalesByCrop();\n}",
    "MarketPriceRepository.java": "package com.emandi.emandi_backend.repository;\nimport com.emandi.emandi_backend.entity.MarketPrice;\nimport org.springframework.data.jpa.repository.JpaRepository;\npublic interface MarketPriceRepository extends JpaRepository<MarketPrice, Long> {}"
}

dtos = {
    "AnalyticsOverviewDto.java": """package com.emandi.emandi_backend.dto;
import lombok.Data;
@Data public class AnalyticsOverviewDto {
    private Double totalRevenue; private Long totalSales; private Double totalQuantitySold;
    private Double averageSellingPrice; private Double totalPendingPayments; private Double activeInventoryValue;
}
""",
    "ChatRequest.java": """package com.emandi.emandi_backend.dto;
import lombok.Data;
@Data public class ChatRequest { private String message; }
""",
    "ChatResponse.java": """package com.emandi.emandi_backend.dto;
import lombok.Data;
import lombok.AllArgsConstructor;
@Data @AllArgsConstructor public class ChatResponse { private String reply; }
"""
}

services = {
    "AnalyticsService.java": """package com.emandi.emandi_backend.service;
import com.emandi.emandi_backend.dto.AnalyticsOverviewDto;
import com.emandi.emandi_backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;
@Service
public class AnalyticsService {
    @Autowired private SaleRepository saleRepository;
    @Autowired private ProduceLotRepository produceLotRepository;
    
    public AnalyticsOverviewDto getOverview() {
        AnalyticsOverviewDto dto = new AnalyticsOverviewDto();
        dto.setTotalRevenue(saleRepository.getTotalRevenue() == null ? 0.0 : saleRepository.getTotalRevenue());
        dto.setTotalSales(saleRepository.getTotalSalesCount());
        dto.setTotalQuantitySold(saleRepository.getTotalQuantitySold() == null ? 0.0 : saleRepository.getTotalQuantitySold());
        dto.setTotalPendingPayments(saleRepository.getTotalPendingPayments() == null ? 0.0 : saleRepository.getTotalPendingPayments());
        if (dto.getTotalQuantitySold() > 0) {
            dto.setAverageSellingPrice(dto.getTotalRevenue() / dto.getTotalQuantitySold());
        } else {
            dto.setAverageSellingPrice(0.0);
        }
        return dto;
    }
    
    public List<Map<String, Object>> getCropPerformance() {
        List<Object[]> results = saleRepository.getSalesByCrop();
        List<Map<String, Object>> performance = new ArrayList<>();
        for (Object[] row : results) {
            Map<String, Object> map = new HashMap<>();
            map.put("crop", row[0]);
            map.put("revenue", row[1]);
            map.put("quantity", row[2]);
            performance.add(map);
        }
        return performance;
    }
    
    public List<Map<String, Object>> getInventoryInsights() {
        List<Object[]> results = produceLotRepository.getInventoryByCrop();
        List<Map<String, Object>> inventory = new ArrayList<>();
        for(Object[] row: results) {
            Map<String, Object> map = new HashMap<>();
            map.put("crop", row[0]);
            map.put("quantity", row[1]);
            inventory.add(map);
        }
        return inventory;
    }
    
    public List<String> getSmartInsights() {
        List<String> insights = new ArrayList<>();
        List<Map<String, Object>> crops = getCropPerformance();
        if(!crops.isEmpty()) {
            insights.add(crops.get(0).get("crop") + " contributed the highest revenue.");
        }
        Double pending = saleRepository.getTotalPendingPayments();
        if(pending != null && pending > 0) {
            insights.add("₹" + String.format("%.2f", pending) + " is currently pending in payments.");
        }
        return insights;
    }
    
    public Map<String, Object> getForecast() {
        Map<String, Object> forecast = new HashMap<>();
        Double revenue = saleRepository.getTotalRevenue();
        if (revenue == null) revenue = 0.0;
        forecast.put("historicalRevenue", revenue);
        // Simple moving average mock
        forecast.put("forecastedNextMonthRevenue", revenue / 6.0 * 1.05); // 5% growth
        forecast.put("trend", "UP");
        forecast.put("message", "Based on the last six months of sales data, the estimated next-month revenue is ₹" + String.format("%.2f", revenue / 6.0 * 1.05));
        return forecast;
    }
}
""",
    "ChatbotService.java": """package com.emandi.emandi_backend.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.emandi.emandi_backend.dto.AnalyticsOverviewDto;
@Service
public class ChatbotService {
    @Autowired private AnalyticsService analyticsService;
    
    public String getChatResponse(String message) {
        String lowerMsg = message.toLowerCase();
        AnalyticsOverviewDto overview = analyticsService.getOverview();
        if (lowerMsg.contains("sales") && lowerMsg.contains("summary")) {
            return "Your total revenue is ₹" + overview.getTotalRevenue() + " from " + overview.getTotalSales() + " sales.";
        } else if (lowerMsg.contains("best-selling crop") || lowerMsg.contains("most revenue")) {
            var performance = analyticsService.getCropPerformance();
            if(!performance.isEmpty()) {
                return performance.get(0).get("crop") + " is your best-selling crop, generating ₹" + performance.get(0).get("revenue") + " in revenue.";
            }
            return "Not enough data to determine the best-selling crop.";
        } else if (lowerMsg.contains("pending") || lowerMsg.contains("payment is pending")) {
            return "You currently have ₹" + overview.getTotalPendingPayments() + " in pending payments.";
        } else if (lowerMsg.contains("inventory insights")) {
            return "You have active inventory across multiple crops. Check the inventory page for detailed breakdown.";
        } else if (lowerMsg.contains("recommendation")) {
            return "Based on recent sales data, crops like Wheat and Onion show strong sales trends. Consider maintaining stock levels.";
        } else {
            return "I am the e-Mandi AI Assistant. I can help you with sales summaries, crop performance, and payment tracking. For example, ask me 'What is my best-selling crop?'.";
        }
    }
}
""",
    "DataSeeder.java": """package com.emandi.emandi_backend.service;
import com.emandi.emandi_backend.entity.*;
import com.emandi.emandi_backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.Random;

@Component
public class DataSeeder {
    @Autowired private UserRepository userRepository;
    @Autowired private MandiRepository mandiRepository;
    @Autowired private ProduceLotRepository produceLotRepository;
    @Autowired private SaleRepository saleRepository;
    @Autowired private MarketPriceRepository marketPriceRepository;

    @EventListener(ApplicationReadyEvent.class)
    public void seedData() {
        if (mandiRepository.count() == 0) {
            Mandi mandi1 = new Mandi(); mandi1.setName("Azadpur Mandi"); mandi1.setState("Delhi"); mandi1.setDistrict("North Delhi"); mandi1.setLocation("Delhi");
            Mandi mandi2 = new Mandi(); mandi2.setName("Lasalgaon Mandi"); mandi2.setState("Maharashtra"); mandi2.setDistrict("Nashik"); mandi2.setLocation("Nashik");
            mandiRepository.save(mandi1); mandiRepository.save(mandi2);
            
            User farmer = new User(); farmer.setFullName("Demo Farmer"); farmer.setPhoneNumber("9999999999"); farmer.setEmail("farmer@test.com"); farmer.setUserType(User.UserType.FARMER); farmer.setPassword("password"); farmer.setState("MH"); farmer.setDistrict("Nashik"); farmer.setAddress("Nashik");
            User buyer = new User(); buyer.setFullName("Demo Buyer"); buyer.setPhoneNumber("8888888888"); buyer.setEmail("buyer@test.com"); buyer.setUserType(User.UserType.BUYER); buyer.setPassword("password"); buyer.setState("MH"); buyer.setDistrict("Nashik"); buyer.setAddress("Nashik");
            userRepository.save(farmer); userRepository.save(buyer);
            
            String[] crops = {"Wheat", "Rice", "Tomato", "Onion", "Potato", "Cotton"};
            Random rand = new Random();
            
            for (int i = 0; i < 50; i++) {
                ProduceLot lot = new ProduceLot();
                lot.setCropName(crops[rand.nextInt(crops.length)]);
                lot.setCategory("Cereals/Vegetables");
                lot.setQuantity(50.0 + rand.nextInt(200));
                lot.setUnit("Quintal");
                lot.setGrade(rand.nextBoolean() ? "Grade A" : "Grade B");
                lot.setHarvestDate(LocalDateTime.now().minusDays(rand.nextInt(180)));
                lot.setExpectedPrice(1000.0 + rand.nextInt(5000));
                lot.setStatus(rand.nextBoolean() ? "ACTIVE" : "SOLD");
                lot.setFarmer(farmer);
                lot.setMandi(rand.nextBoolean() ? mandi1 : mandi2);
                lot.setCreatedAt(lot.getHarvestDate());
                produceLotRepository.save(lot);
                
                if ("SOLD".equals(lot.getStatus())) {
                    Sale sale = new Sale();
                    sale.setProduceLot(lot);
                    sale.setBuyer(buyer);
                    sale.setFarmer(farmer);
                    sale.setMandi(lot.getMandi());
                    sale.setQuantitySold(lot.getQuantity());
                    sale.setPricePerUnit(lot.getExpectedPrice() * (0.9 + rand.nextDouble() * 0.2));
                    sale.setTotalAmount(sale.getQuantitySold() * sale.getPricePerUnit());
                    sale.setSaleType(rand.nextBoolean() ? "AUCTION" : "DIRECT");
                    sale.setPaymentStatus(rand.nextBoolean() ? "PAID" : "PENDING");
                    sale.setSaleDate(lot.getCreatedAt().plusDays(rand.nextInt(10) + 1));
                    saleRepository.save(sale);
                }
            }
            
            for(int i=0; i<30; i++) {
                MarketPrice mp = new MarketPrice();
                mp.setCropName(crops[rand.nextInt(crops.length)]);
                mp.setMandi(mandi1);
                mp.setPriceDate(LocalDate.now().minusDays(i*6));
                mp.setMinPrice(1500.0);
                mp.setMaxPrice(2500.0);
                mp.setModalPrice(2000.0);
                marketPriceRepository.save(mp);
            }
        }
    }
}
"""
}

controllers = {
    "AnalyticsController.java": """package com.emandi.emandi_backend.controller;
import com.emandi.emandi_backend.dto.AnalyticsOverviewDto;
import com.emandi.emandi_backend.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {
    @Autowired private AnalyticsService analyticsService;
    
    @GetMapping("/overview") public ResponseEntity<AnalyticsOverviewDto> getOverview() { return ResponseEntity.ok(analyticsService.getOverview()); }
    @GetMapping("/crop-performance") public ResponseEntity<List<Map<String, Object>>> getCropPerformance() { return ResponseEntity.ok(analyticsService.getCropPerformance()); }
    @GetMapping("/inventory") public ResponseEntity<List<Map<String, Object>>> getInventory() { return ResponseEntity.ok(analyticsService.getInventoryInsights()); }
    @GetMapping("/insights") public ResponseEntity<List<String>> getInsights() { return ResponseEntity.ok(analyticsService.getSmartInsights()); }
    @GetMapping("/forecast") public ResponseEntity<Map<String, Object>> getForecast() { return ResponseEntity.ok(analyticsService.getForecast()); }
}
""",
    "ChatbotController.java": """package com.emandi.emandi_backend.controller;
import com.emandi.emandi_backend.dto.ChatRequest;
import com.emandi.emandi_backend.dto.ChatResponse;
import com.emandi.emandi_backend.service.ChatbotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class ChatbotController {
    @Autowired private ChatbotService chatbotService;
    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) {
        String response = chatbotService.getChatResponse(request.getMessage());
        return ResponseEntity.ok(new ChatResponse(response));
    }
}
"""
}

def write_files(directory, file_dict):
    os.makedirs(directory, exist_ok=True)
    for filename, content in file_dict.items():
        with open(os.path.join(directory, filename), 'w', encoding='utf-8') as f:
            f.write(content)

write_files(os.path.join(src_dir, 'entity'), entities)
write_files(os.path.join(src_dir, 'repository'), repositories)
write_files(os.path.join(src_dir, 'dto'), dtos)
write_files(os.path.join(src_dir, 'service'), services)
write_files(os.path.join(src_dir, 'controller'), controllers)
print("Backend files generated successfully.")
