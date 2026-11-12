package com.jarion.Admin.Controller;


import com.jarion.common.vo.UserVO;
import com.jarion.reservation.service.ReservationService;
import com.jarion.reservation.vo.ReservationEventCreateVO;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/admin")
public class AdminEventController {

    private final ReservationService reservationService;

    public AdminEventController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @PostMapping("/events")
    public ResponseEntity<?> createEvent(
            @RequestBody ReservationEventCreateVO requestParam,
            HttpSession session){
        UserVO loginUser = (UserVO) session.getAttribute("loginUser");
        if(loginUser == null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        if(!"ADMIN".equals(loginUser.getUserRole())){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Long eventId = reservationService.createEvent(requestParam);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("eventId", eventId));
    }
}
