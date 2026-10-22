import { useNavigate } from 'react-router-dom'
import './Header.css'
import { useEffect, useState } from 'react'
import { logout, checkSession } from '../api/commonApi'

function Header() {
    const [userRole, setUserRole] = useState<string>('')

	const navigate = useNavigate()

    useEffect(() => {
        // useEffect 콜백은 아무것도 return 불가.
        // async는 항상 Promise 객체 반환.
        // 그런고로 안에서 함수 만들어서 해당 함수를 바로 리턴.
        const checkRole = async () => {
            const response = await checkSession()

            if (!response.ok) {
                // 세션 없음
                alert("세션 만료. 다시 로그인해주세요.")
                return
            }

            const data = await response.json();

            setUserRole(data.userRole);
        } 

        checkRole();
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

                {userRole === 'ADMIN' && (
                    <button onClick={() => navigate('/admin')}>
                        관리자
                    </button>
                )}
			</nav>

			<div className="header-user">
				<button onClick={handleLogout}>
					로그아웃
				</button>
			</div>
		</header>
	)
}

export default Header