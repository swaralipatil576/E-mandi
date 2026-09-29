package com.emandi.emandi_backend.repository;
import com.emandi.emandi_backend.entity.ResourceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface ResourceRequestRepository extends JpaRepository<ResourceRequest, Long> {
    List<ResourceRequest> findByAllocatedResourceIdAndStatusAndPreferredDateBetween(
        Long resourceId, String status, LocalDateTime start, LocalDateTime end
    );
}
