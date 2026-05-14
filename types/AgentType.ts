export type Agent = {
  _id: string;
  _creationTime: number;
  config?: any;
  name: string;
  agentId: string;
  published: boolean;
  node?: any;
  edge?: any;
  userId: string;
  agentToolConfig?: any;
}