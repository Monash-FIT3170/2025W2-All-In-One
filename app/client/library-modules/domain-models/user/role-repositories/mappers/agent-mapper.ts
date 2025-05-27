import { Agent } from "../../Agent";
import { ApiAgent } from "/app/shared/api-models/user/api-roles/ApiAgent";

export function mapApiAgentToAgent(agent: ApiAgent): Agent {
    return {
        agentId: agent.agentId,
        userAccountId: agent.userAccountId,
        tasks: agent.tasks,
        createdAt: agent.createdAt.toISOString(),
        agentCode: agent.agentCode,
        profileDataId: agent.profileDataId,
    };
}
