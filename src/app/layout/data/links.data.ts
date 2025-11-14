import { LucideIconData, UserCheck, Calendar1, LayoutGrid, BookOpen, Group, Layers, Folders } from 'lucide-angular';

export interface ILink {
  name: string;
  external?: boolean;
  description?: string;
  fragment?: string;
  icon?: LucideIconData;
  path?: string;
  exactUrl?: boolean;
  children?: ILink[];
  open?: boolean;
}

export const MY_CINOLU_LINKS: ILink[] = [
  {
    name: 'A propos',
    path: '/about-us',
    fragment: 'about'
  },
  {
    name: 'Vision',
    path: '/about-us',
    fragment: 'vision'
  }
];

export const EXPLORATION_LINKS: ILink[] = [
  {
    icon: LayoutGrid,
    name: 'Accueil',
    path: '',
    exactUrl: true
  }
];

export const ADMIN_LINKS: ILink[] = [
  {
    name: 'Les programmes',
    path: '/list-programs',
    icon: Layers,
    children: [
      {
        name: 'Tous les programmes',
        path: '/programs'
      },
      {
        name: 'Les catégories',
        path: '/program-categories'
      },
      {
        name: 'Sous programmes',
        path: '/subprograms'
      }
    ]
  },
  {
    name: 'Les projets',
    path: '/list-programs',
    icon: Folders,
    children: [
      {
        name: 'Tous les projets',
        path: '/projects'
      },
      {
        name: 'Les catégories',
        path: '/project-categories'
      }
    ]
  },
  {
    name: 'Les événements',
    path: '/list-programs',
    icon: Calendar1,
    children: [
      {
        name: 'Tous les événements',
        path: '/events'
      },
      {
        name: 'Les catégories',
        path: '/event-categories'
      }
    ]
  },
  {
    name: 'Le blog',
    path: '/blog',
    icon: BookOpen,
    children: [
      {
        name: 'Tous les articles',
        path: '/blog/articles'
      },
      {
        name: 'Les tags',
        path: '/blog/tags'
      }
    ]
  },

  {
    name: 'Les utilisateurs',
    path: '/users',
    icon: UserCheck,
    children: [
      {
        name: 'Les utilisateurs',
        path: '/users'
      },
      {
        name: 'Les rôles',
        path: '/roles'
      }
    ]
  }
];

export const COMMON_LINKS: ILink[] = [
  {
    name: 'Dashboard',
    path: '',
    icon: LayoutGrid,
    exactUrl: true
  }
];

export const USER_LINKS: ILink[] = [
  {
    name: 'One Stop',
    path: '/community',
    icon: Group,
    children: [
      {
        name: 'Vulgarisation',
        path: '/community/outreach'
      }
    ]
  },
  {
    name: 'Mes entreprises',
    path: '/ventures',
    icon: Folders,
    children: [
      {
        name: 'Liste entreprises',
        path: '/ventures'
      },
      {
        name: 'Liste produits',
        path: '/products'
      }
    ]
  }
];

export const SOCIAL_LINKS: ILink[] = [
  {
    name: 'Facebook',
    path: 'https://www.facebook.com/share/15cR36qNs8/?mibextid=kFxxJD',
    external: true
  },
  {
    name: 'Twitter',
    path: 'https://twitter.com/Lubumdigital?t=MYcaQ_OEdCO3KZDCQzMoeQ&s=09',
    external: true
  },
  {
    name: 'LinkedIn',
    path: 'https://www.linkedin.com/company/cinolu/',
    external: true
  }
];
