package com.jarion.reservation.service;


import com.jarion.reservation.dao.ReservationDao;
import com.jarion.reservation.vo.ReservationBoothVO;
import com.jarion.reservation.vo.ReservationReserveVO;
import com.jarion.reservation.vo.ReservationSearchVO;
import org.springframework.stereotype.Service;

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
}
