import { useMemo, useState } from 'react';
import Button from '../../common/components/Button';
import './PostDetailPage.css';
import { SessionExpiredError } from '../../common/api/apiFetch';

// depth 10까지
var maxDepth = 10;

type PostDetailProps = {
    post: {
        category: string;
        categoryName: string;
        title: string;
        content: string;
        userName: string;
        userRole: string;
        createDt?: string | null;
        viewCount: number;
    };
    comments: {
        commentId: string | number;
        parentId?: string | number | null;
        depth?: string | number | null;
        userName: string;
        userRole: string;
        createDt?: string | null;
        content: string;
    }[];
    getRoleName: (role: string) => string;
    onClose: () => void;
    onSubmitComment: (content: string) => Promise<void>;
    onSubmitReply: (
        content: string,
        parentId: string
    ) => Promise<void>;
    canDeletePost: boolean;
    onDeletePost: () => Promise<void>;
};

function PostDetail({
    post,
    comments,
    getRoleName,
    onClose,
    onSubmitComment,
    onSubmitReply,
    canDeletePost,
    onDeletePost
}: PostDetailProps) {
    const [commentContent, setCommentContent] = useState('');
    const [commentError, setCommentError] = useState('');

    // 댓글&대댓글 중복 요청 방지
    const [submitting, setSubmitting] = useState(false);

    // 대댓글
    const [replyTargetId, setReplyTargetId] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState('');
    const [replyError, setReplyError] = useState('');

    // 게시글 삭제 관련
    const [deletingPost, setDeletingPost] = useState(false);
    const [deletePostError, setDeletePostError] = useState('');

    // 부모 댓글 바로 아래에 대댓글들 배치; 들여쓰기
    // 들여쓰기 깊이는 depth로 따짐
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

        return result;
    }, [comments]);

    async function handleSubmitComment() {
        if (submitting || deletingPost) return;

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
        if (submitting || deletingPost) return;

        setReplyTargetId((prev) =>
            prev === commentId ? null : commentId
        );

        setReplyContent('');
        setReplyError('');
    }

    function handleCloseReply() {
        if (submitting || deletingPost) return;

        setReplyTargetId(null);
        setReplyContent('');
        setReplyError('');
    }

    async function handleDeletePost() {
        if (!canDeletePost || submitting || deletingPost) return;
        if (!window.confirm('이 게시글을 삭제할까요?')) return;

        setDeletingPost(true);
        setDeletePostError('');

        try {
            await onDeletePost();
        } catch (error) {
            if (error instanceof SessionExpiredError) return;

            setDeletePostError(
                error instanceof Error
                    ? error.message
                    : '게시글 삭제에 실패했습니다.'
            );
        } finally {
            setDeletingPost(false);
        }
    }

    async function handleSubmitReply() {
        if (submitting || deletingPost) return;

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
                    <div className="community-post-meta-row">
                        <div className="community-meta">
                            <strong>{post.userName}</strong>
                            <span>{getRoleName(post.userRole)}</span>
                            <span>{post.createDt?.replace('T', ' ')}</span>
                            <span>조회 {post.viewCount}</span>
                        </div>

                        {canDeletePost && (
                            <button
                                type="button"
                                className="community-post-delete"
                                onClick={() => void handleDeletePost()}
                                disabled={submitting || deletingPost}
                            >
                                {deletingPost ? '삭제 중...' : '삭제'}
                            </button>
                        )}
                    </div>
                    {deletePostError && (
                        <p className="community-comment-error" role="alert">
                            {deletePostError}
                        </p>
                    )}
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
                        disabled={submitting || deletingPost}
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
                                submitting || deletingPost || !commentContent.trim()
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

                        const visibleDepth = Math.min(
                            comment.depth,
                            maxDepth
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
                                    disabled={submitting || deletingPost}
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
                                            disabled={submitting || deletingPost}
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
                                                disabled={submitting || deletingPost}
                                            >
                                                취소
                                            </button>

                                            <button
                                                type="submit"
                                                className="community-reply-submit"
                                                disabled={
                                                    submitting ||
                                                    deletingPost ||
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
