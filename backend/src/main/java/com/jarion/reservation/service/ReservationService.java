package com.jarion.reservation.service;


import com.jarion.reservation.dao.ReservationDao;
import com.jarion.reservation.vo.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class ReservationService {
    private final ReservationDao reservationDao;

    public ReservationService(ReservationDao reservationDao){ this.reservationDao = reservationDao; }


    public List<ReservationBoothVO> selectAllReservationBooths(){
        return reservationDao.selectAllReservationBooths();
    }

    public List<ReservationReserveVO> selectAllReservationReserves(){
        return reservationDao.selectAllReservationReserves();
    }

    public List<ReservationReserveVO> selectAllReservationOfBooths(Long boothId){
        return reservationDao.selectAllReservationOfBooths(boothId);
    }

    public List<ReservationReserveVO> selectAllReservationOfBooths(Long boothId, LocalDate date){
        ReservationSearchVO reservationSearchVO = new ReservationSearchVO(boothId, date);
        return reservationDao.selectAllReservationOfBooths(reservationSearchVO);
    }

    @Transactional
    public Long createEvent(ReservationEventCreateVO requestParam){
        // 1. 행사 등록
        ReservationEventVO event = new ReservationEventVO();
        event.setEventName(requestParam.getEventName());
        event.setLocation(requestParam.getLocation());

        reservationDao.insertEvent(event);

        Long eventId = event.getEventId();

        // 2. 운영일 등록.
        for(ReservationEventDayVO day : requestParam.getDays()){
            day.setEventId(eventId);
            reservationDao.insertEventDay(day);
        }

        // 3. 부스 주입.
        for(int row = 1; row <= requestParam.getBoothRows(); row++){
            for(int col = 1; col <= requestParam.getBoothCols(); col++){
                ReservationBoothVO booth = new ReservationBoothVO();
                booth.setEventId(eventId);
                booth.setPositionRow(row);
                booth.setPositionCol(col);
                booth.setBoothName(row + "-" + col);

                reservationDao.insertBooth(booth);
            }
        }

        return eventId;
    }

    public List<ReservationEventVO> selectAllReservationEvent(){
        return reservationDao.selectAllReservationEvent();
    }
}
