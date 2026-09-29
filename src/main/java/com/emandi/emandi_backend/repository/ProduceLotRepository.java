package com.emandi.emandi_backend.repository;
import com.emandi.emandi_backend.entity.ProduceLot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
public interface ProduceLotRepository extends JpaRepository<ProduceLot, Long> {
    List<ProduceLot> findByStatus(String status);
    @Query("SELECT p.cropName, SUM(p.quantity) FROM ProduceLot p GROUP BY p.cropName")
    List<Object[]> getInventoryByCrop();
}