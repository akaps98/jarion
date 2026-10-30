import { useNavigate } from 'react-router-dom'
import './Header.css'
import { useEffect, useState } from 'react'
import { logout, checkSession } from '../api/commonApi'

type UserVO = {
	userId: string
	userName: string
	userRole: string
	loginId?: string
	status?: string
}

function Header() {
	const [user, setUser] = useState<UserVO | null>(null)

	const navigate = useNavigate()

    useEffect(() => {
        // useEffect 콜백은 아무것도 return 불가.
        // async는 항상 Promise 객체 반환.
        // 그런고로 안에서 함수 만들어서 해당 함수를 바로 리턴.
        const checkUserInfo = async () => {
            const response = await checkSession()

            if (!response.ok) {
                // 세션 없음
                alert("로그인이 필요합니다.")
                return
            }

            const data = await response.json();

			// 그냥 userVO 자체를 리턴
			setUser(data)
        } 

        checkUserInfo();
    }, [])

	const handleLogout = async () => {
		try {
			const response = await logout();

			if (!response.ok) {
				alert('로그아웃에 실패했습니다.')
				return
			} else {
                alert('로그아웃 되었습니다!')
            }

			navigate('/')
		} catch (error) {
			console.error('로그아웃 실패:', error)
		}
	}

	return (
		<header className="header">
			<div
				className="header-logo"
				onClick={() => navigate('/community')}
			>
				JARION
			</div>

			<nav className="header-menu">
				<button onClick={() => navigate('/reservation')}>
					예약
				</button>

				<button onClick={() => navigate('/community')}>
					커뮤니티
				</button>

                {user?.userRole === 'ADMIN' && (
                    <button onClick={() => navigate('/admin')}>
                        관리자
                    </button>
                )}
			</nav>

			<div className="header-user">
				<button className="header-user-button" onClick={() => navigate('/mypage')}>
					{user?.userName}
				</button>
			</div>

			<div className="header-logout">
				<button onClick={handleLogout}>
					로그아웃
				</button>
			</div>
		</header>
	)
}

export default Header