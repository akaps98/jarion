package com.jarion.reservation.vo;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class ReservationEventDayVO {

    private Long eventDayId;
    private Long eventId;
    private LocalDate eventDate;
    private LocalTime openTime;
    private LocalTime closeTime;
}
