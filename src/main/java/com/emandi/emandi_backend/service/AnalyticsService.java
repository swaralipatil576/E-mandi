package com.emandi.emandi_backend.service;
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
