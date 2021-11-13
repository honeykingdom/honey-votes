import { useState } from "react";
import { useRouter } from "next/router";
import { Button, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Layout from "components/Layout";
import PageHeader from "components/PageHeader";
import useChannelLogin from "hooks/useChannelLogin";
import VotingList from "features/voting/components/VotingList";
import VotingFormModal from "features/voting/components/VotingFormModal/VotingFormModal";
import {
  useCreateVotingMutation,
  useMeQuery,
  useUserQuery,
  useVotingListQuery,
} from "features/api/apiSlice";
import { UpdateVotingDto } from "features/api/apiTypes";
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
    channel.isSuccess && me.isSuccess && channel.data?.id === me.data?.id;

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
      <PageHeader
        title={username ? `${username} - Голосование` : "Голосование"}
        pageTitle="Голосование"
        breadcrumbs={[
          { title: username, href: `/${login}` },
          { title: "Голосование" },
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
