import { useEffect } from 'react';
import Head from 'next/head';
import { withMainLayout } from '../hocs/with-main-layout';
import { gtm } from '../lib/gtm';
import { HomeHero } from '../components/home/home-hero';

const Home = () => {
  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  return (
    <>
      <Head>
        <title>
          Didere
        </title>
      </Head>
      <main>
        <HomeHero />
        
      </main>
    </>
  );
};

export default withMainLayout(Home);
