import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../common/pages/LoginPage";
import ReservationPage from "../reservation/pages/ReservationPage";
import CommunityPage from "../community/pages/CommunityPage";
import CheckSessionRoute from "../common/components/CheckSessionRoute";
import MainLayout from "../common/layouts/MainLayout";
import MyPage from "../community/pages/MyPage";

const router = createBrowserRouter([
	{
		path: '/',
		element: <LoginPage />,
	},
	{
        // Session 있을때만 해당 페이지 접속 가능하도록 변경
		element: <CheckSessionRoute />,
		children: [
			{
                // MainLayout의 outlet(children)들 생성
				element: <MainLayout />,
				children: [
					{
						path: '/community',
						element: <CommunityPage />,
					},
					{
						path: '/reservation',
						element: <ReservationPage />,
					},
					{
						path: '/mypage',
						element: <MyPage />	
					}
				],
			},
		],
	},
])

export default router;