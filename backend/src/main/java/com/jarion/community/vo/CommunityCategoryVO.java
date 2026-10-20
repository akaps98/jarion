package com.jarion.community.vo;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class CommunityCategoryVO {
    private String categoryCode;
    private String categoryName;
    private String description;
    private int sortOrder;
    private String useYn;
    private LocalDateTime createDt;
    private LocalDateTime updateDt;
}
