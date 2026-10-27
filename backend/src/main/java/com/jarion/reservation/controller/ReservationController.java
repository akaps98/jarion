package com.jarion.reservation.controller;


import com.jarion.reservation.service.ReservationService;
import com.jarion.reservation.vo.ReservationBoothVO;
import com.jarion.reservation.vo.ReservationReserveVO;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.DayOfWeek;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/reservation")
public class ReservationController {
    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService){
        this.reservationService = reservationService;
    }

    @GetMapping("/reservation/allBooths")
    public ResponseEntity<?> selectAllReservationBooth(HttpSession session){
        log.debug("=====ReservationController::selectAllReservationBooth");

        if(session.getAttribute("loginUser") == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<ReservationBoothVO> allBooths = reservationService.selectAllReservationBooths();

        if(allBooths.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(allBooths);
    }

    @GetMapping("/reservation/allReservations")
    public ResponseEntity<?> selectAllReservations(HttpSession session){
        log.debug("=====ReservationController::selectAllReservations");
        if(session.getAttribute("loginUser") == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<ReservationReserveVO> allReservations = reservationService.selectAllReservationReserves();

        return ResponseEntity.ok(allReservations);
    }

    @GetMapping("/reservation/allReservationsOfBooth")
    public ResponseEntity<?> selectAllReservationsOfBooth(@RequestParam Long boothId, HttpSession session){
        log.debug("=====ReservationController::selectAllReservationsOfBooth");

        if(session.getAttribute("loginUser") == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<ReservationReserveVO> allReservations = reservationService.selectAllReservationOfBooths(boothId);
        return ResponseEntity.ok(allReservations);
    }

    @GetMapping("/reservation/allReservationsOfBoothOfDayOfWeek")
    public ResponseEntity<?> selectAllReservationsOfBoothOfDayOfWeek(@RequestParam Long boothId, @RequestParam DayOfWeek dayOfWeek, HttpSession session){
        log.debug("=====ReservationController::selectAllReservationsOfBoothOfDayOfWeek");

        if(session.getAttribute("loginUser") == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<ReservationReserveVO> ReservationsOfBoothOfDayOfWeek = reservationService.selectAllReservationOfBooths(boothId, dayOfWeek);

        return ResponseEntity.ok(ReservationsOfBoothOfDayOfWeek);
    }

}
