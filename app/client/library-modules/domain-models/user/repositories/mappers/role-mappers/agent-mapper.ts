import { Agent } from "../../../Agent";
import { ApiAgent } from "/app/shared/api-models/user/api-roles/ApiAgent";

export function mapApiAgentToAgent(agent: ApiAgent): Agent {
  return {
    agentId: agent.agentId, 
    userId: agent.userId,
    firstName: agent.firstName,
    lastName: agent.lastName,
    email: agent.email,
    agentCode: agent.agentCode,
    createdAt: agent.createdAt,
  };
}