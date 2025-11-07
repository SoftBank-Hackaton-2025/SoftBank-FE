// src/ui/ExpeditionSidebar/ExpeditionSidebar.tsx

import React from 'react';
import { Link, useLocation } from 'react-router-dom'; 
import styles from './ExpeditionSidebar.module.css';

// 1. 사이드바 아이템 데이터 (이미지 경로 수정)
const sidebarItems = [
  // 👇 [수정] 'island-1.png' -> 'island.png' (모두 동일한 이미지 사용)
  { level: 'LEVEL 1', title: 'Project Upload', path: '/upload', img: '/assets/islands/island.png' },
  { level: 'LEVEL 2', title: 'Code Analysis', path: '/analysis', img: '/assets/islands/island.png' },
  { level: 'LEVEL 3', title: 'Terraform Valley', path: '/terraform', img: '/assets/islands/island.png' },
  { level: 'LEVEL 3', title: 'AI Sizing', path: '/terraform/sizing', img: '/assets/islands/island.png' },
  { level: 'LEVEL 3', title: 'Generation', path: '/generation', img: '/assets/islands/island.png' },
  { level: 'LEVEL 4', title: 'Results', path: '/results', img: '/assets/islands/island.png' },
];

const ExpeditionSidebar: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // 2. 활성화 로직
  const getActiveClass = (path: string) => {
    let isActive = false;
    
    if (path === '/generation') {
      isActive = currentPath === '/generation' || currentPath === '/terraform-loading';
    } else {
      isActive = currentPath === path;
    }

    return isActive ? styles.active : ''; // 활성화 시 'active' 클래스 반환
  };

  return (
    <nav className={styles.sidebarContainer}>
      <Link to="/" className={styles.mainTitleLink}>
        <h1 className={styles.mainTitle}>HikariFlow</h1>
      </Link>
      
      <ul className={styles.stepsList}>
        {sidebarItems.map((item) => (
          <li key={item.path}>
            <Link 
              to={item.path} 
              className={`${styles.stepItem} ${getActiveClass(item.path)}`}
            >
              {/* 썸네일 (섬 이미지) */}
              <div className={styles.thumb}>
                <img src={item.img} alt={item.title} />
              </div>
              {/* 메타 (레벨, 제목) */}
              <div className={styles.meta}>
                <div className={styles.stepLabel}>{item.level}</div>
                <div className={styles.stepTitle}>{item.title}</div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default ExpeditionSidebar;