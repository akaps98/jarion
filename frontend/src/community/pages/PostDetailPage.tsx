import { useMemo, useState } from 'react';
import Button from '../../common/components/Button';
import './PostDetailPage.css';
import { SessionExpiredError } from '../../common/api/apiFetch';

type PostDetailProps = {
    post: any;
    comments: any[];
    getRoleName: (role: string) => string;
    onClose: () => void;
    onSubmitComment: (content: string) => Promise<void>;
    onSubmitReply: (
        content: string,
        parentId: string
    ) => Promise<void>;
};

function PostDetail({
    post,
    comments,
    getRoleName,
    onClose,
    onSubmitComment,
    onSubmitReply
}: PostDetailProps) {
    const [commentContent, setCommentContent] = useState('');
    const [commentError, setCommentError] = useState('');

    // 일반 댓글과 답글 등록 중 중복 요청 방지
    const [submitting, setSubmitting] = useState(false);

    // 답글 입력창
    const [replyTargetId, setReplyTargetId] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState('');
    const [replyError, setReplyError] = useState('');

    // 부모 댓글 바로 아래에 해당 답글들을 배치
    // 들여쓰기 깊이는 DB에서 받은 depth 사용
    const displayComments = useMemo(() => {
        const list = comments.map((comment) => ({
            ...comment,
            commentId: String(comment.commentId),
            parentId:
                comment.parentId == null
                    ? null
                    : String(comment.parentId),
            depth: Math.max(0, Number(comment.depth) || 0)
        }));

        const ids = new Set(
            list.map((comment) => comment.commentId)
        );

        const childrenMap = new Map<string, typeof list>();
        const roots: typeof list = [];

        list.forEach((comment) => {
            if (
                comment.parentId === null ||
                !ids.has(comment.parentId)
            ) {
                roots.push(comment);
                return;
            }

            const children = childrenMap.get(comment.parentId) ?? [];
            children.push(comment);
            childrenMap.set(comment.parentId, children);
        });

        const result: typeof list = [];
        const visited = new Set<string>();

        // 스택으로 부모 → 자식 순서 순회
        function appendThread(root: (typeof list)[number]) {
            const stack = [root];

            while (stack.length > 0) {
                const comment = stack.pop()!;

                if (visited.has(comment.commentId)) continue;

                visited.add(comment.commentId);
                result.push(comment);

                const children =
                    childrenMap.get(comment.commentId) ?? [];

                // 스택에서 꺼낼 때 원래 순서가 유지되도록 역순 추가
                for (let i = children.length - 1; i >= 0; i--) {
                    stack.push(children[i]);
                }
            }
        }

        roots.forEach(appendThread);

        // 비정상적인 부모 관계가 있어도 댓글 누락 방지
        list.forEach((comment) => {
            if (!visited.has(comment.commentId)) {
                appendThread(comment);
            }
        });

        return result;
    }, [comments]);

    async function handleSubmitComment() {
        if (submitting) return;

        const content = commentContent.trim();

        if (!content) {
            setCommentError('댓글 내용을 입력해주세요.');
            return;
        }

        try {
            setSubmitting(true);
            setCommentError('');

            await onSubmitComment(content);

            setCommentContent('');
        } catch (error) {
            if (error instanceof SessionExpiredError) return;

            setCommentError(
                error instanceof Error
                    ? error.message
                    : '댓글 등록에 실패했습니다.'
            );
        } finally {
            setSubmitting(false);
        }
    }

    function handleToggleReply(commentId: string) {
        if (submitting) return;

        setReplyTargetId((prev) =>
            prev === commentId ? null : commentId
        );

        setReplyContent('');
        setReplyError('');
    }

    function handleCloseReply() {
        if (submitting) return;

        setReplyTargetId(null);
        setReplyContent('');
        setReplyError('');
    }

    async function handleSubmitReply() {
        if (submitting) return;

        const content = replyContent.trim();

        if (!content) {
            setReplyError('답글 내용을 입력해주세요.');
            return;
        }

        // 이 에러는 날 일 없음... replyTargetId 사전 null 체크
        if (replyTargetId === null) {
            setReplyError('답글을 작성할 댓글을 선택해주세요.');
            return;
        }

        try {
            setSubmitting(true);
            setReplyError('');

            await onSubmitReply(content, replyTargetId);

            setReplyContent('');
            setReplyTargetId(null);
        } catch (error) {
            if (error instanceof SessionExpiredError) return;

            setReplyError(
                error instanceof Error
                    ? error.message
                    : '답글 등록에 실패했습니다.'
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

                <div className="community-content">
                    {post.content}
                </div>
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
                    <label htmlFor="comment-content">
                        댓글 작성
                    </label>

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
                        <p
                            className="community-comment-error"
                            role="alert"
                        >
                            {commentError}
                        </p>
                    )}

                    <div className="community-comment-actions">
                        <button
                            type="submit"
                            className="community-comment-submit"
                            disabled={
                                submitting || !commentContent.trim()
                            }
                        >
                            {submitting ? '등록 중...' : '댓글 등록'}
                        </button>
                    </div>
                </form>

                {displayComments.length === 0 ? (
                    <p className="community-comment-empty">
                        아직 등록된 댓글이 없습니다.
                    </p>
                ) : (
                    displayComments.map((comment) => {
                        const isReplyOpen =
                            replyTargetId === comment.commentId;

                        // depth 6 이상도 5단계와 같은 위치에 표시
                        const visibleDepth = Math.min(
                            comment.depth,
                            5
                        );

                        return (
                            <article
                                key={comment.commentId}
                                className={`community-comment ${
                                    comment.depth > 0
                                        ? 'community-comment-child'
                                        : ''
                                } ${
                                    isReplyOpen
                                        ? 'community-comment-selected'
                                        : ''
                                }`}
                                style={{
                                    marginLeft: `calc(${visibleDepth} * var(--comment-indent))`
                                }}
                            >
                                <button
                                    type="button"
                                    className="community-comment-trigger"
                                    onClick={() =>
                                        handleToggleReply(
                                            comment.commentId
                                        )
                                    }
                                    aria-expanded={isReplyOpen}
                                    aria-controls={
                                        isReplyOpen
                                            ? `reply-form-${comment.commentId}`
                                            : undefined
                                    }
                                    disabled={submitting}
                                >
                                    <span className="community-meta">
                                        <strong>
                                            {comment.userName}
                                        </strong>

                                        <span>
                                            {getRoleName(
                                                comment.userRole
                                            )}
                                        </span>

                                        <span>
                                            {comment.createDt?.replace(
                                                'T',
                                                ' '
                                            )}
                                        </span>
                                    </span>

                                    <span className="community-comment-text">
                                        {comment.content}
                                    </span>

                                    <span className="community-reply-toggle">
                                        {isReplyOpen
                                            ? '답글 닫기'
                                            : '답글 쓰기'}
                                    </span>
                                </button>

                                {isReplyOpen && (
                                    <form
                                        id={`reply-form-${comment.commentId}`}
                                        className="community-reply-form"
                                        onSubmit={(event) => {
                                            event.preventDefault();
                                            void handleSubmitReply();
                                        }}
                                    >
                                        <label
                                            htmlFor={`reply-content-${comment.commentId}`}
                                            className="community-reply-label"
                                        >
                                            <strong>
                                                {comment.userName}
                                            </strong>
                                            님에게 답글 작성
                                        </label>

                                        <textarea
                                            id={`reply-content-${comment.commentId}`}
                                            className="community-reply-textarea"
                                            value={replyContent}
                                            onChange={(event) => {
                                                setReplyContent(
                                                    event.target.value
                                                );
                                                setReplyError('');
                                            }}
                                            placeholder="답글을 입력해주세요."
                                            rows={3}
                                            disabled={submitting}
                                            autoFocus
                                        />

                                        {replyError && (
                                            <p
                                                className="community-comment-error"
                                                role="alert"
                                            >
                                                {replyError}
                                            </p>
                                        )}

                                        <div className="community-reply-actions">
                                            <button
                                                type="button"
                                                className="community-reply-cancel"
                                                onClick={handleCloseReply}
                                                disabled={submitting}
                                            >
                                                취소
                                            </button>

                                            <button
                                                type="submit"
                                                className="community-reply-submit"
                                                disabled={
                                                    submitting ||
                                                    !replyContent.trim()
                                                }
                                            >
                                                {submitting
                                                    ? '등록 중...'
                                                    : '답글 등록'}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </article>
                        );
                    })
                )}
            </section>
        </section>
    );
}

export default PostDetail;