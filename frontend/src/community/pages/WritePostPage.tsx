import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Button from "../../common/components/Button";
import "./WritePostPage.css";
import { checkSession } from "../../common/api/commonApi";

type Category = {
  categoryCode: string;
  categoryName: string;
};



type WritePostPageProps = {
  categories: Category[];
  onClose: () => void;
};

function WritePostPage({ categories, onClose }: WritePostPageProps) {
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    // useEffect 콜백은 아무것도 return 불가.
    // async는 항상 Promise 객체 반환.
    // 그런고로 안에서 함수 만들어서 해당 함수를 바로 리턴.
    const checkUserInfo = async () => {
      const response = await checkSession()

      if (!response.ok) {
        // 세션 없음
        alert("세션 만료. 다시 로그인해주세요.")
        return
      }

      const data = await response.json();
      // 그냥 userVO 자체를 리턴
      setUserRole(data.userRole)
    } 

    checkUserInfo();
  }, [])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!category || !title.trim() || !content.trim()) {
      alert("카테고리, 제목, 내용을 모두 입력해주세요.");
      return;
    }

    // TODO: 등록 API 연결
    // 전송할 값: category, title.trim(), content.trim()
    alert("등록 기능은 아직 연결하지 않았습니다.");
  }

  return (
    <section className="community-write" aria-label="게시글 작성">
      <Button className="write-back" onClick={onClose}>
        목록으로
      </Button>

      <header className="write-header">
        <h2>글쓰기</h2>
        <p>함께 나누고 싶은 이야기를 작성해주세요.</p>
      </header>

      <form className="write-form" onSubmit={handleSubmit}>
        <div className="write-field">
          <label htmlFor="post-category">카테고리</label>
          <select
            id="post-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            required
          >
            <option value="" disabled>
              카테고리를 선택해주세요
            </option>
            {categories.map((item) => (
              (item.categoryCode !== "NOTICE" || userRole === "ADMIN") && (
                <option key={item.categoryCode} value={item.categoryCode}>
                  {item.categoryName}
                </option>
              )
            ))}
          </select>
        </div>

        <div className="write-field">
          <label htmlFor="post-title">제목</label>
          <input
            id="post-title"
            type="text"
            placeholder="제목을 입력해주세요"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </div>

        <div className="write-field">
          <label htmlFor="post-content">내용</label>
          <textarea
            id="post-content"
            placeholder="내용을 입력해주세요"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            required
          />
        </div>

        <div className="write-actions">
          <Button className="write-cancel" onClick={onClose}>
            취소
          </Button>

          <Button type="submit">등록</Button>
        </div>
      </form>
    </section>
  );
}

export default WritePostPage;