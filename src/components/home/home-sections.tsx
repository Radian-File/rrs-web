export type HomeProject = {
  id: string;
  title: string;
  summary: string;
  category: string;
  technologies: string[];
  coverImageUrl: string | null;
  liveUrl: string | null;
  repositoryUrl: string | null;
};

export type HomeService = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  estimate: string;
  deliveryEstimate: string | null;
  technologies: string[];
};

export type HomeReview = {
  id: string;
  comment: string;
  overallRating: number;
  clientName: string;
  projectTitle: string;
};
