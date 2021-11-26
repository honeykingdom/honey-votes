import { UpdateChatVotingDto } from 'features/api/apiTypes';

export type OnChatVotingChange = (data: UpdateChatVotingDto) => void;
