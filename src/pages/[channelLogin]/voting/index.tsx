import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Layout from 'components/Layout';
import PageHeader from 'components/PageHeader';
import TwitchUsername from 'components/TwitchUsername';
import useChannelLogin from 'hooks/useChannelLogin';
import useUsername from 'hooks/useUsername';
import VotingList from 'features/voting/components/VotingList';
import VotingFormModal from 'features/voting/components/VotingFormModal/VotingFormModal';
import {
  useCreateVotingMutation,
  useMeQuery,
  useUserQuery,
  useVotingListQuery,
} from 'features/api/apiSlice';
import { UpdateVotingDto } from 'features/api/apiTypes';
import getErrorMessage from 'features/api/utils/getErrorMessage';

const VotingListPage = () => {
  const router = useRouter();
  const login = useChannelLogin();
  const username = useUsername();

  const { enqueueSnackbar } = useSnackbar();

  const channel = useUserQuery({ login: login! }, { skip: !login });
  const me = useMeQuery();
  const votingList = useVotingListQuery(channel.data?.id as string, {
    skip: !channel.data,
  });
  const [createVoting] = useCreateVotingMutation();

  const canManage =
    channel.isSuccess && me.isSuccess && channel.data?.id === me.data?.id;

  const [isVotingFormOpened, setIsVotingFormOpened] = useState(false);

  const toggleVotingForm = () => setIsVotingFormOpened((v) => !v);

  const handleCreateVoting = async (body: UpdateVotingDto) => {
    if (!channel.data) return;

    try {
      const newVoting = await createVoting({
        channelId: channel.data.id,
        ...body,
      }).unwrap();

      enqueueSnackbar('Голосование успешно создано', { variant: 'success' });

      router.push(`/${login}/voting/${newVoting.id}`);
    } catch (e) {
      enqueueSnackbar(getErrorMessage(e) || 'Не удалось создать голосование', {
        variant: 'error',
      });
    }
  };

  return (
    <Layout>
      <PageHeader
        title={username ? `${username} - Голосование` : 'Голосование'}
        pageTitle="Голосование"
        breadcrumbs={[
          {
            title: (
              <TwitchUsername
                username={username}
                avatarUrl={channel.data?.avatarUrl}
              />
            ),
            href: `/${login}`,
          },
          { title: 'Голосование' },
        ]}
      />

      {canManage && (
        <Box sx={{ my: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={toggleVotingForm}
          >
            Создать голосование
          </Button>
        </Box>
      )}

      {votingList.isSuccess && (
        <VotingList
          canManage={canManage}
          votingList={votingList.data}
          channelLogin={login || ''}
        />
      )}

      <VotingFormModal
        open={isVotingFormOpened}
        title="Создать голосование"
        cancelButtonText="Отмена"
        submitButtonText="Создать"
        onClose={toggleVotingForm}
        onSubmit={handleCreateVoting}
      />
    </Layout>
  );
};

export default VotingListPage;
