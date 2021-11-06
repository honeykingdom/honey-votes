import { ChatVoting } from "features/api/types";
import { OnChatVotingChange } from "../types";
import PermissionsLabels from "./PermissionsLabels";
import PermissionsForm from "./PermissionsForm";

type Props = {
  permissions: ChatVoting["permissions"];
  canManage: boolean;
  disabled?: boolean;
  onChange: OnChatVotingChange;
};

const Permissions = ({
  permissions,
  canManage,
  disabled = false,
  onChange,
}: Props) => {
  return canManage ? (
    <PermissionsForm
      permissions={permissions}
      disabled={disabled}
      onChange={onChange}
    />
  ) : (
    <PermissionsLabels permissions={permissions} />
  );
};

export default Permissions;
