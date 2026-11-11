package com.jarion.reservation.vo;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ReservationBoothVO {
    private Long boothId;
    private Long eventId;
    private Integer positionRow;
    private Integer positionCol;
    private String boothName;

    //선택 날짜의 사진사.
    private Long userId;
    private String userName;
    private boolean isUsing;
    private List<ReservationTimeTableVO> timeTable;
}
