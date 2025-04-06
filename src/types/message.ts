
export interface Message {
  text: string;
  isUser: boolean;
  agent_name?: string;
}

export interface BackendResponse {
  output: string;
  agent_name?: string;
}
