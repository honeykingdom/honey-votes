import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Typography, Button, Tooltip, Box, Divider } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import InfoIcon from "@mui/icons-material/Info";
import Layout from "components/Layout";
import Breadcrumbs from "components/Breadcrumbs";
import useChannelLogin from "hooks/useChannelLogin";
import VotingList from "features/voting/components/VotingList";
import VotingFormModal from "features/voting/components/VotingFormModal/VotingFormModal";
import {
  useCreateVotingMutation,
  useMeQuery,
  useUserQuery,
  useVotingListQuery,
} from "features/api/apiSlice";
import { UpdateVotingDto } from "features/api/types";
import useSnackbar from "features/snackbar/useSnackbar";

const VotingListPage = () => {
  const router = useRouter();
  const login = useChannelLogin();

  const snackbar = useSnackbar();

  const channel = useUserQuery({ login }, { skip: !login });
  const me = useMeQuery();
  const votingList = useVotingListQuery(channel.data?.id, {
    skip: !channel.data,
  });
  const [createVoting] = useCreateVotingMutation();

  const username = channel.data?.displayName || login;

  const canManage =
    channel.isSuccess && me.isSuccess && channel.data.id === me.data.id;

  const [isVotingFormOpened, setIsVotingFormOpened] = useState(false);

  const toggleVotingForm = () => setIsVotingFormOpened((v) => !v);

  const handleCreateVoting = async (body: UpdateVotingDto) => {
    const newVoting = await createVoting({
      channelId: channel.data.id,
      ...body,
    });

    // @ts-expect-error
    if (newVoting.error) {
      snackbar({
        message: "Не удалось создать голосование",
        variant: "error",
      });
    } else {
      snackbar({
        message: "Голосование успешно создано",
        variant: "success",
      });
    }

    // TODO:
    // @ts-expect-error
    if (newVoting.data) {
      // @ts-expect-error
      router.push(`/${login}/voting/${newVoting.data.id}`);
    }
  };

  return (
    <Layout>
      <Head>
        <title>
          {username
            ? `${username} - Голосование | HoneyVotes`
            : "Голосование | HoneyVotes"}
        </title>
      </Head>

      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Typography component="div" variant="h4">
          Голосование
        </Typography>
        <Tooltip
          title={
            <>
              Зрители могут предлагать свои варианты для голосования. <br />
              Стример может разрешить голосование только подписчикам или
              пользователям, которые зафоловлены на канал.
            </>
          }
        >
          <InfoIcon sx={{ ml: 2 }} />
        </Tooltip>
      </Box>

      {channel && (
        <Box sx={{ mb: 2 }}>
          <Breadcrumbs
            items={[
              { title: username, href: `/${login}` },
              { title: "Голосование" },
            ]}
          />
        </Box>
      )}

      <Divider sx={{ mb: 2 }} />

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
          channelLogin={login}
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
