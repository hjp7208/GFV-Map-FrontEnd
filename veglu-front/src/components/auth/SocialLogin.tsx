'use client';

import React from 'react';

export default function SocialLogin() {

    // ──────────────────────────────────────────────────────────
    // ★ [핵심 주석] 소셜 로그인 라우팅 및 인가코드 발급 핸들러
    // ──────────────────────────────────────────────────────────
    const handleSocialRedirect = (provider: 'kakao' | 'naver' | 'google') => {

        // ※ 추후 백엔드 개발자에게 공유받을 공식 소셜 인가코드 엔드포인트 주소창 매핑 구역입니다.
        // 일반적인 실무 표준 프로토콜 주소 스켈레톤을 아래에 세팅해 두었습니다.

        let redirectUrl = '';

        if (provider === 'kakao') {
            // =========================================================================
            // ★ [수정 필요 - KAKAO API]
            // 카카오 디벨로퍼스에서 발급받은 REST API 키와 설정한 Redirect URI를 매핑하세요.
            // =========================================================================
            const KAKAO_CLIENT_ID = 'YOUR_KAKAO_REST_API_KEY';
            const KAKAO_REDIRECT_URI = 'http://localhost:3000/auth/kakao/callback';

            redirectUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;
        }

        else if (provider === 'naver') {
            // =========================================================================
            // ★ [수정 필요 - NAVER API]
            // 네이버 개발자 센터에서 발급받은 Client ID와 Redirect URI, State 상수를 매핑하세요.
            // =========================================================================
            const NAVER_CLIENT_ID = 'YOUR_NAVER_CLIENT_ID';
            const NAVER_REDIRECT_URI = 'http://localhost:3000/auth/naver/callback';
            const STATE = 'vegan_gf_map_state'; // 위조 방지용 가상 상태 상수

            redirectUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${NAVER_REDIRECT_URI}&state=${STATE}`;
        }

        else if (provider === 'google') {
            // =========================================================================
            // ★ [수정 필요 - GOOGLE API]
            // 구글 클라우드 콘솔에서 발급받은 OAuth 클라이언트 ID와 Redirect URI를 매핑하세요.
            // =========================================================================
            const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';
            const GOOGLE_REDIRECT_URI = 'http://localhost:3000/auth/google/callback';
            const SCOPE = 'email profile'; // 유저 정보 접근 스코프 명세

            redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&scope=${SCOPE}`;
        }

        // 브라우저 화면을 해당 대기업 소셜 동의창 주소로 즉시 점프(내비게이션)
        if (redirectUrl) {
            window.location.href = redirectUrl;
        }
    };

    return (
        <div>
            <div className="relative my-5 text-center">
                <hr className="border-gray-200" />
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 bg-white text-xs text-gray-400">
                    소셜 계정 로그인
                </span>
            </div>

            {/* 기존 3분할 그리드 정렬 및 클릭 이벤트를 커스텀 앤드포인트 트리거와 매칭 연동 */}
            <div className="grid grid-cols-3 gap-2">
                <button
                    type="button"
                    onClick={() => handleSocialRedirect('kakao')}
                    className="flex items-center justify-center py-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-xs font-medium transition-colors"
                >
                    카카오
                </button>
                <button
                    type="button"
                    onClick={() => handleSocialRedirect('naver')}
                    className="flex items-center justify-center py-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-xs font-medium transition-colors"
                >
                    네이버
                </button>
                <button
                    type="button"
                    onClick={() => handleSocialRedirect('google')}
                    className="flex items-center justify-center py-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-xs font-medium transition-colors"
                >
                    구글
                </button>
            </div>
        </div>
    );
}