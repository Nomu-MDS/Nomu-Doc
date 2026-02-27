import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
// @ts-ignore
import type * as Mermaid from '@docusaurus/theme-mermaid';

const config: Config = {
  title: 'Nomu Docs',
  tagline: 'Documentation technique de la plateforme Nomu',
  favicon: 'img/favicon.ico',
  url: 'https://docs.nomu.app',
  baseUrl: '/',
  onBrokenLinks: 'warn',
  i18n: { defaultLocale: 'fr', locales: ['fr'] },
  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
  themes: ['@docusaurus/theme-mermaid'],

  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'anonymous',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap',
      },
    },
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
    },
    mermaid: {
      theme: { light: 'neutral', dark: 'dark' },
    },
    navbar: {
      title: '',
      logo: {
        alt: 'Nomu',
        src: 'img/Nomu_logo_cream.svg',
        href: '/',
      },
      items: [
        { to: '/general/architecture', label: 'Général', position: 'left' },
        { to: '/api/overview', label: 'API', position: 'left' },
        { to: '/search/overview', label: 'Recherche', position: 'left' },
        { to: '/websocket/overview', label: 'WebSocket', position: 'left' },
        { to: '/cicd/overview', label: 'CI/CD', position: 'left' },
        {
          href: 'https://github.com/Crmy7/Nomu-Back',
          position: 'right',
          className: 'navbar-github-link',
          'aria-label': 'GitHub',
        },
      ],
      hideOnScroll: false,
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            { label: 'Architecture', to: '/general/architecture' },
            { label: 'Démarrage rapide', to: '/general/getting-started' },
            { label: 'API Reference', to: '/api/overview' },
            { label: 'WebSocket', to: '/websocket/overview' },
            { label: 'CI/CD', to: '/cicd/overview' },
          ],
        },
        {
          title: 'Projet',
          items: [
            { label: 'Nomu', href: 'https://app.nomu.charlesremy.dev' },
            { label: 'GitHub Backend', href: 'https://github.com/Crmy7/Nomu-Back' },
            { label: 'GitHub Frontend', href: 'https://github.com/Nomu-MDS/Nomu-Front' },
            { label: 'GitHub Web', href: 'https://github.com/Nomu-MDS/Nomu-Web' },
            { label: 'GitHub Admin', href: 'https://github.com/Nomu-MDS/Nomu-Admin' },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Nomu — Documentation interne`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'typescript', 'javascript', 'yaml', 'docker'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
