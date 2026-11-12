package com.jarion.reservation.controller;


import com.jarion.reservation.service.ReservationService;
import com.jarion.reservation.vo.ReservationEventVO;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/events")
public class EventController {

    private final ReservationService reservationService;

    public EventController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @GetMapping("")
    public ResponseEntity<?> getEvents() {
        List<ReservationEventVO> EventLists = reservationService.selectAllReservationEvent();
        return ResponseEntity.ok(EventLists);
    }
}
