package com.jarion.community.vo;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class CommunityPostVO {
    private Long postId;
    private String userId;
    private String category;
    // 카테고리 이름
    private String categoryName;
    private String title;
    private String content;
    private String viewCount;
    private LocalDateTime createDt;
    private LocalDateTime updateDt;

    // 댓글 갯수
    private int commentCnt;
    // 해당 글 쓴 사람 role
    private String userRole;
}
