import React from "react";
import { MessagesPage } from "./MessagePage";
import { Role } from "../../../shared/user-role-identifier";

export function TenantMessagePage(): React.JSX.Element {
  return <MessagesPage role={Role.TENANT} />;
}
