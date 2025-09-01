import { mapApiAgentToAgent } from "./mappers/agent-mapper";
import { apiGetAgent, apiGetAgentbyId } from "../../../apis/user/user-role-api";
import { Agent } from "../Agent";
export async function getAgentById(id: string): Promise<Agent> {
    const apiAgent = await apiGetAgent(id);
    const mappedUserAccount = mapApiAgentToAgent(apiAgent);
    return mappedUserAccount;
}

export async function getAgentByAgentId(id: string): Promise<Agent> { // change name 
    const apiAgent = await apiGetAgentbyId(id);
    const mappedUserAccount = mapApiAgentToAgent(apiAgent);
    return mappedUserAccount;
}
