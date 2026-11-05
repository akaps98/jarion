import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../common/pages/LoginPage";
import ReservationPage from "../reservation/pages/ReservationPage";
import CommunityPage from "../community/pages/CommunityPage";
import CheckSessionRoute from "../common/components/CheckSessionRoute";
import MainLayout from "../common/layouts/MainLayout";
import MyPage from "../community/pages/MyPage";

const router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        element: <MainLayout />,
        children: [
            // 메인 화면 -> 커뮤니티
            {
                path: "/",
                element: <CommunityPage />,
            },
            {
                path: "/community",
                element: <CommunityPage />,
            },
            {
                path: "/reservation",
                element: <ReservationPage />,
            },
            // 세션 필요 화면
            {
                element: <CheckSessionRoute />,
                children: [
                    {
                        path: "/mypage",
                        element: <MyPage />,
                    },
                ],
            },
        ],
    },
]);

export default router;