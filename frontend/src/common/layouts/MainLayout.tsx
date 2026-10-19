/**
 * 로그인 페이지 제외한 Main Layout
 * 헤더 포함
 */

import { Outlet } from 'react-router-dom'
import Header from '../components/Header'

function MainLayout() {
    // Header는 만들어둔것 가져와서 사용
    // Outlet은 현재 예약/커뮤니티 사이트 두개
	return (
		<>
			<Header />
			<main>
				<Outlet />
			</main>
		</>
	)
}

export default MainLayout