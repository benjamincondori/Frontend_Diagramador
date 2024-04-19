import { UserCurrent } from "src/app/auth/interfaces/user.interface";
import { DiagramResponse } from "./diagrams-response.interface";

export interface AddCollaboratorResponse {
  newCollaborator: UserCurrent;
  drawing:         DiagramResponse;
}


