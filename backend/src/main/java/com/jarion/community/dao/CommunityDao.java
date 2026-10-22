package com.jarion.community.dao;

import com.jarion.community.vo.CommunityCategoryVO;
import com.jarion.community.vo.CommunityPostVO;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CommunityDao {
    private final SqlSessionTemplate sqlSession;

    public CommunityDao(SqlSessionTemplate sqlSession) {
        this.sqlSession = sqlSession;
    }

    public List<CommunityPostVO> selectAllCommunityPosts() {
        return sqlSession.selectList("selectAllCommunityPosts");
    }

    public List<CommunityCategoryVO> selectAllCommunityCategories() {
        return sqlSession.selectList("selectAllCommunityCategories");
    }

    public void updatePostViewCount(String postId) {
        sqlSession.update("updatePostViewCount", postId);
    }
}
