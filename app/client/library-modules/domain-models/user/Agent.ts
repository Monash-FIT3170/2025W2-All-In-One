export type Agent = {
  agentId: string; 
  userAccountId: string; 
  firstName: string;
  lastName: string;
  email: string;
  agentCode: string;
  createdAt: string; // FIX FOR REDUX ERRORS NOT ACCEPTING DATE BUT ONLY STRING
}