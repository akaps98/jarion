package com.jarion.reservation.vo;


import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;



@Getter
@Setter
public class ReservationTimeTableVO {
    private List<ReservationReserveVO> reservations;
    private LocalDate date;
}
