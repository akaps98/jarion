package com.jarion.reservation.vo;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.DayOfWeek;

@Getter
@Setter
@AllArgsConstructor
public class ReservationSearchVO {
    private Long boothId;
    private DayOfWeek dayOfWeek;
}
