package com.jarion.reservation.vo;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ReservationEventDetailVO {
    private Long eventId;
    private String eventName;
    private String location;
    private List<ReservationEventDayVO> days;
}
