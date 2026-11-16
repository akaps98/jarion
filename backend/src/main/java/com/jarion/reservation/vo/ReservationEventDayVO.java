package com.jarion.reservation.vo;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class ReservationEventDayVO {
    private Long eventDayId;
    private Long eventId;

    @NotNull
    private LocalDate eventDate;
    @NotNull
    private LocalTime openTime;
    @NotNull
    private LocalTime closeTime;
}
