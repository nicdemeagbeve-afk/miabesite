interface RelatedApplication {
  platform: string;
  url?: string;
  id?: string;
  version?: string;
}

interface Navigator {
  getInstalledRelatedApps?: () => Promise<RelatedApplication[]>;
}
