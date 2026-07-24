export type ServiceTypeOption = {
  slug: string;
  name: string;
  count: number;
};

export type ServiceDiscoveryItem = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  category: string;
  serviceTypeSlug: string | null;
  serviceTypeName: string | null;
  deliveryEstimate: string | null;
  deliverables: string[];
  technologies: string[];
  estimate: string;
  isFeatured: boolean;
};

export type ServiceDiscoveryGroup = {
  slug: string;
  name: string;
  services: ServiceDiscoveryItem[];
};
