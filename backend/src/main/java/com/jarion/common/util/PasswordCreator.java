package com.jarion.common.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

// test password creation
public class PasswordCreator {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        String password = encoder.encode("4231");

        System.out.println("Encrpyted password is " + password);
    }
}