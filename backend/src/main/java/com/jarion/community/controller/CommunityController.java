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

        // 세션 없어도 게시글 확인 가능
//        if(session.getAttribute("loginUser") == null) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//        }

        List<CommunityPostVO> allPosts = communityService.selectAllCommunityPosts();

        if (allPosts.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(allPosts);
    }

    @GetMapping("/category/all")
    public ResponseEntity<?> selectAllCommunitycategories(HttpSession session) {
        log.debug("=====CommunityController::selectAllCommunitycategories=====");

        List<CommunityCategoryVO> allCategories = communityService.selectAllCommunityCategories();

        if (allCategories.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(allCategories);
    }

    @PostMapping("/post/viewcount")
    public ResponseEntity<?> updatePostViewCount(@RequestBody String postId, HttpSession session) {
        log.debug("=====CommunityController::updatePostViewCount=====");

        communityService.updatePostViewCount(postId);

        return ResponseEntity.ok().build();
    }

    // GET 요청에는 body 못들어감
    // @RequestBody -> @RequestParam으로 변경
    @GetMapping("/post/comment")
    public ResponseEntity<?> selectCommentsOnPost(@RequestParam String postId, HttpSession session) {
        log.debug("=====CommunityController::selectCommentsOnPost=====");

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

    @PostMapping("/comment")
    public ResponseEntity<?> insertSingleComment(@RequestBody CommunityCommentVO comment, HttpSession session) {
        log.debug("=====CommunityController::insertSingleComment=====");

        UserVO loginUser = (UserVO) session.getAttribute("loginUser");

        if(loginUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        comment.setUserId(loginUser.getUserId());

        communityService.insertSingleComment(comment);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/comment/child")
    public ResponseEntity<?> insertCommentChild(@RequestBody CommunityCommentVO comment, HttpSession session) {
        log.debug("=====CommunityController::insertCommentChild=====");

        UserVO loginUser = (UserVO) session.getAttribute("loginUser");

        if(loginUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        comment.setUserId(loginUser.getUserId());

        communityService.insertChildComment(comment);

        return ResponseEntity.ok().build();
    }

    // 삭제 버튼 띄우기 위한 용도
    // GET요청에 Body(@RequestBody) 사용불가!!!
    @GetMapping("/post/ownPost")
    public ResponseEntity<?> findOwnPost(@RequestParam String postId, HttpSession session) {
        log.debug("=====CommunityController::findOwnPost=====");

        UserVO loginUser = (UserVO) session.getAttribute("loginUser");

        // 로그인 하지 않은 유저도 게시글 조회 가능
        // 해당 단계에서 UNAUTHORIZED 띄울 시 로직에 맞지 않음
//        if(loginUser == null) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//        }

        if(loginUser == null) {
            return ResponseEntity.ok(0);
        }

        CommunityPostVO postVO = new CommunityPostVO();

        postVO.setUserId(loginUser.getUserId());
        postVO.setPostId(postId);

        // 0: 본인의 게시글 아님
        // 1: 본인의 게시글임
        int checkOwnPost = communityService.findOwnPost(postVO);

        return ResponseEntity.ok(checkOwnPost);
    }

    // 프론트에서 json으로 보내기때문에 String으로 받는게 아니라 VO 객체로 받아서 쓰면 됨;
    // Jackson에 의하여 자동 바인딩!
    @PostMapping("/post/delete")
    public ResponseEntity<?> deleteSinglePost(@RequestBody CommunityPostVO postVO, HttpSession session) {
        log.debug("=====CommunityController::deleteSinglePost=====");

        UserVO loginUser = (UserVO) session.getAttribute("loginUser");

        if(loginUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        postVO.setUserId(loginUser.getUserId());

        // 현재 로그인한 사용자가 작성한 게시글의 작성자일 경우; 삭제 가능
        // 261125 jskang; 백단에서 확인 로직은 필요할거 같은데.. 프론트에서 안쓰게? 고민해볼것
        if (communityService.findOwnPost(postVO) > 0) {
            communityService.deleteSinglePost(postVO.getPostId());

            return ResponseEntity.ok().build();
        }

        // 현재 로그인한 사용자가 작성한 게시글의 작성자가 아닐 경우; 삭제 불가
        // 401 -> 403으로 변경
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    @PostMapping("/comment/delete")
    public ResponseEntity<?> deleteSingleComment(@RequestBody CommunityCommentVO commentVO, HttpSession session) {
        log.debug("=====CommunityController::deleteSingleComment=====");

        UserVO loginUser = (UserVO) session.getAttribute("loginUser");

        if(loginUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        commentVO.setUserId(loginUser.getUserId());

        // 현재 로그인한 사용자가 작성한 게시글의 작성자일 경우; 삭제 가능
        // 261125 jskang; 얘도 추후 확인
//        if (communityService.findOwnPost(postVO) > 0) {
//            communityService.deleteSinglePost(postVO.getPostId());
//
//            return ResponseEntity.ok().build();
//        }

        // 현재 로그인한 사용자가 작성한 게시글의 작성자가 아닐 경우; 삭제 불가
        // 401 -> 403으로 변경
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }
}
