import type { TFunction } from 'react-i18next';
import { SubTier } from 'features/api/apiConstants';
import { Voting } from 'features/api/apiTypes';
import type { Badge } from '../components/UserBadges';

type Mode = 'canVote' | 'canAddOptions';

const SUB_TIER: Record<Mode, keyof Omit<Voting['permissions']['sub'], Mode>> = {
  canVote: 'subTierRequiredToVote',
  canAddOptions: 'subTierRequiredToAddOptions',
};

const MINUTES_FOLLOWED: Record<
  Mode,
  keyof Omit<Voting['permissions']['follower'], Mode>
> = {
  canVote: 'minutesToFollowRequiredToVote',
  canAddOptions: 'minutesToFollowRequiredToAddOptions',
};

const T_OPTIONS = { ns: 'common' };

const getVotingPermissionsBadges = (
  { mod, vip, sub, follower, viewer }: Voting['permissions'],
  mode: Mode,
  t: TFunction,
): Badge[] => {
  const badges: Badge[] = [];

  if (viewer[mode]) {
    badges.push({
      title: t('userType.all', T_OPTIONS),
      name: 'glhf-pledge',
    });

    return badges;
  }

  if (mod[mode])
    badges.push({
      title: t('userType.mod_many', T_OPTIONS),
      name: 'moderator',
    });

  if (vip[mode]) {
    badges.push({ title: t('userType.vip_many', T_OPTIONS), name: 'vip' });
  }

  if (sub[mode]) {
    const requiredTier = sub[SUB_TIER[mode]];
    let title = '';
    let version = '0';

    if (requiredTier === SubTier.Tier1) {
      title = t('userType.sub_many', T_OPTIONS);
    } else if (requiredTier === SubTier.Tier2) {
      const tier = t('subTier.2', T_OPTIONS);

      title = `${t('userType.sub_many', T_OPTIONS)} (${tier}+)`;
      version = '2000';
    } else if (requiredTier === SubTier.Tier3) {
      const tier = t('subTier.3', T_OPTIONS);

      title = `${t('userType.sub_many', T_OPTIONS)} (${tier} 3)`;
      version = '3000';
    }

    badges.push({ title, name: 'subscriber', version });
  }

  if (follower[mode]) {
    const requiredMinutes = follower[MINUTES_FOLLOWED[mode]];
    const requiredMinutesText = t(`followedTime.${requiredMinutes}`, T_OPTIONS);
    const title = requiredMinutesText
      ? `${t('userType.follower_many', T_OPTIONS)} (${requiredMinutesText}+)`
      : t('userType.follower_many', T_OPTIONS);

    badges.push({ title, name: 'glitchcon2020' });
  }

  return badges;
};

export default getVotingPermissionsBadges;
