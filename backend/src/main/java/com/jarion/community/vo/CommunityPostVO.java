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
    private String title;
    private String content;
    private String viewCount;
    private boolean isNotice;
    LocalDateTime createDt;
    LocalDateTime updateDt;

    // 댓글 갯수
    private int commentCnt;
}
