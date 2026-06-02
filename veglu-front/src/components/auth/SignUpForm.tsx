'use client';

import React, { useState } from 'react';
import { AuthViewMode } from './AuthModal';

interface SignUpFormProps {
    setViewMode: (mode: AuthViewMode) => void;
}

export default function SignUpForm({ setViewMode }: SignUpFormProps) {
    const [formData, setFormData] = useState({
        email: '', phone: '', nickname: '', password: '', confirmPassword: '', bio: ''
    });

    // 기존 에러 상태 제어 변수 보존
    const [error, setError] = useState('');

    // 비동기 통신 중 버튼 비활성화를 위한 로딩 상태 추가
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ★ 요구사항 반영: 실제 백엔드 서버에 가입을 요청하는 fetch 비동기 핸들러 고도화
    const handleSignUpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); // 새 시도 시 기존 에러 초기화

        // 1차 클라이언트 검증 코드 보존
        if (formData.password !== formData.confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        setIsLoading(true);

        try {
            // 순수 fetch 방식을 활용하여 백엔드 가입 엔드포인트로 전송
            const response = await fetch('http://localhost:8080/api/v1/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    phone: formData.phone,
                    nickname: formData.nickname,
                    password: formData.password,
                    bio: formData.bio
                    // 프로필 파일의 경우 프로젝트 아키텍처 사양(Base64 또는 별도 Multipart)에 따라
                    // 백엔드와 세부 필드 규격을 조율하여 얹으시면 됩니다.
                })
            });

            // ★ 요구사항 반영: 가입 실패(이메일 중복, 닉네임 중복, 400 Bad Request 등) 예외 핸들링
            if (!response.ok) {
                // 백엔드가 에러 메시지를 JSON({ message: "..." })으로 내려준다면 파싱해서 쓰고,
                // 기본 구조에서는 직관적인 안내 문구로 setError 처리합니다.
                const errData = await response.json().catch(() => ({}));
                setError(errData.message || '이미 가입된 이메일이거나 중복된 닉네임입니다.');
                setIsLoading(false);
                return;
            }

            // 가입 성공 사인을 받으면 알림 후 정석대로 로그인 화면 복귀
            alert('회원가입이 완료되었습니다! 로그인 화면으로 돌아갑니다.');
            setViewMode('LOGIN');

        } catch (err) {
            setError('서버와 통신하는 중 오류가 발생했습니다. 네트워크 상태를 확인해 주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="text-center mb-6">
                <h1 className="text-xl font-bold text-gray-900">회원가입</h1>
                <p className="text-xs text-gray-400 mt-1">안심 지도 서비스의 회원이 되어보세요.</p>
            </div>

            <form onSubmit={handleSignUpSubmit} className="space-y-3">
                {/* 아이디/이메일 */}
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">아이디(이메일)</label>
                    <input
                        type="email"
                        name="email"
                        required
                        onChange={handleChange}
                        disabled={isLoading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none"
                        placeholder="example@email.com"
                    />
                </div>
                {/* 전화번호 */}
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">전화번호</label>
                    <input
                        type="text"
                        name="phone"
                        required
                        onChange={handleChange}
                        disabled={isLoading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none"
                        placeholder="010-0000-0000"
                    />
                </div>
                {/* 닉네임 */}
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">닉네임</label>
                    <input
                        type="text"
                        name="nickname"
                        required
                        onChange={handleChange}
                        disabled={isLoading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none"
                        placeholder="닉네임을 입력하세요"
                    />
                </div>
                {/* 비밀번호 */}
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">비밀번호</label>
                    <input
                        type="password"
                        name="password"
                        required
                        onChange={handleChange}
                        disabled={isLoading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none"
                        placeholder="비밀번호 입력"
                    />
                </div>
                {/* 비밀번호 확인 */}
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">비밀번호 확인</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        required
                        onChange={handleChange}
                        disabled={isLoading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none"
                        placeholder="비밀번호 재입력"
                    />
                </div>

                {/* 프로필 사진 컴포넌트 자리 */}
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">프로필 사진</label>
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-400">사진</div>
                        <input
                            type="file"
                            accept="image/*"
                            disabled={isLoading}
                            className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:bg-gray-100 hover:file:bg-gray-200 disabled:opacity-50"
                        />
                    </div>
                </div>

                {/* 자기소개 */}
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">자기소개</label>
                    <textarea
                        name="bio"
                        rows={2}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm resize-none focus:outline-none"
                        placeholder="한 줄 자기소개를 입력하세요"
                    />
                </div>

                {/* 실시간 백엔드 실패 및 유효성 검증 에러 문구 출력 라인 */}
                {error && <p className="text-xs text-red-500 font-medium animate-in fade-in duration-150">⚠️ {error}</p>}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-sm mt-2 transition-colors disabled:opacity-60 flex items-center justify-center"
                >
                    {isLoading ? '가입 정보 전송 중...' : '회원가입 완료'}
                </button>
            </form>

            <div className="text-center mt-4">
                <button
                    onClick={() => setViewMode('LOGIN')}
                    disabled={isLoading}
                    className="text-xs text-gray-400 hover:underline disabled:opacity-50"
                >
                    이미 계정이 있으신가요? 로그인으로 가기
                </button>
            </div>
        </div>
    );
}