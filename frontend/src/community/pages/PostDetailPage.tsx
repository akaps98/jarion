import { useState } from 'react';
import Button from '../../common/components/Button';
import './PostDetailPage.css';
import { SessionExpiredError } from '../../common/api/apiFetch';

type PostDetailProps = {
    post: any;
    comments: any[];
    getRoleName: (role: string) => string;
    onClose: () => void;
    onSubmitComment: (content: string) => Promise<void>;
};

function PostDetail({
    post,
    comments,
    getRoleName,
    onClose,
    onSubmitComment
}: PostDetailProps) {
    const [commentContent, setCommentContent] = useState('');
    // 댓글 중복 등록 방지용 state
    const [submitting, setSubmitting] = useState(false);
    const [commentError, setCommentError] = useState('');

    async function handleSubmitComment() {
        const content = commentContent.trim();

        if (!content) {
            setCommentError('댓글 내용을 입력해주세요.');
            return;
        }

        // 댓글 중복 등록 방지
        // 댓글 등록 중, 시간이 걸릴 경우 유저가 버튼을 한번 더 눌러 두번 이상 등록되는 것을 방지한다.
        if (submitting) return;

        try {
            setSubmitting(true);
            setCommentError('');

            await onSubmitComment(content);

            setCommentContent('');
        } catch (error) {
            if(error instanceof SessionExpiredError) {
                return;
            }

            setCommentError(
                error instanceof Error
                    ? error.message
                    : '댓글 등록에 실패했습니다.'
            );
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <section className="community-detail" aria-label="게시글 상세">
            <Button className="community-back" onClick={onClose}>
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
                        <span>{post.createDt?.replace('T', ' ')}</span>
                        <span>조회 {post.viewCount}</span>
                    </div>
                </header>

                <div className="community-content">{post.content}</div>
            </article>

            <section className="community-comments" aria-label="댓글">
                <h3>
                    댓글 <span>{comments.length}</span>
                </h3>

                <form
                    className="community-comment-form"
                    onSubmit={(event) => {
                        event.preventDefault();
                        void handleSubmitComment();
                    }}
                >
                    <label htmlFor="comment-content">댓글 작성</label>

                    <textarea
                        id="comment-content"
                        value={commentContent}
                        onChange={(event) => {
                            setCommentContent(event.target.value);
                            setCommentError('');
                        }}
                        placeholder="댓글을 입력해주세요."
                        rows={4}
                        disabled={submitting}
                    />

                    {commentError && (
                        <p className="community-comment-error" role="alert">
                            {commentError}
                        </p>
                    )}

                    <div className="community-comment-actions">
                        <button
                            type="submit"
                            className="community-comment-submit"
                            disabled={submitting || !commentContent.trim()}
                        >
                            {submitting ? '등록 중...' : '댓글 등록'}
                        </button>
                    </div>
                </form>

                {comments.length === 0 ? (
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
                                <span>{getRoleName(comment.userRole)}</span>
                                <span>
                                    {comment.createDt?.replace('T', ' ')}
                                </span>
                            </div>
                            <p>{comment.content}</p>
                        </article>
                    ))
                )}
            </section>
        </section>
    );
}

export default PostDetail;