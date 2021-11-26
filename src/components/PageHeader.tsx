import React from 'react';
import Head from 'next/head';
import { Box, Divider, Typography } from '@mui/material';
import Breadcrumbs from './Breadcrumbs';

type Props = {
  title: string;
  pageTitle: string | React.ReactNode;
  breadcrumbs: Parameters<typeof Breadcrumbs>[0]['items'];
};

const PageHeader = ({ title, pageTitle, breadcrumbs }: Props) => {
  return (
    <>
      <Head>
        <title>{`${title} | HoneyVotes`}</title>
      </Head>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography component="div" variant="h4">
          {pageTitle}
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Breadcrumbs items={breadcrumbs} />
      </Box>

      <Divider sx={{ mb: 2 }} />
    </>
  );
};

export default PageHeader;
