/**
 * 커뮤니티페이지
 */

import { useEffect, useMemo, useState } from "react";
import "./CommunityPage.css";
import { allPosts, allCategories, updatePostViewCount, commentsForPost, writeComment } from "../api/communityApi";
import PostDetail from "./PostDetailPage";
import Button from "../../common/components/Button";
import WritePostPage from "./WritePostPage";
import { SessionExpiredError } from "../../common/api/apiFetch";

// 한 페이지 당 게시글 갯수
const PAGE_SIZE = 10;

function CommunityPage() {
  const [posts, setPosts] = useState<any[]>([]);
  // 전체 카테고리
  const [categories, setCategories] = useState<any[]>([]);
  // 현재 선택한 카테고리
  const [category, setCategory] = useState("ALL");
  // 현재 게시글에 달린 댓글
  const [comments, setComments] = useState<any[]>([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  // 클릭한 게시글
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  // 글쓰기 페이지
  const [goWritePost, setGoWritePost] = useState(false);

  useEffect(() => {
    const loadData = async() => {
        try {
          // 새로고침을 이유로 loading 및 error 문 계속 다시 새로
          setLoading(true);
          setError("");

          // 한 번에 조회; Promise.all 사용
          const [postData, categoryData] = await Promise.all([
              allPosts(),
              allCategories()
          ])

          setPosts(postData);
          setCategories(categoryData);
        } catch (error) {
          if (error instanceof SessionExpiredError) {
            return;
          }
          // Error 타입 명시 必
          setError(error instanceof Error ? error.message : "조회 중 오류가 발생했습니다.")
        } finally {
            setLoading(false);
        }
    }

    loadData();
  }, [])

  // 카테고리 변경 or 검색 시
  const filteredPosts = useMemo(() => {
    const search = keyword.trim().toLowerCase();

    return posts
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
          Number(b.category === "NOTICE") - Number(a.category === "NOTICE") ||
          b.createDt.localeCompare(a.createDt) ||
          b.postId - a.postId
      );
  }, [posts, category, keyword]);


  // 역할이름 영어 -> 한국어
  function getRoleName(role: string) {
      switch(role) {
          case "USER":
              return "코스어";
          case "PHOTO":
              return "사진사";
          case "ADMIN":
              return "관리자";
          default:
              return role ?? "";
      }
  }

  // 게시글 클릭 시
  async function openPost(post: any) {
    try {
      // DB 조회 수 증가
      await updatePostViewCount(post.postId);

      // 상세 화면에 표시할 조회 수도 증가
      const updatedPost = {
        ...post,
        viewCount: Number(post.viewCount ?? 0) + 1
      };

      // 목록으로 돌아가도 증가한 조회 수가 보이도록 갱신
      setPosts((prevPosts) =>
        prevPosts.map((item) =>
          item.postId === post.postId ? updatedPost : item
        )
      );

      const comments = await commentsForPost(post.postId);
      // 댓글 목록 갱신
      setComments(comments);
      // 상세 화면 열기
      setSelectedPost(updatedPost);
    } catch (error) {
      // 만약 에러가 SessionExpiredError 객체일시 그냥 return; 에러 대응은 apiFetch 메소드 안에 다 되어있음
      if (error instanceof SessionExpiredError) {
        return;
      }

      setError(
        error instanceof Error
          ? error.message
          : "게시글을 여는 중 오류가 발생했습니다."
      );
    }
  }

  // 게시글 작성 logic
  async function handleWriteSuccess() {
    setGoWritePost(false);
    setSelectedPost(null);
    setCategory("ALL");
    setKeyword("");
    setPage(1);

    try {
      setLoading(true);
      setError("");
  
      // 게시글 등록 시 게시글 재조회 必
      const postData = await allPosts();
      setPosts(postData);
    } catch (error) {
      if (error instanceof SessionExpiredError) {
        return;
      }

      setError(
        error instanceof Error
          ? error.message
          : "목록을 불러오지 못했습니다."
      );
    } finally {
      setLoading(false);
    }
  }

  // 댓글 작성 logic
  async function handleWriteComment(content: string) {
    const postId = selectedPost?.postId;

    await writeComment(postId, content);
    const commentsList = await commentsForPost(postId);

    // 댓글 작성 후 댓글 목록 재조회
    setComments(commentsList);

    // 댓글 작성 후 현재 게시글의 댓글 수 갱신
    // return 필수; 현재 게시글로
    setSelectedPost((prevPost: any) => {
      return prevPost.postId === postId
      ? {...prevPost, commentCnt: commentsList.length}
      : prevPost
    })

    // 댓글 작성 후 모든 게시글 중의 현재 게시글 댓글 수 갱신
    setPosts((prevPost) => 
      prevPost.map((item) =>
        item.postId === postId
        ? {...item, commentCnt: commentsList.length}
        : item
      )
    )
  }

  const pageCount = Math.ceil(filteredPosts.length / PAGE_SIZE);

  // 한 페이지당 보이는 게시글 수
  const visiblePosts = filteredPosts.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  // 카테고리 선택 시
  function changeCategory(value: string) {
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
      

      {loading ? (
        <div className="community-loading">
          <div className="community-spinner"></div>
          <p>커뮤니티를 불러오는 중입니다.</p>
        </div>
      ) : error ? (
        <div className="community-error">
          {error}
        </div>
      ) : (
      <>
        <nav className="community-tabs" aria-label="게시글 카테고리">
          <button
            type="button"
            className={category === "ALL" ? "is-active" : ""}
            aria-pressed={category === "ALL"}
            onClick={() => changeCategory("ALL")}
          >
            전체
          </button>

          {categories.map((item) => (
            <button
              key={item.categoryCode}
              type="button"
              className={category === item.categoryCode ? "is-active" : ""}
              aria-pressed={category === item.categoryCode}
              onClick={() => changeCategory(item.categoryCode)}
            >
              {item.categoryName}
            </button>
          ))}
        </nav>

        {goWritePost ? ( 
          <WritePostPage
            categories={categories}
            onClose={() => setGoWritePost(false)}
            onSuccess={() => handleWriteSuccess()}
          />
        ) : selectedPost ? (
          <PostDetail
            post={selectedPost}
            comments={comments}
            getRoleName={getRoleName}
            onClose={() => setSelectedPost(null)}
            onSubmitComment={handleWriteComment}
          />
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
            <div className="post-actions">
              <Button onClick={() => setGoWritePost(true)}>글쓰기</Button>
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
                    return (
                      <tr
                        key={post.postId}
                        className={post.category === "NOTICE" ? "community-notice" : ""}
                      >
                        <td>
                          <span className={`community-badge ${post.category}`}>
                            {post.categoryName}
                          </span>
                        </td>

                        <td className="community-title-cell">
                          <button
                            type="button"
                              className={`community-post-link ${
                                post.category === "NOTICE" ? "is-notice" : ""
                              }`}
                            onClick={() => openPost(post)}
                          >
                            {post.title}
                            {post.commentCnt > 0 && (
                              <span className="community-comment-count">
                                [{post.commentCnt}]
                              </span>
                            )}
                          </button>
                        </td>

                        <td>
                          <div className="community-author">
                            <span>{post.userName}</span>
                            <small>{getRoleName(post.userRole)}</small>
                          </div>
                        </td>

                        <td className="community-date">{post.createDt?.replace("T", " ")}</td>
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
        </>
      )}
    </main>
  );
}

export default CommunityPage;