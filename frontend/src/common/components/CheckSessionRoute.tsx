/**
 * 세션체크용
 * back단으로 session 있는지 체크해서
 * response.ok일 시에만 통과
 * 아닐시 세션 없음; 로그인페이지로
 */

import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { checkSession } from "../api/commonApi";
import '../../community/pages/CommunityPage.css'

function CheckSessionRoute() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

    useEffect(() => {
        const isSessionValid = async () => {
            try {
                const session = await checkSession()

                if (session.ok) {
                    setIsAuthenticated(true)
                } else {
                    setIsAuthenticated(false)
                }
            } catch (error) {
                setIsAuthenticated(false)
            }
        }

        isSessionValid()
    }, [])

    useEffect(() => {
        // 로그인이 안되어있을시, 최초 한번만 alert 띄우게끔
        if(isAuthenticated === false) {
            alert("로그인이 필요한 페이지입니다.")
        }
    }, [isAuthenticated])

    // 세션 확인 중
    if (isAuthenticated === null) {
        return (
            <div className="community-loading" role="status">
                <div className="community-spinner" aria-hidden="true"></div>
                <p>로그인 정보를 확인하는 중입니다.</p>
            </div>
        );
    }

    // 로그인 안 됨
    if (!isAuthenticated) {
        return <Navigate to="/" replace />
    }

    // 로그인 됨
    return <Outlet />
}

export default CheckSessionRoute;