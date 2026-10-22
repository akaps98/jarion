package com.jarion.community.service;

import com.jarion.community.dao.CommunityDao;
import com.jarion.community.vo.CommunityCategoryVO;
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
}
