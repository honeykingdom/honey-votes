import NextLink from 'next/link';
import { Breadcrumbs as MuiBreadcrumbs, Link, Typography } from '@mui/material';

type Breadcrumb = {
  title: string | React.ReactNode;
  href?: string;
};

type Props = {
  items: Breadcrumb[];
};

const Breadcrumbs = ({ items }: Props) => (
  <MuiBreadcrumbs aria-label="breadcrumb">
    {items.map(({ title, href }, key) =>
      href ? (
        <NextLink href={href} passHref key={key}>
          <Link underline="hover" color="inherit">
            {title}
          </Link>
        </NextLink>
      ) : (
        <Typography color="text.primary" key={key}>
          {title}
        </Typography>
      ),
    )}
  </MuiBreadcrumbs>
);

export default Breadcrumbs;
