'use client';

import React, { useState } from 'react';

interface LoginFormProps {
    setViewMode: (mode: 'LOGIN' | 'SIGNUP' | 'FIND_ID' | 'FIND_PW') => void;
    onClose: () => void;
}

export default function LoginForm({ setViewMode, onClose }: LoginFormProps) {
    // 입력 필드 상태 관리
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // 실제 백엔드 검증 실패 문구 출력용 에러 상태
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!email.trim() || !password.trim()) {
            setError('이메일과 비밀번호를 모두 입력해 주세요.');
            return;
        }

        setIsLoading(true);

        try {
            // 1. 순수 fetch API 방식을 활용한 실제 백엔드 서버 값 검증 요청
            const response = await fetch('http://localhost:8080/api/v1/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            // 2. 검증 실패 시 "이메일 또는 비밀번호가 다릅니다"를 setError로 출력
            if (!response.ok) {
                setError('이메일 또는 비밀번호가 다릅니다.');
                setIsLoading(false);
                return;
            }

            // 로그인 성공 시 응답 데이터(JWT 토큰 및 세션) 파싱 후 로컬 저장소 안착
            const data = await response.json();
            if (data.accessToken) {
                localStorage.setItem('user_token', data.accessToken);
                localStorage.setItem('user_nickname', data.user?.nickname || '위치삼');
                localStorage.setItem('user_avatar', data.user?.avatar || '🥑');
            }

            // 성공 완료 후 부모 모달 종료
            onClose();

        } catch (err) {
            setError('서버 연결에 실패했습니다. 네트워크 상태를 확인해 주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    // 소셜 로그인 인가코드 플로우 진입 트리거 함수 (임의 핸들러)
    const handleSocialLogin = (provider: 'kakao' | 'naver' | 'google') => {
        alert(`🌱 [OAuth 2.0] ${provider} 인가코드 발급 링크로 리다이렉트 동선을 준비 중입니다.`);
        // 추후 기획대로 카카오/네이버 주소창 이동 로직 배치 구역
    };

    return (
        <div className="w-full space-y-5 text-xs select-none">

            {/* 1. 일반 이메일 로그인 폼 트랙 */}
            <form onSubmit={handleSubmit} className="space-y-4 w-full">
                <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-400 block">이메일 주소</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@domain.com"
                        disabled={isLoading}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 transition-all font-medium text-gray-800"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-400 block">비밀번호</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        disabled={isLoading}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 transition-all text-gray-800"
                    />
                </div>

                {/* setError 작동 시 출력되는 에러 경고 배너 */}
                {error && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-xl animate-in fade-in duration-150">
                        <p className="text-[11px] font-semibold text-red-600 flex items-center">
                            <span className="mr-1.5">⚠️</span> {error}
                        </p>
                    </div>
                )}

                <div className="pt-1">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3.5 bg-green-700 hover:bg-green-800 text-white font-bold rounded-xl transition-all shadow-md active:scale-[0.99]"
                    >
                        {isLoading ? '인증 정보 검증 중...' : '비건 안심 지도 로그인'}
                    </button>
                </div>
            </form>

            {/* 2. 아이디/비번 찾기 및 회원가입 내비게이션 링크 트랙*/}
            <div className="flex items-center justify-center space-x-3 text-gray-400 font-medium border-b border-gray-100 pb-4">
                <button
                    type="button"
                    onClick={() => setViewMode('FIND_ID')}
                    className="hover:text-gray-600 transition-colors bg-transparent border-none p-0 cursor-pointer"
                >
                    아이디 찾기
                </button>
                <span className="text-gray-200">|</span>
                <button
                    type="button"
                    onClick={() => setViewMode('FIND_PW')}
                    className="hover:text-gray-600 transition-colors bg-transparent border-none p-0 cursor-pointer"
                >
                    비밀번호 찾기
                </button>
                <span className="text-gray-200">|</span>
                <button
                    type="button"
                    onClick={() => setViewMode('SIGNUP')}
                    className="text-green-700 font-bold hover:underline bg-transparent border-none p-0 cursor-pointer"
                >
                    회원가입
                </button>
            </div>

            {/* 소셜 로그인 */}
            <div className="space-y-3">
                <div className="flex items-center my-2">
                    <div className="flex-1 border-t border-gray-200"></div>
                    <span className="px-3 text-[10px] text-gray-400 font-bold uppercase tracking-wider">간편 소셜 로그인</span>
                    <div className="flex-1 border-t border-gray-200"></div>
                </div>

                {/* 소셜 버튼 그리드 컨테이너 팩 */}
                <div className="grid grid-cols-1 gap-2.5">

                    {/* 카카오 로그인 단추 */}
                    <button
                        type="button"
                        onClick={() => handleSocialLogin('kakao')}
                        className="w-full py-3 bg-[#FEE500] hover:bg-[#FEE500]/90 text-[#191919] font-bold rounded-xl transition-all flex items-center justify-center space-x-2 shadow-sm relative active:scale-[0.99]"
                    >
                        <span className="absolute left-4 text-sm">💬</span>
                        <span>카카오로 시작하기</span>
                    </button>

                    {/* 네이버 로그인 단추 */}
                    <button
                        type="button"
                        onClick={() => handleSocialLogin('naver')}
                        className="w-full py-3 bg-[#03C75A] hover:bg-[#03C75A]/90 text-white font-bold rounded-xl transition-all flex items-center justify-center space-x-2 shadow-sm relative active:scale-[0.99]"
                    >
                        <span className="absolute left-4 text-sm">N</span>
                        <span>네이버로 시작하기</span>
                    </button>

                    {/* 구글 로그인 단추 */}
                    <button
                        type="button"
                        onClick={() => handleSocialLogin('google')}
                        className="w-full py-3 bg-white hover:bg-gray-50 text-gray-700 font-bold rounded-xl border border-gray-200 transition-all flex items-center justify-center space-x-2 shadow-sm relative active:scale-[0.99]"
                    >
                        <span className="absolute left-4 text-sm">🔑</span>
                        <span>Google 계정으로 연동</span>
                    </button>

                </div>
            </div>

        </div>
    );
}