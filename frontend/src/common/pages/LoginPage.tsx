import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/commonApi'

import './LoginPage.css'

function LoginPage() {
	const [loginId, setLoginId] = useState('')
	const [password, setPassword] = useState('')

	const navigate = useNavigate()

	const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		try {
			const result = await login(loginId, password)

			if (!result.ok) {
				alert(result.data.message)
				return
			}

			console.log('로그인 성공:', result.data)

			navigate('/reservation')
		} catch (error) {
			console.error(error)

			alert('로그인 처리 중 오류가 발생했습니다.')
		}
	}

	return (
		<div className="login-page">
			<div className="login-box">

				<div className="login-title">
					<h1>JARION</h1>
					<p>내 자리를 Light On, 자리온</p>
				</div>

				<form onSubmit={handleLogin}>
					<div className="input-group">
						<label>아이디</label>

						<input
							type="text"
							value={loginId}
							onChange={(e) =>
								setLoginId(e.target.value)
							}
							placeholder="아이디를 입력하세요"
						/>
					</div>

					<div className="input-group">
						<label>비밀번호</label>

						<input
							type="password"
							value={password}
							onChange={(e) =>
								setPassword(e.target.value)
							}
							placeholder="비밀번호를 입력하세요"
						/>
					</div>

					<button
						type="submit"
						className="login-button"
					>
						로그인
					</button>
				</form>

			</div>
		</div>
	)
}

export default LoginPage