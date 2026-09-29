package com.emandi.emandi_backend.repository;
import com.emandi.emandi_backend.entity.Resource;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResourceRepository extends JpaRepository<Resource, Long> {
}
