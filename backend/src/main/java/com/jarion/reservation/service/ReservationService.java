package com.jarion.reservation.service;


import com.jarion.reservation.dao.ReservationDao;
import com.jarion.reservation.utils.validator.ReservationEventValidator;
import com.jarion.reservation.vo.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@Service
public class ReservationService {
    private final ReservationDao reservationDao;
    private final ReservationEventValidator reservationEventValidator;

    public ReservationService(
            ReservationDao reservationDao,
            ReservationEventValidator reservationEventValidator) {
        this.reservationDao = reservationDao;
        this.reservationEventValidator = reservationEventValidator;
    }


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
        // 0. 행사 검증
        reservationEventValidator.validate(requestParam);

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

    public List<ReservationEventVO> selectAllReservationEvent() {
        return reservationDao.selectAllReservationEvent();
    }

    public ReservationEventDetailVO getEventDetail(Long eventId){
        ReservationEventVO event = reservationDao.selectEventById(eventId);

        if(event == null){
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "행사를 찾을 수 없습니다."
            );
        }
        List<ReservationEventDayVO> days = reservationDao.selectEventDays(eventId);

        ReservationEventDetailVO detail = new ReservationEventDetailVO();
        detail.setEventId(event.getEventId());
        detail.setEventName(event.getEventName());
        detail.setLocation(event.getLocation());
        detail.setDays(days);
        return detail;
    }
}
