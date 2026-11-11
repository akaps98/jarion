package com.jarion.reservation.vo;


import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Date;

@Getter
@Setter
public class ReservationOccupancyVO {
    private Long occupancyId;
    private Long boothId;
    private Long eventDayId;
    private Long userId;
    private LocalDate occupancyDate;
}
