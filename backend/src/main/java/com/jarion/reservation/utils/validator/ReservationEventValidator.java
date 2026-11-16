package com.jarion.reservation.utils.validator;


import com.jarion.reservation.vo.ReservationEventCreateVO;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
public class ReservationEventValidator {

    private static final long MAX_BOOTH_COUNT = 400L;
    public void validate(ReservationEventCreateVO requestParam){
        // VO에서 검사 대부분 하고 있음.
        // 전체 부스 개수 제한 검사.
        validateBoothCount(requestParam.getBoothRows(), requestParam.getBoothCols());
    }


    private void validateBoothCount(Integer boothRows, Integer boothCols){
        long boothCount = (long)boothRows * boothCols;

        if(boothCount > MAX_BOOTH_COUNT){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "최대 부스 개수를 초과했습니다."
            );
        }
    }

}
