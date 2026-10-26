package com.jarion.reservation.vo;


import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ReservationReserveVO {

    private Long ReservationId;
    private String userId;
    private String userName;

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private boolean isActivating;
}
