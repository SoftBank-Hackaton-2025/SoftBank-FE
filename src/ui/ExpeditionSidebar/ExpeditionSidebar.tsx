// src/ui/ExpeditionSidebar/ExpeditionSidebar.tsx

import React from 'react';
import { Link, useLocation } from 'react-router-dom'; 
import styles from './ExpeditionSidebar.module.css';

const ExpeditionSidebar: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const getActiveClass = (path: string, isSubLevel: boolean = false) => {
    let className = isSubLevel ? styles.subLevelItem : styles.levelItem;
    
    let isActive = false;
    // 👇 1. [변경] Project Upload의 활성화 경로를 '/' -> '/upload'로 변경
    // (이제 루트('/') 페이지는 서비스 소개이므로, 'Project Upload'가 활성화되면 안 됨)
    if (path === '/upload') isActive = currentPath === '/upload'; 
    if (path === '/analysis') isActive = currentPath === '/analysis';
    if (path === '/terraform/sizing') isActive = currentPath === '/terraform/sizing';
    if (path === '/generation') isActive = currentPath === '/generation' || currentPath === '/terraform-loading';
    if (path === '/results') isActive = currentPath === '/results';
    if (path === '/terraform') isActive = currentPath === '/terraform'; // Terraform Valley 허브 링크

    if (isActive) {
      className += isSubLevel ? ` ${styles.activeSubItem}` : ` ${styles.activeLevelItem}`;
    }
    
    return className;
  };

  return (
    <nav className={styles.sidebarContainer}>
      <h1 className={styles.mainTitle}>Expedition</h1>
      
      <ul className={styles.levelList}>
        {/* LEVEL 1 */}
        <li>
          <span className={styles.levelTitle}>LEVEL 1</span>
          {/* 👇 2. [변경] to='/' -> 'to="/upload"' */}
          <Link to="/upload" className={`${getActiveClass('/upload')} ${styles.islandStyle1}`}>
            Project Upload
          </Link>
        </li>
        
        {/* LEVEL 2 */}
        <li>
          <span className={styles.levelTitle}>LEVEL 2</span>
          <Link to="/analysis" className={`${getActiveClass('/analysis')} ${styles.islandStyle2}`}>
            Code Analysis
          </Link>
        </li>
        
        {/* LEVEL 3 */}
        <li>
          <span className={styles.levelTitle}>LEVEL 3</span>
          <ul className={styles.subLevelList}>
            <li>
              {/* 👇 3. [변경] Terraform Valley 링크 경로 추가 */}
              <Link to="/terraform" className={`${getActiveClass('/terraform', true)} ${styles.islandStyle1}`}>
                Terraform Valley
              </Link>
            </li>
            <li>
              <Link to="/terraform/sizing" className={getActiveClass('/terraform/sizing', true)}>
                AI Sizing
              </Link>
            </li>
            <li>
              <Link to="/generation" className={getActiveClass('/generation', true)}>
                Generation
              </Link>
            </li>
            <li>
              <Link to="/results" className={getActiveClass('/results', true)}>
                Results
              </Link>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  );
};

export default ExpeditionSidebar;