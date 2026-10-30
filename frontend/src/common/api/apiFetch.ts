/**
 * 세션 만료 시에는 로그인 페이지로 보내야한다
 * api fetch시 항상 체크!!! (단, fetch시 세션이 필요 없는 api의 경우 - ex) 로그인, rsa키 생성 - 일반 fetch 사용)
 */

export class SessionExpiredError extends Error {
  constructor() {
    super("로그인이 필요합니다.");
    this.name = "SessionExpiredError";
  }
}

let isRedirecting = false;

/**
 * @param url: api URL
 * @param options: CRUD 방식
 * @returns 
 */
export async function apiFetch(
  url: string,
  options?: RequestInit
): Promise<Response> {
  const response = await fetch(url, options);

  if (response.status === 401) {
    if (!isRedirecting) {
      isRedirecting = true;

      // alert 띄우고 로그인 페이지로 redirect
      alert("로그인이 필요합니다.")
      window.location.replace("/");
    }

    throw new SessionExpiredError();
  } 

  return response;
}