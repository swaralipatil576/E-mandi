package com.emandi.emandi_backend.dto;
import lombok.Data;
@Data public class AnalyticsOverviewDto {
    private Double totalRevenue; private Long totalSales; private Double totalQuantitySold;
    private Double averageSellingPrice; private Double totalPendingPayments; private Double activeInventoryValue;
}
