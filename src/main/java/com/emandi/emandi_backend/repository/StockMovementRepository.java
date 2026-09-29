package com.emandi.emandi_backend.repository;
import com.emandi.emandi_backend.entity.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {
    List<StockMovement> findAllByOrderByMovementDateDesc();
}
