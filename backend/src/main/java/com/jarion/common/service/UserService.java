package com.jarion.common.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.jarion.common.dao.UserDao;
import com.jarion.common.vo.UserVO;

@Service
public class UserService {
    private final UserDao userDao;

    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public UserService(UserDao userDao) {
        this.userDao = userDao;
    }

    public UserVO login(String loginId, String password) {
        UserVO user = userDao.selectUserByLoginId(loginId);

        if (user == null) {
            return null;
        }

        if (!encoder.matches(password, user.getPassword())) {
            return null;
        }

        user.setPassword(null);

        return user;
    }
}