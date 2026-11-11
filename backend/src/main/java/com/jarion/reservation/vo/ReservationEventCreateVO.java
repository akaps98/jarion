package com.jarion.reservation.vo;


import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ReservationEventCreateVO {
    private String eventName;
    private String location;
    private Integer boothRows;
    private Integer boothCols;
    private List<ReservationEventDayVO> days;
}
