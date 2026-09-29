package com.emandi.emandi_backend.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.emandi.emandi_backend.dto.AnalyticsOverviewDto;
@Service
public class ChatbotService {
    @Autowired private AnalyticsService analyticsService;
    @Autowired private InventoryService inventoryService;
    @Autowired private ResourceService resourceService;
    
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
        } else if (lowerMsg.contains("inventory needs attention") || lowerMsg.contains("attention")) {
            var inv = inventoryService.getInventoryDashboard();
            return "You have " + inv.get("lowStockCount") + " crops with low stock and " + inv.get("slowMovingCount") + " slow-moving lots requiring attention.";
        } else if (lowerMsg.contains("slow-moving") || lowerMsg.contains("slow moving")) {
            var inv = inventoryService.getInventoryDashboard();
            return "There are " + inv.get("slowMovingCount") + " lots that are moving slower than expected.";
        } else if (lowerMsg.contains("how much stock")) {
            var inv = inventoryService.getInventoryDashboard();
            return "Your current total stock is " + inv.get("totalInventoryQuantity") + " across " + inv.get("activeLotsCount") + " active lots.";
        } else if (lowerMsg.contains("resources are available") || lowerMsg.contains("available resource")) {
            var util = resourceService.getUtilizationDashboard();
            return "There are currently " + util.get("available") + " resources available for allocation.";
        } else if (lowerMsg.contains("vehicle available") || lowerMsg.contains("vehicle")) {
            return "Please check the resources dashboard to view specific vehicle availability and request allocation for your lot.";
        } else if (lowerMsg.contains("allocated") && lowerMsg.contains("resources")) {
            var util = resourceService.getUtilizationDashboard();
            return "Currently, " + util.get("allocated") + " resources are allocated and in use.";
        } else if (lowerMsg.contains("stock movement")) {
            return "Your recent stock movements can be viewed in the Stock Movements page of the Inventory section.";
        } else {
            return "I am the e-Mandi AI Assistant. I can help you with sales summaries, inventory alerts, and resource availability. Ask me 'How much stock do I currently have?'.";
        }
    }
}
