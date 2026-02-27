import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import styles from './index.module.css';

const sections = [
  {
    num: '01',
    label: 'Architecture générale',
    desc: 'Stack technique, schéma DB, flux d\'authentification et variables d\'environnement.',
    to: '/general/architecture',
  },
  {
    num: '02',
    label: 'API Reference',
    desc: 'Endpoints REST complets — headers, body, réponses et codes d\'erreur.',
    to: '/api/overview',
  },
  {
    num: '03',
    label: 'Recherche sémantique',
    desc: 'Meilisearch + embeddings OpenAI, indexation et algorithme hybride.',
    to: '/search/overview',
  },
  {
    num: '04',
    label: 'WebSocket',
    desc: 'Messagerie temps réel avec Socket.IO — authentification et événements.',
    to: '/websocket/overview',
  },
  {
    num: '05',
    label: 'CI/CD & Déploiement',
    desc: 'GitHub Actions, Docker multi-stage et déploiement zero-downtime sur VPS.',
    to: '/cicd/overview',
  },
];

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
    <path d="M5 12h14m-6 6 6-6-6-6"/>
  </svg>
);

export default function Home(): React.JSX.Element {
  return (
    <Layout title="Documentation" description="Documentation technique Nomu">
      <div className={styles.page}>

        {/* ── Hero — card navy arrondie ── */}
        <div className={styles.heroWrap}>
          <div className={styles.hero}>
            <span className={styles.heroBadge}>
              <span className={styles.heroBadgeDot} />
              Documentation technique
            </span>
            <h1 className={styles.heroTitle}>
              Nomu Docs
            </h1>
            <p className={styles.heroSub}>
              Architecture, API REST, recherche sémantique,<br />
              WebSocket temps réel et CI/CD de la plateforme Nomu.
            </p>
            <div className={styles.heroCtas}>
              <Link to="/general/architecture" className={styles.ctaPrimary}>
                Commencer
                <ArrowIcon />
              </Link>
              <Link to="/api/overview" className={styles.ctaSecondary}>
                API Reference
              </Link>
            </div>
          </div>
        </div>

        {/* ── Cards — section #F0EDE6 arrondie ── */}
        <div className={styles.cardsWrap}>
          <div className={styles.cardsHeader}>
            <span className={styles.cardsSectionLabel}>Parcourir la documentation</span>
            <h2 className={styles.cardsSectionTitle}>5 sections</h2>
          </div>
          <div className={styles.grid}>
            {sections.map(s => (
              <Link key={s.to} to={s.to} className={styles.card}>
                <span className={styles.cardNum}>{s.num}</span>
                <h3 className={styles.cardTitle}>{s.label}</h3>
                <p className={styles.cardDesc}>{s.desc}</p>
                <span className={styles.cardArrow}><ArrowIcon /></span>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </Layout>
  );
}
