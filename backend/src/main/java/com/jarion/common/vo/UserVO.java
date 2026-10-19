package com.jarion.common.vo;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class UserVO {
    private Long userId;
    private String loginId;
    private String password;
    private String userName;
    private String userRole;
    private String status;
    private LocalDateTime createDt;
    private LocalDateTime updateDt;
    private LocalDateTime lastLoginDt;
}