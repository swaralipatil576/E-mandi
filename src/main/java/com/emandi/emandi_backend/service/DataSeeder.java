package com.emandi.emandi_backend.service;
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
    @Autowired private StockMovementRepository stockMovementRepository;
    @Autowired private ResourceRepository resourceRepository;
    @Autowired private ResourceRequestRepository resourceRequestRepository;

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
                
                // Generate Stock IN Movement
                StockMovement inMovement = new StockMovement();
                inMovement.setProduceLot(lot);
                inMovement.setFarmer(farmer);
                inMovement.setCropName(lot.getCropName());
                inMovement.setQuantity(lot.getQuantity());
                inMovement.setMovementType("IN");
                inMovement.setMovementDate(lot.getCreatedAt());
                stockMovementRepository.save(inMovement);
                
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

                    // Generate Stock OUT Movement
                    StockMovement outMovement = new StockMovement();
                    outMovement.setProduceLot(lot);
                    outMovement.setFarmer(farmer);
                    outMovement.setSale(sale);
                    outMovement.setCropName(lot.getCropName());
                    outMovement.setQuantity(sale.getQuantitySold());
                    outMovement.setMovementType("OUT");
                    outMovement.setMovementDate(sale.getSaleDate());
                    stockMovementRepository.save(outMovement);
                }
            }

            // Seed Resources
            String[] resourceTypes = {"Transport", "Mandi Slot", "Storage"};
            for (int i = 1; i <= 10; i++) {
                Resource r = new Resource();
                r.setResourceName("Resource-" + i);
                r.setResourceType(resourceTypes[rand.nextInt(3)]);
                r.setLocation(rand.nextBoolean() ? "Nashik" : "Delhi");
                r.setCapacity(500.0 + rand.nextInt(2000));
                r.setStatus(rand.nextBoolean() ? "Available" : (rand.nextBoolean() ? "Allocated" : "Unavailable"));
                resourceRepository.save(r);
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
