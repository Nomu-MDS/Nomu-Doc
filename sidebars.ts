import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    {
      type: 'category',
      label: 'Général',
      collapsed: false,
      items: [
        'general/architecture',
        'general/getting-started',
        'general/database',
        'general/environment',
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      collapsed: false,
      items: [
        'api/overview',
        'api/authentication',
        'api/users',
        'api/interests',
        'api/conversations',
        'api/reservations',
        'api/tokens',
        'api/reports',
      ],
    },
    {
      type: 'category',
      label: 'Recherche Sémantique',
      collapsed: false,
      items: [
        'search/overview',
        'search/indexing',
        'search/algorithm',
      ],
    },
    {
      type: 'category',
      label: 'WebSocket',
      collapsed: false,
      items: [
        'websocket/overview',
        'websocket/events',
      ],
    },
    {
      type: 'category',
      label: 'CI/CD & Déploiement',
      collapsed: false,
      items: [
        'cicd/overview',
        'cicd/docker',
        'cicd/deployment',
      ],
    },
  ],
};

export default sidebars;
