import { mapApiAgentToAgent } from "./mappers/agent-mapper";
import { apiGetAgent } from "../../../apis/user/user-role-api";
import { Agent } from "../Agent";

export async function getAgentById(id: string): Promise<Agent> {
    const apiAgent = await apiGetAgent(id);
    const mappedUserAccount = mapApiAgentToAgent(apiAgent);

    return mappedUserAccount;
}

export async function apiGetPropertyByAgentId(agentId: string): Promise<Agent> {
  return await Meteor.callAsync(MeteorMethodIdentifier.PROPERTY_GET_BY_AGENT_ID, agentId);
}