import { ChatVoting } from 'features/api/apiTypes';
import { OnChatVotingChange } from '../types';
import PermissionsLabels from './PermissionsLabels';
import PermissionsForm from './PermissionsForm';

type Props = {
  permissions: ChatVoting['permissions'];
  canManage: boolean;
  disabled?: boolean;
  onChange: OnChatVotingChange;
};

const Permissions = ({
  permissions,
  canManage,
  disabled = false,
  onChange,
}: Props) =>
  canManage ? (
    <PermissionsForm
      permissions={permissions}
      disabled={disabled}
      onChange={onChange}
    />
  ) : (
    <PermissionsLabels permissions={permissions} />
  );

export default Permissions;
