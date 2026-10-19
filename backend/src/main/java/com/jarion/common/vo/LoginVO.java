package com.jarion.common.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginVO {
    private String loginId;
    private String encryptedPassword;
}
