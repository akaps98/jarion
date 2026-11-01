package com.jarion.reservation.vo;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
public class ReservationSearchVO {
    private Long boothId;
    private LocalDate date;
}
