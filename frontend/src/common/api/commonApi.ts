/**
 * common 디렉토리에서 쓰이는 함수들 (다 뺄 필요는 없음)
 */

// 암호화/복호화 관련 시작

const base64ToArrayBuffer = (base64: string) => {
	const binary = window.atob(base64)
	const bytes = new Uint8Array(binary.length)

	for (let i = 0; i < binary.length; i++) {
		bytes[i] = binary.charCodeAt(i)
	}

	return bytes.buffer
}

const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
	const bytes = new Uint8Array(buffer)

	let binary = ''

	for (let i = 0; i < bytes.length; i++) {
		binary += String.fromCharCode(bytes[i])
	}

	return window.btoa(binary)
}

const encryptPassword = async (
	password: string,
	publicKeyBase64: string
) => {
	const publicKeyBuffer = base64ToArrayBuffer(publicKeyBase64)

	const publicKey = await window.crypto.subtle.importKey(
        'spki',
        publicKeyBuffer,
        {
            name: 'RSA-OAEP',
            hash: 'SHA-256',
        },
        false,
        ['encrypt']
    )

	const passwordBytes = new TextEncoder().encode(password)

	const encrypted = await window.crypto.subtle.encrypt(
        {
            name: 'RSA-OAEP',
        },
        publicKey,
        passwordBytes
    )

	return arrayBufferToBase64(encrypted)
}

export const getRsaKey = async () => {
	const response = await fetch('/api/auth/rsa-key')

	if (!response.ok) {
		throw new Error('RSA Key 발급 실패')
	}

	return response.json()
}

// 암호화/복호화 관련 끝

/**
 * 로그인
 * @param loginId 
 * @param password 
 * @returns UserVO
 */
export const login = async (
	loginId: string,
	password: string
) => {
	// 1. RSA 공개키 요청
	const keyData = await getRsaKey()

	// 2. 비밀번호 암호화
	const encryptedPassword = await encryptPassword(
        password,
        keyData.publicKey
    )

	// 3. 로그인 요청
	const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            loginId,
            encryptedPassword,
        }),
    })

	const data = await response.json()

	return {
		ok: response.ok,
		data,
	}
}

/**
 * 세션 체크
 * @returns UserVO
 */
export const checkSession = async () => {
	return fetch('/api/auth/session')
}

/**
 * 로그아웃
 * @returns 
 */
export const logout = async () => {
	return fetch('/api/auth/logout', {
		method: 'POST',
	})
}