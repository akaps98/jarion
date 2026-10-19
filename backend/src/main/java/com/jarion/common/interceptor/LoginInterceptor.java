package com.jarion.common.interceptor;

import java.util.Enumeration;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@Slf4j
@Component
public class LoginInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        log.info("LoginInterceptor has been loaded... ||| Context Path: " + request.getContextPath());

        HttpSession session = request.getSession(false);

        // 현재 세션 확인용
        if (session != null) {
            log.info("Session ID: {}", session.getId());

            Enumeration<String> names = session.getAttributeNames();

            while (names.hasMoreElements()) {
                String name = names.nextElement();
                Object value = session.getAttribute(name);

                log.info("Session Attribute - {}: {}", name, value);
            }
        }

        // 로그인한 세션이 없으면
        if (session == null || session.getAttribute("loginUser") == null) {
            // 401 unauthorized
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json;charset=UTF-8");

            response.getWriter().write(
                    "{\"message\":\"로그인이 필요합니다.\"}"
            );

            return false;
        }

        // 로그인 세션 있을때만
        log.info("Login session confirmed || Session ID: {}", session.getId());
        return true;
    }

    // 추후 필요할 시 사용
//	@Override
//	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
//			@Nullable ModelAndView modelAndView) throws Exception {
//		// TODO Auto-generated method stub
//		HandlerInterceptor.super.postHandle(request, response, handler, modelAndView);
//	}
//
//	@Override
//	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler,
//			@Nullable Exception ex) throws Exception {
//		// TODO Auto-generated method stub
//		HandlerInterceptor.super.afterCompletion(request, response, handler, ex);
//	}

}