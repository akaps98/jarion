package com.jarion.community.controller;

import com.jarion.community.service.CommunityService;
import com.jarion.community.vo.CommunityPostVO;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/community")
public class CommunityController {
    private final CommunityService communityService;

    public CommunityController(CommunityService communityService) {
        this.communityService = communityService;
    }

    @GetMapping("/all")
    public ResponseEntity<?> selectAllCommunityPosts(HttpSession session) {
         List<CommunityPostVO> allPosts = communityService.selectAllCommunityPosts();

         if (allPosts.isEmpty()) {
             return ResponseEntity.notFound().build();
         }

         return ResponseEntity.ok(allPosts);
    }

}
