import HeaderBox from '@/components/HeaderBox'
import RightSidebar from '@/components/RightSidebar';
import TotalBalanceBox from '@/components/TotalBalanceBox';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import React from 'react'

const Home = async () => {
  const logged_in = await getLoggedInUser();
  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox 
          type="greeting"
          title="Welcome"
          user={logged_in?.name || 'Guest'}
          subtext="Access your account information and make transactions."
          />
          <TotalBalanceBox 
          accounts={[{id: 1, name: "Bank of America", balance: 125000.0}]}
          totalBanks={1}
          totalBalance={125000.0}
          />
        </header>
        
      </div>
      <RightSidebar
      user={logged_in}
      transactions={[]}
      banks={[{currentBalance: 1000.00},{currentBalance: 2300.00}]} />
    </section>
  )
}

export default Home
