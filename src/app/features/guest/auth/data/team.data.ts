interface ITeamMember {
  name: string;
  role: string;
  image: string;
}

export const TEAM: ITeamMember[] = [
  {
    name: 'Berry Numbi',
    role: 'Managing Director',
    image: '/images/team/bn.webp',
  },
  {
    name: 'Lydia Saku',
    role: 'Program Manager',
    image: '/images/team/ls.webp',
  },
  {
    name: 'Megan Madia',
    role: 'Support Manager',
    image: '/images/team/mm.webp',
  },
  {
    name: 'Joyce Mishika',
    role: 'Planning Manager',
    image: '/images/team/jm.webp',
  },
];
