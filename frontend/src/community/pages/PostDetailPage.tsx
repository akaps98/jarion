import Button from '../../common/components/Button';
import './PostDetailPage.css';

/**
 * 게시글 클릭시 보여주는 게시글 상세 페이지
 */

// 파라미터 타입 강제
type PostDetailProps = {
    post: any;
    comments: any[];
    getRoleName: (role: string) => string;
    onClose: () => void;
};

function PostDetail({post, comments, getRoleName, onClose}: PostDetailProps) {
    return (
        <section className="community-detail" aria-label="게시글 상세">
            {/* <button
                type="button"
                className="community-back"
                onClick={onClose}
            >
                목록으로
            </button> */}
            <Button
                className='community-back'
                onClick={onClose}
            >
                목록으로
            </Button>

            <article>
                <header className="community-detail-header">
                <span className={`community-badge ${post.category}`}>
                    {post.categoryName}
                </span>

                <h2>{post.title}</h2>

                <div className="community-meta">
                    <strong>{post.userName}</strong>
                    <span>{getRoleName(post.userRole)}</span>
                    <span>{post.createDt?.replace("T", " ")}</span>
                    <span>조회 {post.viewCount}</span>
                </div>
                </header>

                <div className="community-content">{post.content}</div>
            </article>

            <section className="community-comments" aria-label="댓글">
                <h3>
                댓글 <span>{post.commentCnt}</span>
                </h3>

                {post.commentCnt === 0 ? (
                <p className="community-comment-empty">
                    아직 등록된 댓글이 없습니다.
                </p>
                ) : (
                comments.map((comment) => (
                    <article
                    className="community-comment"
                    key={comment.commentId}
                    >
                    <div className="community-meta">
                        <strong>{comment.userName}</strong>
                        <span>{comment.userRole}</span>
                        <span>{comment.createDt?.replace("T", " ")}</span>
                    </div>
                    <p>{comment.content}</p>
                    </article>
                ))
                )}
            </section>
        </section>
    )
}

export default PostDetail;