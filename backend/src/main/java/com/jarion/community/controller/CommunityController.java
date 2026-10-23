package com.jarion.community.controller;

import com.jarion.common.vo.UserVO;
import com.jarion.community.service.CommunityService;
import com.jarion.community.vo.CommunityCategoryVO;
import com.jarion.community.vo.CommunityCommentVO;
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

    // GET 요청에는 body 못들어감
    // @RequestBody -> @RequestParam으로 변경
    @GetMapping("/post/comment")
    public ResponseEntity<?> selectCommentsOnPost(@RequestParam String postId, HttpSession session) {
        log.debug("=====CommunityController::selectCommentsOnPost=====");

        if(session.getAttribute("loginUser") == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<CommunityCommentVO> comments = communityService.selectCommentsOnPost(postId);

        // 게시글에 댓글이 없는 경우도 있음
//        if (comments.isEmpty()) {
//            return ResponseEntity.notFound().build();
//        }

        return ResponseEntity.ok(comments);
    }

    @PostMapping("/post")
    public ResponseEntity<?> insertSinglePost(@RequestBody CommunityPostVO post, HttpSession session) {
        log.debug("=====CommunityController::insertSinglePost=====");

        UserVO loginUser = (UserVO) session.getAttribute("loginUser");

        if(loginUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        post.setUserId(loginUser.getUserId());

        communityService.insertSinglePost(post);

        return ResponseEntity.ok().build();
    }
}
