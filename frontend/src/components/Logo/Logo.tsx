import React from 'react';
import Spine0 from "@assets/spine_6.png";
import Spine1 from "@assets/spine_7.png";
import Spine2 from "@assets/spine_5.png";
import Spine3 from "@assets/spine_4.png";
import styles from './logo.module.css';

interface BooksLogoStaticProps {
  size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const Logo: React.FC<BooksLogoStaticProps> = ({
  size = 'md',
  className = '',
}) => {
  return (
    <div className={`${styles.logoWrap} ${styles[size]} ${className}`}>

      {/* ── Corner Lines ── */}
      {(['tl', 'tr', 'bl', 'br'] as const).map((pos) => (
        <div key={pos} className={`${styles.corner} ${styles[pos]}`}>
          <div className={styles.l1h} />
          <div className={styles.l1v} />
          <div className={styles.l2h} />
          <div className={styles.l2v} />
        </div>
      ))}

      {/* ── Corner Flourishes ── */}
      <div className={`${styles.flourish} ${styles.flourishTl}`} />
      <div className={`${styles.flourish} ${styles.flourishTr}`} />
      <div className={`${styles.flourish} ${styles.flourishBl}`} />
      <div className={`${styles.flourish} ${styles.flourishBr}`} />

      {/* ── Books ── */}
      <div className={styles.booksRow}>

        {/* Book 0 — new leftmost, slightly shorter */}
        <div
          className={`${styles.bookSpine} ${styles.book0}`}
          style={
            Spine0
              ? { backgroundImage: `url(${Spine0})`, backgroundSize: 'cover', backgroundPosition: 'center' }
              : undefined
          }
        />

        {/* Book 1 */}
        <div
          className={`${styles.bookSpine} ${styles.book1}`}
          style={
            Spine1
              ? { backgroundImage: `url(${Spine1})`, backgroundSize: 'cover', backgroundPosition: 'center' }
              : undefined
          }
        />

        {/* Book 2 — tallest, upright */}
        <div
          className={`${styles.bookSpine} ${styles.book2}`}
          style={
            Spine2
              ? { backgroundImage: `url(${Spine2})`, backgroundSize: 'cover', backgroundPosition: 'center' }
              : undefined
          }
        />

        {/* Book 3 — tilted, pushed right and slightly down */}
        <div
          className={`${styles.bookSpine} ${styles.book3}`}
          style={
            Spine3
              ? { backgroundImage: `url(${Spine3})`, backgroundSize: 'cover', backgroundPosition: 'center' }
              : undefined
          }
        />

      </div>

      {/* ── Shelf ── */}
      <div className={styles.shelf} />

      {/* ── Text ── */}
      <div className={styles.logoText}>
        Pages &amp; Parchment
        <span className={styles.logoSub}>Comfort · Harmony · Classic</span>
      </div>

    </div>
  );
};