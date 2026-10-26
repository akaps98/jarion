package com.jarion.reservation.vo;


import lombok.Getter;
import lombok.Setter;

import java.time.DayOfWeek;
import java.util.List;



@Getter
@Setter
public class ReservationTimeTableVO {
    private List<ReservationReserveVO> reservations;
    private DayOfWeek dayOfWeek;
}
