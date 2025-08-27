import { mapApiAgentToAgent } from "./mappers/agent-mapper";
import { apiGetAgent, apiGetAgentbyId } from "../../../apis/user/user-role-api";
import { Agent } from "../Agent";
export async function getAgentById(id: string): Promise<Agent> { // change name 
    // console.log('getAgentById called with:', id);
    const apiAgent = await apiGetAgent(id);
    // console.log('API response:', apiAgent);
    const mappedUserAccount = mapApiAgentToAgent(apiAgent);
    return mappedUserAccount;
}

export async function getAgentByAgentId(id: string): Promise<Agent> { // change name 
    // console.log('getAgentById called with:', id);
    const apiAgent = await apiGetAgentbyId(id);
    // console.log('API response:', apiAgent);
    const mappedUserAccount = mapApiAgentToAgent(apiAgent);
    return mappedUserAccount;
}
