import React from "react";
import { MessagesPage } from "./MessagePage";
import { Role } from "../../../shared/user-role-identifier";

export function LandlordMessagePage(): React.JSX.Element {
  return <MessagesPage role={Role.LANDLORD}/>;
} 