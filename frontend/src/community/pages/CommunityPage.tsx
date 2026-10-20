import { useMemo, useState } from "react";
import "./CommunityPage.css";

type Category = "FREE" | "RECRUIT" | "REVIEW" | "QUESTION";
type Role = "USER" | "ADMIN" | "PHOTO";

type Post = {
  postId: number;
  category: Category;
  title: string;
  content: string;
  userName: string;
  userRole: Role;
  viewCount: number;
  isNotice: boolean;
  createDt: string;
};

type Comment = {
  commentId: number;
  postId: number;
  userName: string;
  userRole: Role;
  content: string;
  createDt: string;
};

const categoryNames: Record<Category, string> = {
  FREE: "자유게시판",
  RECRUIT: "촬영 모집",
  REVIEW: "촬영 후기",
  QUESTION: "질문",
};

const roleNames: Record<Role, string> = {
  USER: "코스어",
  ADMIN: "관리자",
  PHOTO: "사진사",
};

// 화면 확인용 데이터. 이후 API 응답으로 교체
const samplePosts: Post[] = [
  {
    postId: 1,
    category: "FREE",
    title: "자리온 촬영 예약 이용 안내",
    content:
      "사진사가 촬영 부스를 선점하고, 코스어가 해당 부스의 촬영 시간을 예약합니다.\n\n예약 전에 촬영 콘셉트와 제공 사진 수, 보정 범위를 확인해 주세요.",
    userName: "관리자",
    userRole: "ADMIN",
    viewCount: 128,
    isNotice: true,
    createDt: "2026-10-20",
  },
  {
    postId: 2,
    category: "FREE",
    title: "커뮤니티 이용 안내",
    content:
      "촬영 모집, 준비 질문, 이용 후기를 자유롭게 나눠 주세요.\n\n다른 사람의 사진을 게시할 때는 당사자의 동의를 받아 주세요.",
    userName: "관리자",
    userRole: "ADMIN",
    viewCount: 96,
    isNotice: true,
    createDt: "2026-10-20",
  },
  {
    postId: 3,
    category: "RECRUIT",
    title: "판타지 콘셉트 코스어분을 모집합니다",
    content:
      "판타지 분위기의 촬영을 함께할 코스어분을 모집합니다.\n\n어두운 배경과 컬러 조명을 활용할 예정입니다. 망토나 무기 소품이 있는 의상도 좋아요.\n\n※ 화면 확인용 예시 모집 글입니다.",
    userName: "테스트 사진사",
    userRole: "PHOTO",
    viewCount: 42,
    isNotice: false,
    createDt: "2026-10-20",
  },
  {
    postId: 4,
    category: "FREE",
    title: "처음 촬영하시는 코스어분들을 위한 준비 팁",
    content:
      "원하는 포즈나 분위기의 참고 사진을 준비해 주세요.\n\n가발 정리용 빗, 의상 고정용 핀, 수정 화장 도구도 챙기시면 좋습니다.",
    userName: "테스트 사진사",
    userRole: "PHOTO",
    viewCount: 35,
    isNotice: false,
    createDt: "2026-10-20",
  },
  {
    postId: 5,
    category: "QUESTION",
    title: "코스프레 촬영이 처음인데 포즈도 알려주시나요?",
    content:
      "처음으로 부스 촬영을 예약해 보려고 합니다.\n\n포즈가 가장 걱정되는데, 촬영할 때 포즈나 시선도 안내해 주시는지 궁금합니다.",
    userName: "테스트 사용자",
    userRole: "USER",
    viewCount: 18,
    isNotice: false,
    createDt: "2026-10-20",
  },
  {
    postId: 6,
    category: "QUESTION",
    title: "큰 무기 소품이 있는데 부스에 가져가도 될까요?",
    content:
      "캐릭터 소품이 약 150cm 정도 됩니다.\n\n예약 전에 사진사님께 크기를 알려드리고 확인하면 될까요?",
    userName: "테스트 사용자",
    userRole: "USER",
    viewCount: 12,
    isNotice: false,
    createDt: "2026-10-20",
  },
  {
    postId: 7,
    category: "REVIEW",
    title: "첫 코스프레 촬영 후기",
    content:
      "포즈와 시선을 하나씩 안내해 주셔서 편하게 촬영했습니다.\n\n의상에 맞춰 조명 색상을 조절해 주신 점이 특히 좋았습니다.\n\n※ 실제 이용 경험이 아닌 화면 확인용 예시 후기입니다.",
    userName: "테스트 사용자",
    userRole: "USER",
    viewCount: 27,
    isNotice: false,
    createDt: "2026-10-20",
  },
];

const sampleComments: Comment[] = [
  {
    commentId: 1,
    postId: 3,
    userName: "테스트 사용자",
    userRole: "USER",
    content: "마법사 캐릭터인데 지팡이 소품을 가져가도 될까요?",
    createDt: "2026-10-20",
  },
  {
    commentId: 2,
    postId: 3,
    userName: "테스트 사진사",
    userRole: "PHOTO",
    content: "네! 소품 크기를 미리 알려주시면 촬영 준비에 도움이 됩니다.",
    createDt: "2026-10-20",
  },
  {
    commentId: 3,
    postId: 5,
    userName: "테스트 사진사",
    userRole: "PHOTO",
    content: "네, 포즈와 시선을 안내해 드려요. 참고 사진도 준비해 오시면 좋아요.",
    createDt: "2026-10-20",
  },
];

const PAGE_SIZE = 5;

function CommunityPage() {
  const [category, setCategory] = useState<Category | "ALL">("ALL");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const filteredPosts = useMemo(() => {
    const search = keyword.trim().toLowerCase();

    return samplePosts
      .filter((post) => {
        const matchesCategory =
          category === "ALL" || post.category === category;

        const matchesSearch =
          `${post.title} ${post.content} ${post.userName}`
            .toLowerCase()
            .includes(search);

        return matchesCategory && matchesSearch;
      })
      .sort(
        (a, b) =>
          Number(b.isNotice) - Number(a.isNotice) ||
          b.createDt.localeCompare(a.createDt) ||
          b.postId - a.postId
      );
  }, [category, keyword]);

  const pageCount = Math.ceil(filteredPosts.length / PAGE_SIZE);
  const visiblePosts = filteredPosts.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const selectedComments = sampleComments.filter(
    (comment) => comment.postId === selectedPost?.postId
  );

  function changeCategory(value: Category | "ALL") {
    setCategory(value);
    setPage(1);
    setSelectedPost(null);
  }

  return (
    <main className="community">
      <header className="community-hero">
        <span className="community-eyebrow">JARION COMMUNITY</span>
        <h1>촬영의 설렘을 함께 나눠요</h1>
        <p>함께할 사람을 찾고, 촬영 경험과 이야기를 나누는 공간</p>
      </header>

      <nav className="community-tabs" aria-label="게시글 카테고리">
        <button
          type="button"
          className={category === "ALL" ? "is-active" : ""}
          aria-pressed={category === "ALL"}
          onClick={() => changeCategory("ALL")}
        >
          전체
        </button>

        {(Object.keys(categoryNames) as Category[]).map((value) => (
          <button
            key={value}
            type="button"
            className={category === value ? "is-active" : ""}
            aria-pressed={category === value}
            onClick={() => changeCategory(value)}
          >
            {categoryNames[value]}
          </button>
        ))}
      </nav>

      {selectedPost ? (
        <section className="community-detail" aria-label="게시글 상세">
          <button
            type="button"
            className="community-back"
            onClick={() => setSelectedPost(null)}
          >
            ← 목록으로
          </button>

          <article>
            <header className="community-detail-header">
              <span className={`community-badge ${selectedPost.category}`}>
                {selectedPost.isNotice
                  ? "공지"
                  : categoryNames[selectedPost.category]}
              </span>

              <h2>{selectedPost.title}</h2>

              <div className="community-meta">
                <strong>{selectedPost.userName}</strong>
                <span>{roleNames[selectedPost.userRole]}</span>
                <span>{selectedPost.createDt}</span>
                <span>조회 {selectedPost.viewCount}</span>
              </div>
            </header>

            <div className="community-content">{selectedPost.content}</div>
          </article>

          <section className="community-comments" aria-label="댓글">
            <h3>
              댓글 <span>{selectedComments.length}</span>
            </h3>

            {selectedComments.length === 0 ? (
              <p className="community-comment-empty">
                아직 등록된 댓글이 없습니다.
              </p>
            ) : (
              selectedComments.map((comment) => (
                <article className="community-comment" key={comment.commentId}>
                  <div className="community-meta">
                    <strong>{comment.userName}</strong>
                    <span>{roleNames[comment.userRole]}</span>
                    <span>{comment.createDt}</span>
                  </div>
                  <p>{comment.content}</p>
                </article>
              ))
            )}
          </section>
        </section>
      ) : (
        <section className="community-board" aria-label="게시글 목록">
          <div className="community-toolbar">
            <p>
              총 <strong>{filteredPosts.length}</strong>개의 이야기
            </p>

            <input
              className="community-search"
              type="search"
              aria-label="제목, 내용, 작성자 검색"
              placeholder="제목, 내용, 작성자 검색"
              value={keyword}
              onChange={(event) => {
                setKeyword(event.target.value);
                setPage(1);
              }}
            />
          </div>

          <div className="community-table-wrap">
            <table className="community-table">
              <thead>
                <tr>
                  <th scope="col">분류</th>
                  <th scope="col">제목</th>
                  <th scope="col">작성자</th>
                  <th scope="col">작성일</th>
                  <th scope="col">조회</th>
                </tr>
              </thead>

              <tbody>
                {visiblePosts.map((post) => {
                  const commentCount = sampleComments.filter(
                    (comment) => comment.postId === post.postId
                  ).length;

                  return (
                    <tr
                      key={post.postId}
                      className={post.isNotice ? "community-notice" : ""}
                    >
                      <td>
                        <span className={`community-badge ${post.category}`}>
                          {post.isNotice ? "공지" : categoryNames[post.category]}
                        </span>
                      </td>

                      <td className="community-title-cell">
                        <button
                          type="button"
                          className="community-post-link"
                          onClick={() => setSelectedPost(post)}
                        >
                          {post.title}
                          {commentCount > 0 && (
                            <span className="community-comment-count">
                              [{commentCount}]
                            </span>
                          )}
                        </button>
                      </td>

                      <td>
                        <div className="community-author">
                          <span>{post.userName}</span>
                          <small>{roleNames[post.userRole]}</small>
                        </div>
                      </td>

                      <td className="community-date">{post.createDt}</td>
                      <td>{post.viewCount}</td>
                    </tr>
                  );
                })}

                {visiblePosts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="community-empty">
                      검색 조건에 맞는 게시글이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {pageCount > 1 && (
            <nav className="community-pagination" aria-label="게시글 페이지">
              {Array.from({ length: pageCount }, (_, index) => index + 1).map(
                (number) => (
                  <button
                    key={number}
                    type="button"
                    className={page === number ? "is-active" : ""}
                    aria-current={page === number ? "page" : undefined}
                    aria-label={`${number}페이지`}
                    onClick={() => setPage(number)}
                  >
                    {number}
                  </button>
                )
              )}
            </nav>
          )}
        </section>
      )}
    </main>
  );
}

export default CommunityPage;