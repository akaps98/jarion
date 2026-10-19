package com.jarion.common.dao;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.jarion.common.vo.UserVO;

@Repository
public class UserDao {
    @Autowired
    private SqlSessionTemplate sqlSession;

    public UserVO selectUserByLoginId(String loginID) {
        return sqlSession.selectOne("selectUserByLoginId", loginID);
    }
}