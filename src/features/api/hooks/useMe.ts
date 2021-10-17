import { useMemo } from "react";
import { useMeQuery, useMeRolesQuery } from "../apiSlice";
import { User, UserRoles } from "../types";

type Me = (User & { roles: UserRoles }) | null;

/** @deprecated */
const useMe = (channelId: string): [me: Me, isLoading: boolean] => {
  const { data: me, isLoading: isMeLoading } = useMeQuery();
  const { data: meRoles, isLoading: isMeRolesLoading } = useMeRolesQuery(
    channelId,
    { skip: !channelId || !me }
  );

  const user: Me = useMemo(() => {
    if (!me || !meRoles) return null;

    return { ...me, roles: meRoles };
  }, [me, meRoles]);

  return [user, isMeLoading || isMeRolesLoading];
};

export default useMe;
