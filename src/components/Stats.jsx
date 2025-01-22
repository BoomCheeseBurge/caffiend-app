import useAuth from "../hooks/useAuth";
import { calculateCoffeeStats, calculateCurrentCaffeineLevel, coffeeConsumptionHistory, getTopThreeCoffees, statusLevels } from "../utils";

function StatCard(props) {

    const { lg, title, children } = props;
    
    return (
        <div className={"card stat-card " + (lg ? 'col-span-2' : '')}>
            <h4>{title}</h4>
            {children}
        </div>
    );
}

function Stats() {
    
    const { globalData } = useAuth();

    const stats = calculateCoffeeStats(globalData);

    // Calculate the caffeine level 
    const caffeineLevel = calculateCurrentCaffeineLevel(globalData);

    // Determine the caffeine degree based on its level value
    const warningLevel = caffeineLevel < statusLevels['low'].maxLevel ? 'low' :
                            caffeineLevel < statusLevels['moderate'].maxLevel ? 'moderate' : 
                            'high';
    
    return (
        <>
            <div className="section-header">
                <i className="fa-solid fa-chart-simple"></i>
                <h2>Stats</h2>
            </div>

            <div className="stats-grid">
                <StatCard lg title="Active Caffeine Level">
                    <div className="status">
                        <p>
                            <span className="stat-text">{caffeineLevel}</span>mg
                        </p>

                        <h5 style={{color: statusLevels[warningLevel].color, background: statusLevels[warningLevel].background}}>
                            {warningLevel}
                        </h5>
                    </div>
                    <p>{statusLevels[warningLevel].description}</p>
                </StatCard>
                <StatCard title="Daily Caffeine Intake">
                    <p className="stat-text">
                        <span>{stats.daily_caffeine}mg</span>
                    </p>
                </StatCard>
                <StatCard title="Avg # of Caffeine (per day)">
                    <p className="stat-text">
                        <span>{stats.average_coffee_intake}</span>
                    </p>
                </StatCard>
                <StatCard title="Daily Cost ($)">
                    <p className="stat-text">
                        <span>$ {stats.daily_cost}</span>
                    </p>
                </StatCard>
                <StatCard title="Total Cost ($)">
                    <p className="stat-text">
                        <span>$ {stats.total_cost}</span>
                    </p>
                </StatCard>

                <table className="stat-table">
                    <thead>
                        <tr>
                            <th>Coffee Name</th>
                            <th>Number of Purchase</th>
                            <th>Percentage of Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {getTopThreeCoffees(globalData).map((coffee, coffeeIndex) => {

                            return (
                                <tr key={coffeeIndex}>
                                    <td>{coffee.coffeeName}</td>
                                    <td>{coffee.count}</td>
                                    <td>{coffee.percentage}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default Stats;