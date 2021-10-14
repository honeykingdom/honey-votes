import { Fragment } from "react";
import Badge from "components/Badge";
import { ChatVoting } from "features/api/types";
import { Box } from "@mui/material";

type Props = {
  restrictions: ChatVoting["restrictions"];
};

const RestrictionLabels = ({
  restrictions: {
    mod,
    vip,
    subTier1,
    subTier2,
    subTier3,
    viewer,
    subMonthsRequired,
  },
}: Props) => {
  const badges: { title: string; name: string }[] = [];

  if (mod) badges.push({ title: "Модеры", name: "moderator" });
  if (vip) badges.push({ title: "Випы", name: "vip" });

  if (subTier1 || subTier2 || subTier3) {
    let title: string;

    if (subTier1) {
      title = "Сабы";
    } else if (subTier2) {
      title = "Сабы (Уровень 2+)";
    } else if (subTier3) {
      title = "Сабы (Уровень 3)";
    }

    if (subMonthsRequired) title += ` (от ${subMonthsRequired} мес.)`;

    badges.push({ title, name: "subscriber" });
  }

  if (viewer) badges.push({ title: "Зрители", name: "glitchcon2020" });

  return (
    <Box component="span">
      {badges.map(({ title, name }) => (
        <Fragment key={name}>
          <Badge name={name}>{title}</Badge>{" "}
        </Fragment>
      ))}
    </Box>
  );
};

export default RestrictionLabels;
