import { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
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
import getErrorMessageKey from 'features/api/utils/getErrorMessageKey';

const VotingListPage = () => {
  const [t] = useTranslation(['voting', 'common']);
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

      enqueueSnackbar(t('message.votingCreateSuccess'), { variant: 'success' });

      router.push(`/${login}/voting/${newVoting.id}`);
    } catch (e) {
      enqueueSnackbar(
        t([`message.${getErrorMessageKey(e)}`, 'message.votingCreateFailure']),
        { variant: 'error' },
      );
    }
  };

  return (
    <Layout>
      <PageHeader
        title={username ? `${username} - ${t('title')}` : t('title')}
        pageTitle={t('title')}
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
          { title: t('title') },
        ]}
      />

      {canManage && (
        <Box sx={{ my: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={toggleVotingForm}
          >
            {t('createVoting')}
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
        title={t('createVoting')}
        cancelButtonText={t('cancel', { ns: 'common' })}
        submitButtonText={t('create', { ns: 'common' })}
        onClose={toggleVotingForm}
        onSubmit={handleCreateVoting}
      />
    </Layout>
  );
};

export default VotingListPage;
