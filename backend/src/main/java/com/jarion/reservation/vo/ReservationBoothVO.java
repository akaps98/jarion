package com.jarion.reservation.vo;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ReservationBoothVO {
    private Long boothId;
    private String boothName;
    private String userId;
    private String userName;

    private boolean isUsing;
    private List<ReservationTimeTableVO> timeTable;
}
