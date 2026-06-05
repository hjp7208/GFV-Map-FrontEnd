'use client';

import React, { useEffect, useRef } from 'react';
import Script from 'next/script';

interface Restaurant {
    restaurantId: number;
    name: string;
    address: string;
    points: string; // "위도/경도" 슬래시 문자열 구조
    matchedMenus: string[];
    veganType: string;
}

interface MapContainerProps {
    restaurants: Restaurant[];
    selectedId: number | null;
}

export default function MapContainer({ restaurants, selectedId }: MapContainerProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<any>(null);
    const clustererInstance = useRef<any>(null);
    const markersRef = useRef<any[]>([]);

    // 지도를 진짜 생성하는 이니셜라이저 본체
    const initKakaoMap = () => {
        // 이미 지도가 생성되어 있다면 중복 생성을 방지합니다.
        if (mapInstance.current) return;
        if (!mapContainerRef.current) return;

        const container = mapContainerRef.current;
        const options = {
            center: new window.kakao.maps.LatLng(37.5172, 127.0473), // 샐러디 강남구청역점 인근 초점
            level: 4,
        };

        const map = new window.kakao.maps.Map(container, options);
        mapInstance.current = map;

        clustererInstance.current = new window.kakao.maps.MarkerClusterer({
            map: map,
            averageCenter: true,
            minLevel: 6,
        });

        drawMapMarkers();
    };

    const drawMapMarkers = () => {
        const map = mapInstance.current;
        const clusterer = clustererInstance.current;
        if (!map || !clusterer) return;

        clusterer.clear();
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];

        const newMarkers = restaurants.map((shop) => {
            if (shop.points && shop.points.includes('/')) {
                const [latStr, lngStr] = shop.points.split('/');
                const latitude = parseFloat(latStr);
                const longitude = parseFloat(lngStr);

                if (!isNaN(latitude) && !isNaN(longitude)) {
                    const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);
                    const marker = new window.kakao.maps.Marker({
                        position: markerPosition,
                        title: shop.name
                    });
                    return marker;
                }
            }
            return null;
        }).filter(m => m !== null) as any[];

        markersRef.current = newMarkers;
        clusterer.addMarkers(newMarkers);
    };

    // ──────────────────────────────────────────────────────────
    // 🎯 [결정적 교정 핵심] onLoad 배신을 방어하는 실시간 이니셜라이저 트리거
    // ──────────────────────────────────────────────────────────
    useEffect(() => {
        // 이미 스크립트가 브라우저에 존재해서 onLoad가 안 돌 때를 대비한 안전 가드
        if (typeof window !== 'undefined' && window.kakao && window.kakao.maps) {
            window.kakao.maps.load(() => {
                initKakaoMap();
            });
        }
    }, []);
    // ──────────────────────────────────────────────────────────

    useEffect(() => {
        if (mapInstance.current) {
            drawMapMarkers();
        }
    }, [restaurants]);

    useEffect(() => {
        const map = mapInstance.current;
        if (!map || !selectedId) return;

        const targetShop = restaurants.find(item => item.restaurantId === selectedId);
        if (targetShop && targetShop.points && targetShop.points.includes('/')) {
            const [latStr, lngStr] = targetShop.points.split('/');
            const moveLocation = new window.kakao.maps.LatLng(parseFloat(latStr), parseFloat(lngStr));
            map.panTo(moveLocation);
        }
    }, [selectedId, restaurants]);

    return (
        <div className="absolute inset-0 min-w-full min-h-full bg-gray-100 z-0">
            <Script
                src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=604e9a64453d6167f7a58e8231871b49&autoload=false&libraries=clusterer"
                strategy="afterInteractive"
                onLoad={() => {
                    // 처음 스크립트가 로드되었을 때 실행되는 안전 통로
                    if (window.kakao && window.kakao.maps) {
                        window.kakao.maps.load(initKakaoMap);
                    }
                }}
            />
            {/* 실제 카카오 엔진 레이어가 입혀지는 도화지 */}
            <div ref={mapContainerRef} className="w-full h-full" />
        </div>
    );
}

declare global {
    interface Window {
        kakao: any;
    }
}