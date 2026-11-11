package com.jarion.reservation.vo;


import com.jarion.reservation.enums.ReservationStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ReservationReserveVO {
    private Long reservationId;
    private Long boothId;
    private Long userId;
    private Long occupancyId;
    private String userName;

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private boolean isActivating;
    private ReservationStatus status;
}
