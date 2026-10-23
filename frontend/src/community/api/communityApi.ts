/**
 * 모든 게시글 가져옴
 * @returns List<CommunityPostVO>
 */
export const allPosts = async () => {
    const response = await fetch('/api/community/post/all')

    if(!response.ok) {
        throw new Error("게시글을 불러오지 못했습니다.");
    }

    return response.json();
}

/**
 * 모든 카테고리 가져옴
 * @returns List<CommunityCategoryVO>
 */
export const allCategories = async () => {
    const response = await fetch('/api/community/category/all')

    if(!response.ok) {
        throw new Error("카테고리를 불러오지 못했습니다.");
    }

    return response.json();
}

/**
 * 게시글 읽을 시, 조회수 올림
 */
export const updatePostViewCount = async (postId: string) => {
    const response = await fetch('/api/community/post/viewcount', {
        method: "POST",
        body: postId
    });

    if(!response.ok) {
        throw new Error("오류가 발생했습니다.")
    }
}

/**
 * 한 게시글의 댓글 목록을 불러옴
 * @param postId 
 * @returns List<CommunityCommentVO>
 */
export const commentsForPost = async (postId: string) => {
    const response = await fetch(`/api/community/post/comment?postId=${encodeURIComponent(postId)}`)

    if(!response.ok) {
        throw new Error("댓글을 불러오지 못했습니다.");
    }

    return response.json();
}

export const writePost = async (
    category: string,
    title: string,
    content: string
) => {
    const response = await fetch('/api/community/post', {
        method: "POST",
        body: JSON.stringify({
            category: category,
            title: title,
            content: content
        })
    })

    if(!response.ok) {
        throw new Error("게시글 작성에 실패했습니다.");
    }
}