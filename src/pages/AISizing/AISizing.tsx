// src/pages/AISizing/AISizing.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
// 👇 [변경] 'expedition.context.ts'에서 훅을 가져옵니다.
import { useExpedition } from '../../stores/expedition.context'; 
import styles from './AISizing.module.css';

const AISizing: React.FC = () => {
  const navigate = useNavigate();
  const { sizingOptions, setSizingOptions } = useExpedition();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault(); 
    navigate('/terraform-loading'); 
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSizingOptions({
      ...sizingOptions,
      [name]: value,
    });
  };

  // ... (이하 JSX 코드는 동일) ...
  return (
    <div className={styles.sizingContainer}>
      <h1 className={styles.title}>AI Sizing</h1>
      <p className={styles.subtitle}>
        AI가 최적의 인프라 규모를 추천할 수 있도록 프로젝트 정보를 선택해 주세요.
      </p>
      <form className={styles.form} onSubmit={handleSubmit}>
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>프로젝트 규모</legend>
          <div className={styles.checkboxGroup}>
            <label className={styles.label}>
              <input 
                type="radio" 
                name="scale" 
                value="small" 
                onChange={handleChange}
                checked={sizingOptions.scale === 'small'}
              />
              소규모 (개인/토이 프로젝트)
            </label>
            <label className={styles.label}>
              <input 
                type="radio" 
                name="scale" 
                value="medium" 
                onChange={handleChange}
                checked={sizingOptions.scale === 'medium'}
              />
              중규모 (스타트업/팀)
            </label>
            <label className={styles.label}>
              <input 
                type="radio" 
                name="scale" 
                value="large" 
                onChange={handleChange}
                checked={sizingOptions.scale === 'large'}
              />
              대규모 (엔터프라이즈)
            </label>
          </div>
        </fieldset>
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>예상 월간 활성 사용자 (MAU)</legend>
          <div className={styles.checkboxGroup}>
            <label className={styles.label}>
              <input 
                type="radio" 
                name="users" 
                value="1k"
                onChange={handleChange}
                checked={sizingOptions.users === '1k'}
              />
              1천명 미만
            </label>
            <label className={styles.label}>
              <input 
                type="radio" 
                name="users" 
                value="10k"
                onChange={handleChange}
                checked={sizingOptions.users === '10k'}
              />
              1천명 ~ 1만명
            </label>
            <label className={styles.label}>
              <input 
                type="radio" 
                name="users" 
                value="100k"
                onChange={handleChange}
                checked={sizingOptions.users === '100k'}
              />
              10만명 ~ 10만명
            </label>
            <label className={styles.label}>
              <input 
                type="radio" 
                name="users" 
                value="1M"
                onChange={handleChange}
                checked={sizingOptions.users === '1M'}
              />
              10만명 이상
            </label>
          </div>
        </fieldset>
        <button type="submit" className={styles.submitButton}>
          추천 받기
        </button>
      </form>
    </div>
  );
};

export default AISizing;