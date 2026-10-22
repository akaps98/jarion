package com.jarion.community.controller;

import com.jarion.community.service.CommunityService;
import com.jarion.community.vo.CommunityCategoryVO;
import com.jarion.community.vo.CommunityPostVO;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

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

        if(session.getAttribute("loginUser") == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<CommunityPostVO> allPosts = communityService.selectAllCommunityPosts();

        if (allPosts.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(allPosts);
    }

    @GetMapping("/category/all")
    public ResponseEntity<?> selectAllCommunitycategories(HttpSession session) {
        log.debug("=====CommunityController::selectAllCommunitycategories=====");

        if(session.getAttribute("loginUser") == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<CommunityCategoryVO> allCategories = communityService.selectAllCommunityCategories();

        if (allCategories.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(allCategories);
    }

    @PostMapping("/post/viewcount")
    public ResponseEntity<?> updatePostViewCount(@RequestBody String postId, HttpSession session) {
        log.debug("=====CommunityController::updatePostViewCount=====");

        if(session.getAttribute("loginUser") == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        communityService.updatePostViewCount(postId);

        return ResponseEntity.ok().build();
    }
}
