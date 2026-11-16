package com.jarion.reservation;

import com.jarion.reservation.utils.validator.ReservationEventValidator;
import com.jarion.reservation.vo.ReservationEventCreateVO;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class ReservationEventValidatorTest {

    private final ReservationEventValidator validator = new ReservationEventValidator();


    @Test
    void ValidateBoothMaxCount(){
        ReservationEventCreateVO requestParam = new ReservationEventCreateVO();
        requestParam.setBoothCols(21);
        requestParam.setBoothRows(21);

        assertThrows(
                ResponseStatusException.class,
                () -> validator.validate(requestParam)
        );
    }

    @Test
    void acceptsExactlyFourHundredBooths() {
        ReservationEventCreateVO request = new ReservationEventCreateVO();
        request.setBoothRows(20);
        request.setBoothCols(20);
        assertDoesNotThrow(() -> validator.validate(request));
    }

    @Test
    void rejectsOverLimitWithBadRequest() {
        ReservationEventCreateVO request = new ReservationEventCreateVO();
        request.setBoothRows(21);
        request.setBoothCols(20);
        ResponseStatusException error = assertThrows(ResponseStatusException.class,
                () -> validator.validate(request));
        assertEquals(400, error.getStatusCode().value());
    }
}
