// src/ui/ExpeditionSidebar/ExpeditionSidebar.tsx

import React from 'react';
import { Link, useLocation } from 'react-router-dom'; 
import styles from './ExpeditionSidebar.module.css';
import { useExpedition } from '../../stores/expedition.context'; 

// 사이드바 아이템 데이터
const sidebarItems = [
  { level: 'STEP 1', title: 'Project Upload', path: '/upload', img: '/assets/islands/island.png' },
  { level: 'STEP 2', title: 'Infra Sizing', path: '/terraform/sizing', img: '/assets/islands/island.png' },
  { level: 'STEP 3', title: 'Terraform & Pricing', path: '/generation', img: '/assets/islands/island.png' },
  { level: 'STEP 4', title: 'CI/CD & Download', path: '/results', img: '/assets/islands/island.png' },
  { level: 'STEP 5', title: 'Deployment Tips', path: '/tips', img: '/assets/islands/island.png' },
];

const ExpeditionSidebar: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { completedSteps } = useExpedition();

  // [수정] 활성화 및 완료 상태 로직
  const getItemStatusClass = (path: string) => {
    let isActive = false;
    
    // "진행 중" (Active) 상태 정의
    if (path === '/upload') {
      isActive = currentPath === '/upload' || currentPath === '/analysis';
    } else if (path === '/generation') {
      isActive = currentPath === '/generation' || currentPath === '/terraform-loading';
    } else {
      isActive = currentPath === path;
    }

    if (isActive) {
      return styles.active; // 👈 현재 진행 중인 단계
    }
    
    // [수정] 전역 스토어(Set)에 저장된 경로인지 확인하는 로직만 남김
    if (completedSteps.has(path)) {
      return styles.completed; // 👈 완료된 단계
    }

    return ''; // 기본 상태
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
              className={`${styles.stepItem} ${getItemStatusClass(item.path)}`}
            >
              {/* 상태 표시 원 */}
              <div className={styles.statusCircle}></div>
              
              <div className={styles.thumb}>
                <img src={item.img} alt={item.title} />
              </div>
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