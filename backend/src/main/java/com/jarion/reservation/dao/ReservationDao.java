package com.jarion.reservation.dao;


import com.jarion.reservation.vo.*;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ReservationDao {
    private final SqlSessionTemplate sqlSession;

    public ReservationDao(SqlSessionTemplate sqlSession) {this.sqlSession = sqlSession;}

    //전체 부스 조회
    public List<ReservationBoothVO> selectAllReservationBooths() {
        return sqlSession.selectList("reservation.selectAllReservationBooths");
    }

    //전체 예약 조회
    public List<ReservationReserveVO> selectAllReservationReserves(){
        return sqlSession.selectList("reservation.selectAllReservationReserves");
    }

    // 특정 부스의 전체 예약 조회
    public List<ReservationReserveVO> selectAllReservationOfBooths(Long boothId){
        return sqlSession.selectList("reservation.selectAllReservationOfBooths", boothId);
    }

    //해당 '부스'의 특정 날짜 모든 예약 조회.
    public List<ReservationReserveVO> selectAllReservationOfBooths(ReservationSearchVO reservationSearchVO){
        return sqlSession.selectList("reservation.selectAllReservationOfDayOfWeekOfBooths", reservationSearchVO);
    }

    public int insertEvent(ReservationEventVO event){
        return sqlSession.insert("reservation.insertEvent", event);
    }

    public int insertEventDay(ReservationEventDayVO day){
        return sqlSession.insert("reservation.insertEventDay", day);
    }
    public int insertBooth(ReservationBoothVO booth){
        return sqlSession.insert("reservation.insertBooth", booth);
    }


    public List<ReservationEventVO> selectAllReservationEvent(){
        return sqlSession.selectList("reservation.selectEvents");
    }

}
