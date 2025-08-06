import { mapApiAgentToAgent } from "./mappers/agent-mapper";
import { apiGetAgent } from "../../../apis/user/user-role-api";
import { Agent } from "../Agent";
export async function getAgentById(id: string): Promise<Agent> {
    const apiAgent = await apiGetAgent(id);
    const mappedUserAccount = mapApiAgentToAgent(apiAgent);

    return mappedUserAccount;
}
