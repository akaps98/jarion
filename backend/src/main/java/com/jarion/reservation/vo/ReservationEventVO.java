package com.jarion.reservation.vo;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ReservationEventVO {
    private Long eventId;
    private String eventName;
    private String location;
    private LocalDateTime createDt;
    private LocalDateTime updateDt;
}
