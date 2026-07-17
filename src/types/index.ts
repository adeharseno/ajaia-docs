export type CurrentUser = {
  id: string;
  email: string;
  name: string;
};

export type DocumentSummary = {
  id: string;
  title: string;
  updatedAt: string;
  owner?: { name: string };
};

export type DocumentDetail = {
  id: string;
  title: string;
  content: object;
  ownerId: string;
  isOwner: boolean;
  updatedAt: string;
};
