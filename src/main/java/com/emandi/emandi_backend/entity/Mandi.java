package com.emandi.emandi_backend.entity;
import jakarta.persistence.*;
import lombok.Data;
@Entity @Table(name = "mandis") @Data
public class Mandi {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private String name; private String state; private String district; private String location;
}
