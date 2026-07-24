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
  category: string;
  deliveryEstimate: string | null;
  deliverables: string[];
  technologies: string[];
  estimate: string;
};
