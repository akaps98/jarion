package com.jarion.community.service;

import com.jarion.community.dao.CommunityDao;
import com.jarion.community.vo.CommunityCategoryVO;
import com.jarion.community.vo.CommunityCommentVO;
import com.jarion.community.vo.CommunityPostVO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CommunityService {
    private final CommunityDao communityDao;

    public CommunityService(CommunityDao communityDao) {
        this.communityDao = communityDao;
    }

    public List<CommunityPostVO> selectAllCommunityPosts() {
        return communityDao.selectAllCommunityPosts();
    }

    public List<CommunityCategoryVO> selectAllCommunityCategories() {
        return communityDao.selectAllCommunityCategories();
    }

    @Transactional(propagation = Propagation.REQUIRED)
    public void updatePostViewCount(String postId) {
        communityDao.updatePostViewCount(postId);
    }

    public List<CommunityCommentVO> selectCommentsOnPost(String postId) {
        return communityDao.selectCommentsOnPost(postId);
    }

    @Transactional(propagation = Propagation.REQUIRED)
    public void insertSinglePost(CommunityPostVO post) {
        communityDao.insertSinglePost(post);
    }

    @Transactional(propagation = Propagation.REQUIRED)
    public void insertSingleComment(CommunityCommentVO comment) {
        communityDao.insertSingleComment(comment);
    }

    @Transactional(propagation = Propagation.REQUIRED)
    public void insertChildComment(CommunityCommentVO comment) {
        communityDao.insertChildComment(comment);
    }

    // 로그인한 사용자의 게시글이 맞는지 체크
    // 게시글 삭제 시 사용
    public int findOwnPost(CommunityPostVO post) {
        return communityDao.findOwnPost(post);
    }

    @Transactional(propagation = Propagation.REQUIRED)
    public void deleteSinglePost(String postId) {
        communityDao.deleteSinglePost(postId);
    }
}
