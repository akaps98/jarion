package com.jarion.common.controller;

import java.security.KeyPair;
import java.security.PrivateKey;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

import com.jarion.common.service.UserService;
import com.jarion.common.vo.LoginVO;
import com.jarion.common.vo.UserVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.jarion.common.util.RSAUtil;

import jakarta.servlet.http.HttpSession;

@Slf4j
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();

        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginVO loginVO, HttpSession session) {
        try {
            PrivateKey privateKey =
                    (PrivateKey) session.getAttribute("rsaPrivateKey");

            if (privateKey == null) {
                Map<String, Object> result = new HashMap<>();
                result.put("message", "RSA 키가 존재하지 않습니다.");

                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(result);
            }

            // RSA 복호화
            String password = RSAUtil.decrypt(
                    loginVO.getEncryptedPassword(),
                    privateKey
            );

            // RSA 키는 1회용으로 사용
            session.removeAttribute("rsaPrivateKey");

            // 여기부터는 기존 BCrypt 로그인
            UserVO user = userService.login(
                    loginVO.getLoginId(),
                    password
            );

            if (user == null) {
                Map<String, Object> result = new HashMap<>();
                result.put(
                        "message",
                        "아이디 또는 비밀번호가 올바르지 않습니다."
                );

                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(result);
            }

            // 로그인한 시간 추가
            userService.updateLastLoginDt(loginVO.getLoginId());

            session.setAttribute("loginUser", user);

            log.info(
                    "Login success || userId: {} || loginId: {}",
                    user.getUserId(),
                    user.getLoginId()
            );

            Map<String, Object> result = new HashMap<>();
            result.put("message", "로그인 성공");
            result.put("userName", user.getUserName());
            result.put("userRole", user.getUserRole());

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Login processing error", e);

            session.removeAttribute("rsaPrivateKey");

            Map<String, Object> result = new HashMap<>();
            result.put("message", "로그인 처리 중 오류가 발생했습니다.");

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(result);
        }
    }

    // 세션체크용 api
    @GetMapping("/session")
    public ResponseEntity<?> checkSession(HttpSession session) {
        UserVO loginUser = (UserVO) session.getAttribute("loginUser");

        if (loginUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.ok(loginUser);
    }

    // rsa key 쌍 생성
    @GetMapping("/rsa-key")
    public Map<String, String> getRSAKey(HttpSession session) throws Exception {
        KeyPair keyPair = RSAUtil.generateKeyPair();

        // private key must be stored on only SERVER SESSION;
        session.setAttribute("rsaPrivateKey", keyPair.getPrivate());

        // Transform public key to 'Base 64' string form
        String publicKey = Base64.getEncoder()
                .encodeToString(keyPair.getPublic().getEncoded());

        Map<String, String> result = new HashMap<>();

        result.put("publicKey", publicKey);

        return result;
    }
}