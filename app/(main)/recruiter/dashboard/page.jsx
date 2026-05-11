'use client';
import React from 'react';
import WelcomeContainer from './_components/WelcomeContainer';
import CreateOptions from './_components/CreateOptions';
import LatestinterviewsList from './_components/LatestinterviewsList';
import CreditsDisplay from './_components/CreditsDisplay';

function Dashboard() {

  return (
    
    <div>
      {/* {<WelcomeContainer /> */}
      <h2 className='my-3 font-bold text-2xl'>Dashboard</h2>
      <CreditsDisplay />
      <CreateOptions />
      <LatestinterviewsList />
    </div>
  );
}

export default Dashboard;
