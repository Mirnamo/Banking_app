"use client";
import AnimatedCounter from "@/components/AnimatedCounter";
import LineChart  from "@/components/LineChart";

interface TotalBalanceBoxProps {
    accounts: { id: number; name: string; balance: number }[];
    totalBanks: number;
    totalBalance: number;
}

function TotalBalanceBox({ accounts = [], totalBanks, totalBalance }: TotalBalanceBoxProps) {
    return (
        <section className="total-balance">
            <div className="total-balance-chart">
            <LineChart accounts={accounts}/>
            </div>
            <div className="flex flex-col gap-6">
                <h2 className="header-2">
                    Connected bank accounts: {totalBanks}
                </h2>
                <div className="flex flex-col gap-2">
                    <p className="total-balance-label flex-center">
                        Total Current Balance
                    </p>
                    <p className="total-balance-amount flex-center gap-2">
                        $<AnimatedCounter amount={totalBalance} />
                    </p>
                </div>
            </div>
        </section>
    );
}

export default TotalBalanceBox
