export type ServiceTypeOption = {
  slug: string;
  name: string;
  count: number;
};

export type ServiceDiscoveryLevel = {
  id: string;
  code: "ESSENTIAL" | "ADVANCED" | "PREMIUM";
  title: string;
  summary: string;
  indicators: string[];
  escalationSignals: string[];
  estimate: string | null;
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
  levels: ServiceDiscoveryLevel[];
  isFeatured: boolean;
};

export type ServiceDiscoveryGroup = {
  slug: string;
  name: string;
  services: ServiceDiscoveryItem[];
};

export type ServiceNavigatorMicroTask = {
  slug: string;
  title: string;
  summary: string;
  estimate: string | null;
} | null;
