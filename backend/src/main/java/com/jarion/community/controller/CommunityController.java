package com.jarion.community.controller;

import com.jarion.community.service.CommunityService;
import com.jarion.community.vo.CommunityCategoryVO;
import com.jarion.community.vo.CommunityPostVO;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/community")
public class CommunityController {
    private final CommunityService communityService;

    public CommunityController(CommunityService communityService) {
        this.communityService = communityService;
    }

    @GetMapping("/post/all")
    public ResponseEntity<?> selectAllCommunityPosts(HttpSession session) {
         log.debug("=====CommunityController::selectAllCommunityPosts=====");

         List<CommunityPostVO> allPosts = communityService.selectAllCommunityPosts();

         if(session == null) {
             return ResponseEntity.notFound().build();
         }

         if (allPosts.isEmpty()) {
             return ResponseEntity.notFound().build();
         }

         return ResponseEntity.ok(allPosts);
    }

    @GetMapping("/category/all")
    public ResponseEntity<?> selectAllCommunitycategories(HttpSession session) {
        log.debug("=====CommunityController::selectAllCommunitycategories=====");
        List<CommunityCategoryVO> allCategories = communityService.selectAllCommunityCategories();

        if(session == null) {
            return ResponseEntity.notFound().build();
        }

        if (allCategories.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(allCategories);
    }
}
