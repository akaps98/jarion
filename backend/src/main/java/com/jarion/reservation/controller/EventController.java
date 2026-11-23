package com.jarion.reservation.controller;


import com.jarion.reservation.service.ReservationService;
import com.jarion.reservation.vo.ReservationBoothVO;
import com.jarion.reservation.vo.ReservationEventVO;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;



/*
행사와 행사별 부스 조회
 */
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

    @GetMapping("/{eventId}")
    public ResponseEntity<?> getEventById(@PathVariable("eventId") Long eventId){
        return ResponseEntity.ok(reservationService.getEventDetail(eventId));
    }

    //날짜 별 부스 점유 현황.
    @GetMapping("/{eventId}/booths")
    public ResponseEntity<?> getBoothById(@PathVariable("eventId") Long eventId, @RequestParam(required = false)@DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date, HttpSession session){
        List<ReservationBoothVO> booths = reservationService.getEventBooths(eventId, date);
        return ResponseEntity.ok(booths);
    }

}
