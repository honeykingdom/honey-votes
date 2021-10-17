import { ChatVoting } from "features/api/types";
import { OnChatVotingChange } from "../types";
import RestrictionLabels from "./RestrictionLabels";
import RestrictionsForm from "./RestrictionsForm";

type Props = {
  restrictions: ChatVoting["restrictions"];
  canManage: boolean;
  disabled?: boolean;
  onChange: OnChatVotingChange;
};

const Restrictions = ({
  restrictions,
  canManage,
  disabled = false,
  onChange,
}: Props) => {
  return canManage ? (
    <RestrictionsForm
      restrictions={restrictions}
      disabled={disabled}
      onChange={onChange}
    />
  ) : (
    <RestrictionLabels restrictions={restrictions} />
  );
};

export default Restrictions;
