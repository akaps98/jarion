import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../api/commonApi';
import './Header.css';

function Header() {
    const navigate = useNavigate();

    const [userName, setUserName] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [sessionLoading, setSessionLoading] = useState(true);
    const [loggingOut, setLoggingOut] = useState(false);

    useEffect(() => {
		// Header가 사라질 시(ex. 로그인 화면 이동), 비동기 작업 취소 시 사용
		// 지금같은 경우에는 로그인 화면 이동 시, 세션 조회가 만약 진행중이라면 그 요청 끊고 넘어가기 위해 사용
		// 꼭 필수까진 아니나, UX 효율 향상을 위해 사용
        const controller = new AbortController();

        const checkUserInfo = async () => {
            try {
                // 비로그인 방문도 허용하므로
                // 401에서 자동 이동하는 apiFetch 대신 fetch 사용
                const response = await fetch('/api/auth/session', {
                    signal: controller.signal
                });

                if (!response.ok) {
                    setIsLoggedIn(false);
                    setUserName('');
                    return;
                }

                const data = await response.json();

                if (controller.signal.aborted) return;

                setUserName(data.userName ?? '');
                setIsLoggedIn(true);
            } catch (error) {
                if (controller.signal.aborted) return;

                console.error('세션 확인 실패:', error);
                setIsLoggedIn(false);
                setUserName('');
            } finally {
                if (!controller.signal.aborted) {
                    setSessionLoading(false);
                }
            }
        };

        void checkUserInfo();

		// 헤더 사라질 시(unmount) 실행
        return () => controller.abort();
    }, []);

    const handleLogout = async () => {
        if (loggingOut) return;

        try {
            setLoggingOut(true);

            const response = await logout();

            if (!response.ok) {
                alert('로그아웃에 실패했습니다.');
                return;
            }

            alert('로그아웃 되었습니다!');

            // 메인으로 이동하면서 사용자 state 초기화
            window.location.replace('/');
        } catch (error) {
            console.error('로그아웃 실패:', error);
            alert('로그아웃 중 오류가 발생했습니다.');
        } finally {
            setLoggingOut(false);
        }
    };

    return (
        <header className="header">
            <div className="header-inner">
                <button
                    type="button"
                    className="header-logo"
                    onClick={() => navigate('/')}
                >
					<img
						src="/jarion-logo.png"
						alt="자리온"
						className="header-logo-image"
					/>
                </button>

                <nav className="header-nav" aria-label="메인 메뉴">
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                    >
                        커뮤니티
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate('/reservation')}
                    >
                        예약
                    </button>
                </nav>

				{!sessionLoading && (
					<div className="header-user">
						{isLoggedIn ? (
							<>
								<button
									type="button"
									className="header-user-button"
									onClick={() => navigate('/mypage')}
								>
									{userName}님
								</button>

								<button
									type="button"
									className="header-logout-button"
									onClick={handleLogout}
									disabled={loggingOut}
								>
									{loggingOut ? '로그아웃 중...' : '로그아웃'}
								</button>
							</>
						) : (
							<button
								type="button"
								onClick={() => navigate('/login')}
							>
								로그인
							</button>
						)}
					</div>
				)}
            </div>
        </header>
    );
}

export default Header;