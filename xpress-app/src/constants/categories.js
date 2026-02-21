import {
  Car,
  Cpu,
  Disc,
  Zap,
  Sparkles,
  Wrench,
  Droplet,
  Thermometer
} from 'lucide-react';

export const CATEGORIES = [
  {
    id: 'body-chassis',
    label: 'Body & Parts',
    icon: Car,
    slug: 'body-chassis'
  },
  {
    id: 'engine-performance',
    label: 'Engine & Performance',
    icon: Cpu,
    slug: 'engine-performance'
  },
  {
    id: 'wheels-tires',
    label: 'Wheels & Tires',
    icon: Disc,
    slug: 'wheels-tires'
  },
  {
    id: 'lighting-electronics',
    label: 'Lighting & Electronics',
    icon: Zap,
    slug: 'lighting-electronics'
  },
  {
    id: 'accessories',
    label: 'Accessories',
    icon: Sparkles,
    slug: 'accessories'
  },
  {
    id: 'automotive-tools',
    label: 'Automotive Tools',
    icon: Wrench,
    slug: 'automotive-tools'
  },
  {
    id: 'fluids-care',
    label: 'Fluids & Car Care',
    icon: Droplet,
    slug: 'fluids-care'
  },
  {
    id: 'cooling-ac',
    label: 'Cooling & AC',
    icon: Thermometer,
    slug: 'cooling-ac'
  }
];

export const getCategoryBySlug = (slug) => CATEGORIES.find(cat => cat.slug === slug);
export const getCategoryById = (id) => CATEGORIES.find(cat => cat.id === id);
