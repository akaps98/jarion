package com.jarion.reservation.controller;


import com.jarion.reservation.service.ReservationService;
import com.jarion.reservation.vo.ReservationBoothVO;
import com.jarion.reservation.vo.ReservationReserveVO;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/reservation")
public class ReservationController {
    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService){
        this.reservationService = reservationService;
    }

    @GetMapping("/allBooths")
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

    @GetMapping("/allReservations")
    public ResponseEntity<?> selectAllReservations(HttpSession session){
        log.debug("=====ReservationController::selectAllReservations");
        if(session.getAttribute("loginUser") == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<ReservationReserveVO> allReservations = reservationService.selectAllReservationReserves();

        return ResponseEntity.ok(allReservations);
    }

    @GetMapping("/booths/{boothId}/reservations")
    public ResponseEntity<?> selectAllReservationsOfBooth(@PathVariable Long boothId, @RequestParam(required = false)@DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date, HttpSession session){
        log.debug("=====ReservationController::selectAllReservationsOfBooth");

        if(session.getAttribute("loginUser") == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<ReservationReserveVO> reservations = date == null
                ? reservationService.selectAllReservationOfBooths(boothId)
                : reservationService.selectAllReservationOfBooths(boothId, date);
        return ResponseEntity.ok(reservations);
    }

}
