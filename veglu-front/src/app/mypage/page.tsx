'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function MyPage() {
    // 1. 사진첩 모달창 전용 ON/OFF 스위치 상태
    const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

    // 2. 가짜 사진첩 이미지 데이터 (추후 백엔드 Image 엔티티 컬렉션과 바인딩)
    const mockPhotos = [
        { id: 1, title: '이태원 비건 도넛 🍩', url: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80' },
        { id: 2, title: '속 편한 쌀 소금빵 🥐', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80' },
        { id: 3, title: '대체당 말차 케이크 🍰', url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80' },
        { id: 4, title: '글루텐프리 아보카도 샌드위치 🥪', url: 'https://images.unsplash.com/photo-1540713434306-5850587b6949?w=400&q=80' },
        { id: 5, title: '비건 비빔밥 🥗', url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80' },
        { id: 6, title: '넛프리 바나나 브레드 🍌', url: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&q=80' }
    ];

    // 작성한 리뷰 리스트 (기능 미구현 차단 버튼)
    const handleReviewListClick = () => {
        alert('🔧 [F-REVIEW-002] "작성한 리뷰 리스트" 조회 기능은 현재 개발 진행 중(미구현) 상태입니다.');
    };

    return (
        <div className="min-h-screen w-screen bg-gray-50 flex flex-col items-center justify-center p-6 select-none relative overflow-hidden">

            {/* ──────────────────────────────────────────────────────────
          MAIN CARD: 마이페이지 프로필 본체 (F-MY-001)
          ────────────────────────────────────────────────────────── */}
            <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl shadow-xl p-8 space-y-6 relative z-10">

                {/* 와이어프레임 왼쪽 상단: 로고 마커 장식 */}
                <div className="absolute top-4 left-4 bg-gray-200 text-[10px] font-bold text-gray-500 px-2.5 py-1 rounded-md">
                    로고
                </div>

                {/* 와이어프레임 오른쪽 상단: 명세 ID */}
                <div className="text-right text-[10px] font-bold text-gray-400 tracking-wider">
                    수정본(F-MY-001)
                </div>

                {/* 프로필 이미지 분할 영역 */}
                <div className="flex flex-col items-center space-y-3 pt-2">
                    <div className="w-24 h-24 bg-gray-100 border border-gray-200 rounded-full flex items-center justify-center text-3xl shadow-inner">
                        🥑
                    </div>
                    <div className="text-center">
                        <h2 className="text-base font-bold text-gray-900">닉네임</h2>
                        <p className="text-xs text-gray-400 font-medium mt-0.5">위치삼</p>
                    </div>
                </div>

                {/* 자기소개 박스 구역 */}
                <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">자기소개</label>
                    <div className="w-full h-20 bg-gray-100 border border-gray-200 rounded-xl p-3 text-xs text-gray-500 flex items-start justify-start leading-relaxed shadow-inner">
                        여기는 사용자 자기소개 텍스트가 노출되거나 수정 입력되는 공간입니다.
                    </div>
                </div>

                {/* 상호작용 하단 버튼 모음 */}
                <div className="space-y-3 pt-2">
                    {/* 사진첩 버튼: 누르면 변수 상태가 바뀌며 독립형 모달이 열립니다 */}
                    <button
                        type="button"
                        onClick={() => setIsPhotoModalOpen(true)}
                        className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs transition-colors border border-gray-200 text-center active:scale-[0.98]"
                    >
                        사진첩 열기 📸
                    </button>

                    {/* 작성한 리뷰 리스트 버튼 */}
                    <button
                        type="button"
                        onClick={handleReviewListClick}
                        className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-400 font-medium rounded-xl text-xs transition-colors border border-gray-200 border-dashed text-center relative"
                    >
                        작성한 리뷰 리스트
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] bg-amber-100 text-amber-700 font-bold px-1.5 py-0.5 rounded">
              미구현
            </span>
                    </button>
                </div>

                {/* 임시 하단 가이드 풋터 */}
                <div className="pt-4 border-t border-gray-100 text-center text-[11px] text-gray-400 font-medium">
                    현재 마이페이지 독립형 스프린트 조립 중입니다.
                </div>
            </div>

            {/* ──────────────────────────────────────────────────────────
          MODAL WINDOW: 사진첩 전용 독립 모달 레이어 (F-MY-001 확장)
          ────────────────────────────────────────────────────────── */}
            {isPhotoModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">

                    {/* 모달 창 본체 (바깥 영역 클릭 대신 우측 상단 X 버튼으로 확실히 닫히게 통제) */}
                    <div className="w-full max-w-lg bg-white border border-gray-100 rounded-3xl shadow-2xl p-6 relative flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-200">

                        {/* 모달 상단 헤더 라인 */}
                        <div className="flex justify-between items-center pb-3 border-b border-gray-100 flex-shrink-0">
                            <h3 className="text-sm font-bold text-gray-900 tracking-tight flex items-center">
                                <span className="mr-1.5">📸</span> 위치삼님의 비건 안심 갤러리
                            </h3>

                            {/* 우측 닫기(X) 버튼 */}
                            <button
                                type="button"
                                onClick={() => setIsPhotoModalOpen(false)}
                                className="w-6 h-6 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full font-bold text-xs transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        {/* 모달 이미지 그리드 스크롤바 바디 영역 */}
                        <div className="flex-1 overflow-y-auto pt-4 pr-1 space-y-2">
                            <p className="text-[10px] text-gray-400 font-medium">총 {mockPhotos.length}개의 안심 먹거리 추억이 보관되어 있습니다.</p>

                            {/* 모달창 공간 여유를 살려 시원시원한 3열 그리드 배치 */}
                            <div className="grid grid-cols-3 gap-3">
                                {mockPhotos.map((photo) => (
                                    <div
                                        key={photo.id}
                                        className="aspect-square w-full rounded-xl bg-gray-50 border border-gray-200 overflow-hidden relative group cursor-pointer shadow-sm hover:ring-2 hover:ring-green-600/40 transition-all"
                                        title={photo.title}
                                    >
                                        <img
                                            src={photo.url}
                                            alt={photo.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        {/* 오버레이 효과 */}
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                                            <span className="text-[9px] font-semibold text-white truncate w-full">{photo.title}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 모달 하단 버튼바 */}
                        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end flex-shrink-0">
                            <button
                                type="button"
                                onClick={() => setIsPhotoModalOpen(false)}
                                className="px-4 py-1.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
                            >
                                닫기
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}