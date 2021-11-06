import { useRouter } from "next/router";

const useVotingId = () => {
  const router = useRouter();
  const votingIdText = router.query.votingId as string;

  if (!votingIdText) return null;

  return Number.parseInt(votingIdText);
};

export default useVotingId;
