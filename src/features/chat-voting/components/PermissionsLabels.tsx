import { Fragment } from 'react';
import { Box } from '@mui/material';
import TwitchBadge from 'components/TwitchBadge';
import { ChatVoting } from 'features/api/apiTypes';
import { SubTier } from 'features/api/apiConstants';

type Props = {
  permissions: ChatVoting['permissions'];
};

const PermissionsLabels = ({
  permissions: { mod, vip, sub, viewer, subMonthsRequired, subTierRequired },
}: Props) => {
  const badges: { title: string; name: string }[] = [];

  if (mod) badges.push({ title: 'Модеры', name: 'moderator' });
  if (vip) badges.push({ title: 'Випы', name: 'vip' });

  if (sub) {
    let title = '';

    if (subTierRequired === SubTier.Tier1) {
      title = 'Сабы';
    } else if (subTierRequired === SubTier.Tier2) {
      title = 'Сабы (Уровень 2+)';
    } else if (subTierRequired === SubTier.Tier3) {
      title = 'Сабы (Уровень 3)';
    }

    if (subMonthsRequired) title += ` (от ${subMonthsRequired} мес.)`;

    badges.push({ title, name: 'subscriber' });
  }

  if (viewer) badges.push({ title: 'Зрители', name: 'glhf-pledge' });

  return (
    <Box component="span">
      {badges.map(({ title, name }) => (
        <Fragment key={name}>
          <TwitchBadge name={name}>{title}</TwitchBadge>{' '}
        </Fragment>
      ))}
    </Box>
  );
};

export default PermissionsLabels;
