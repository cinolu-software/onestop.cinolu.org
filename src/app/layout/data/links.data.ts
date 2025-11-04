import {
  LucideIconData,
  Info,
  UserCheck,
  Calendar1,
  LayoutGrid,
  BookOpen,
  Group,
  Layers,
  Folders
} from 'lucide-angular';

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
    path: '/dashboard/list-programs',
    icon: Layers,
    children: [
      {
        name: 'Tous les programmes',
        path: '/dashboard/programs'
      },
      {
        name: 'Les catégories',
        path: '/dashboard/program-categories'
      },
      {
        name: 'Sous programmes',
        path: '/dashboard/subprograms'
      }
    ]
  },
  {
    name: 'Les projets',
    path: '/dashboard/list-programs',
    icon: Folders,
    children: [
      {
        name: 'Tous les projets',
        path: '/dashboard/projects'
      },
      {
        name: 'Les catégories',
        path: '/dashboard/project-categories'
      }
    ]
  },
  {
    name: 'Les événements',
    path: '/dashboard/list-programs',
    icon: Calendar1,
    children: [
      {
        name: 'Tous les événements',
        path: '/dashboard/events'
      },
      {
        name: 'Les catégories',
        path: '/dashboard/event-categories'
      }
    ]
  },
  {
    name: 'Le blog',
    path: '/dashboard/blog',
    icon: BookOpen,
    children: [
      {
        name: 'Tous les articles',
        path: '/dashboard/blog/articles'
      },
      {
        name: 'Les tags',
        path: '/dashboard/blog/tags'
      }
    ]
  },

  {
    name: 'Les utilisateurs',
    path: '/dashboard/users',
    icon: UserCheck,
    children: [
      {
        name: 'Les utilisateurs',
        path: '/dashboard/users'
      },
      {
        name: 'Les rôles',
        path: '/dashboard/roles'
      }
    ]
  },
  {
    name: 'Les entrepreneurs',
    path: '/dashboard/entrepreneurs',
    icon: UserCheck,
    children: [
      {
        name: 'Les entrepreneurs',
        path: '/dashboard/entrepreneurs',
        exactUrl: true
      },
      {
        name: 'Les entreprises',
        path: '/dashboard/entrepreneurs/ventures',
        exactUrl: true
      }
    ]
  }
];

export const COMMON_LINKS: ILink[] = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: LayoutGrid,
    exactUrl: true
  },
  {
    name: 'Mes informations',
    path: '/dashboard/account',
    icon: Info
  }
];

export const USER_LINKS: ILink[] = [
  {
    name: 'One Stop',
    path: '/dashboard/community',
    icon: Group,
    children: [
      {
        name: 'Vulgarisation',
        path: '/dashboard/community/outreach'
      }
    ]
  },
  {
    name: 'Mes entreprises',
    path: '/dashboard/ventures',
    icon: Folders,
    children: [
      {
        name: 'Liste entreprises',
        path: '/dashboard/ventures'
      },
      {
        name: 'Liste produits',
        path: '/dashboard/products'
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
    path: 'https://dashboard.com/Lubumdigital?t=MYcaQ_OEdCO3KZDCQzMoeQ&s=09',
    external: true
  },
  {
    name: 'LinkedIn',
    path: 'https://www.linkedin.com/company/cinolu/',
    external: true
  }
];
