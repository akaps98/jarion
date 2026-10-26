package com.jarion.community.vo;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class CommunityCommentVO {
    private String commentId;
    private String postId;
    private String userId;
    // 댓글 쓴 사람
    private String userName;
    // 댓글 쓴 사람 역할
    private String userRole;
    private String content;
    private String deleteYn;
    private LocalDateTime createDt;
    private LocalDateTime updateDt;
    private LocalDateTime deleteDt;
}
