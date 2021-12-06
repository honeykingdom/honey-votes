import { TFunction } from 'react-i18next';
import { SubTier } from 'features/api/apiConstants';
import { User, UserRoles } from 'features/api/apiTypes';
import type { Badge } from '../components/UserBadges';

const T_OPTIONS = { ns: 'common' };

const getMeBadges = (me: User, meRoles: UserRoles, t: TFunction): Badge[] => {
  const badges: Badge[] = [];

  if (!me || !meRoles) return badges;

  if (meRoles.broadcaster) {
    badges.push({
      name: 'broadcaster',
      title: t('userType.broadcaster', T_OPTIONS),
    });
  }

  if (meRoles.editor) {
    badges.push({ name: 'moderator', title: t('userType.editor', T_OPTIONS) });
  }

  if (meRoles.mod) {
    badges.push({ title: t('userType.mod_one', T_OPTIONS), name: 'moderator' });
  }

  if (meRoles.vip) {
    badges.push({ title: t('userType.vip_one', T_OPTIONS), name: 'vip' });
  }

  if (meRoles.sub) {
    let title = t('userType.sub_one', T_OPTIONS);
    let version = '0';

    if (meRoles.subTier === SubTier.Tier2) {
      const tier = t(`subTier.${meRoles.subTier}`, T_OPTIONS);

      title = `${t('userType.sub_one', T_OPTIONS)} (${tier})`;
      version = '2000';
    }

    if (meRoles.subTier === SubTier.Tier2) {
      const tier = t(`subTier.${meRoles.subTier}`, T_OPTIONS);

      title = `${t('userType.sub_one', T_OPTIONS)} (${tier} 3)`;
      version = '3000';
    }

    badges.push({ title, name: 'subscriber', version });
  }

  if (meRoles.follower) {
    badges.push({
      title: t('userType.follower_one', T_OPTIONS),
      name: 'glitchcon2020',
    });
  }

  return badges;
};

export default getMeBadges;
