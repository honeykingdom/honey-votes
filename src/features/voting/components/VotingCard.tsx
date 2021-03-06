import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Typography,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { format } from 'date-fns';
import { Voting } from 'features/api/apiTypes';
import VotingActions from './VotingActions';

const formatDate = (date: string) => format(new Date(date), 'PPp');

type Props = {
  voting: Voting;
  canManage: boolean;
  href: string;
};

const VotingCard = ({ voting, canManage, href }: Props) => {
  const [t] = useTranslation('voting');
  const { title, description, canManageVotes, createdAt } = voting;

  const renderClosed = () => (
    <Typography
      component="span"
      color="text.secondary"
      display="flex"
      alignItems="center"
      sx={{ mr: 1 }}
    >
      <LockIcon />
    </Typography>
  );

  const renderNoTitle = () => (
    <Typography
      component="span"
      variant="h5"
      color="text.secondary"
      fontStyle="italic"
      fontWeight="300"
    >
      {t('noTitle', { ns: 'common' })}
    </Typography>
  );

  return (
    <Card>
      <Link href={href} passHref>
        <CardActionArea>
          <CardContent>
            <Typography
              gutterBottom
              variant="h5"
              component="h2"
              display="flex"
              alignItems="center"
              sx={{ flexGrow: 1 }}
            >
              {!canManageVotes && renderClosed()}
              {title || renderNoTitle()}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {formatDate(createdAt)}
            </Typography>
            {description && (
              <Typography variant="subtitle1">{description}</Typography>
            )}
          </CardContent>
        </CardActionArea>
      </Link>
      {canManage && (
        <CardActions sx={{ display: 'block' }}>
          <VotingActions voting={voting} />
        </CardActions>
      )}
    </Card>
  );
};

export default VotingCard;
