import { useState, useEffect, useMemo, useRef } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Trophy, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Team } from '@/services/api';
import confetti from 'canvas-confetti';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TeamProgress {
  name: string;
  color: string;
  progress: number;
}

interface ChartDataPoint {
  time: string;
  [key: string]: number | string;
}

const REFRESH_DURATION = 10000; // 10 seconds

const TEAM_COLORS = [
  '#22c55e', // Green
  '#ef4444', // Red
  '#3b82f6', // Blue
  '#eab308', // Yellow
  '#a855f7', // Purple
  '#ec4899', // Pink
  '#14b8a6', // Teal
  '#f97316', // Orange
  '#06b6d4', // Cyan
  '#84cc16', // Lime
  '#f59e0b', // Amber
  '#8b5cf6', // Violet
  '#10b981', // Emerald
  '#f43f5e', // Rose
  '#6366f1', // Indigo
];

const RealTimeProgress = ({ existingteams }: { existingteams: any[] }) => {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [teams, setTeams] = useState<any[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const previousLeaderRef = useRef<string | null>(null);

  useEffect(() => {
    // Assign colors to teams based on predefined colors
    const teamsWithColors = existingteams?.map((team, index) => ({
      ...team,
      color: TEAM_COLORS[index % TEAM_COLORS.length],
      progress: Math.random() * 60 + 5, // Start between 5-65 for more variance
    }));
    setTeams(teamsWithColors || []);
  }, [existingteams]);
  useEffect(() => {
    if (!teams || teams.length === 0) return;

    // Initialize chart with first data point
    const initialData: ChartDataPoint = {
      time: formatTime(0),
    };

    teams.forEach((team) => {
      initialData[team.name] = team.progress;
    });

    setChartData([initialData]);

    // Update chart every 2 seconds
    const interval = setInterval(() => {
      setCurrentTime((prevTime) => {
        const newTime = prevTime + 2;

        setChartData((prevData) => {
          const newDataPoint: ChartDataPoint = {
            time: formatTime(newTime),
          };

          // Update each team's progress with random changes
          teams.forEach((team) => {
            const lastValue = prevData[prevData.length - 1][
              team.name
            ] as number;

            // Give selected team a boost (90% chance of positive change vs 40% for others)
            let change;
            if (team.name === selectedTeam) {
              // Selected team gets +4 to +12 points most of the time, rarely -1 to +2
              const isBoost = Math.random() > 0.1; // 90% chance of boost
              change = isBoost
                ? Math.random() * 8 + 4 // +4 to +12
                : Math.random() * 3 - 1; // -1 to +2
            } else {
              // Other teams: -3 to +8 points for more variance
              change = Math.random() * 11 - 3;
            }

            const newValue = Math.max(0, Math.min(100, lastValue + change));
            newDataPoint[team.name] = Number(newValue.toFixed(1));
          });

          // Keep only last 15 data points for better visualization
          const newData = [...prevData, newDataPoint];
          if (newData.length > 15) {
            return newData.slice(-15);
          }
          return newData;
        });

        return newTime;
      });
    }, REFRESH_DURATION); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [teams, selectedTeam]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get top 3 teams by current progress for leaderboard
  const getTopTeams = () => {
    if (chartData.length === 0) return [];

    const latestData = chartData[chartData.length - 1];
    const teamScores = teams
      .map((team) => ({
        name: team.name,
        color: team.color,
        progress: latestData[team.name] as number,
      }))
      .sort((a, b) => b.progress - a.progress);

    return teamScores.slice(0, 3);
  };

  // Get top 10 teams for chart display
  const getTop10Teams = () => {
    if (chartData.length === 0) return teams.slice(0, 10);

    const latestData = chartData[chartData.length - 1];
    const teamScores = teams
      .map((team) => ({
        ...team,
        currentProgress: latestData[team.name] as number,
      }))
      .sort((a, b) => b.currentProgress - a.currentProgress);

    return teamScores.slice(0, 10);
  };

  const topTeams = useMemo(() => getTopTeams(), [chartData, teams]);
  const top10Teams = useMemo(() => getTop10Teams(), [chartData, teams]);

  // Trigger confetti when selected team becomes leader
  useEffect(() => {
    if (!selectedTeam || topTeams.length === 0) return;

    const currentLeader = topTeams[0]?.name;

    // Check if selected team just became the leader
    if (
      currentLeader === selectedTeam &&
      previousLeaderRef.current !== selectedTeam
    ) {
      // Trigger confetti celebration
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
      }, 250);
    }

    previousLeaderRef.current = currentLeader || null;
  }, [topTeams, selectedTeam]);

  return (
    <section
      className='py-16 bg-secondary/30'
      aria-labelledby='realtime-heading'
    >
      <div className='container mx-auto px-4'>
        <div className='text-center mb-12 animate-fade-in'>
          <div className='inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4'>
            <TrendingUp className='w-4 h-4 text-primary' />
            <span className='text-sm font-medium text-primary'>EN DIRECT</span>
          </div>

          <h2
            id='realtime-heading'
            className='font-display text-3xl md:text-4xl font-bold text-foreground mb-4'
          >
            Progression en Temps Réel
          </h2>

          <p className='text-muted-foreground max-w-2xl mx-auto'>
            Suivez la progression des équipes en direct pendant le Challenge de
            la Nuit 2025
          </p>
        </div>

        {/* Team Selector */}
        <div className='max-w-md mx-auto mb-8'>
          <Card
            className={`p-4 backdrop-blur-sm border-2 transition-all duration-500 ${
              selectedTeam && topTeams[0]?.name === selectedTeam
                ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500 shadow-lg shadow-yellow-500/50'
                : 'bg-card/50 border-border'
            }`}
          >
            <div className='space-y-2'>
              <label className='text-sm font-medium text-foreground'>
                🎯 Sélectionnez votre équipe favorite
              </label>
              <Select
                value={selectedTeam || ''}
                onValueChange={setSelectedTeam}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Choisir une équipe...' />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.name}>
                      <div className='flex items-center gap-2'>
                        <div
                          className='w-3 h-3 rounded-full'
                          style={{ backgroundColor: team.color }}
                        />
                        <span>{team.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedTeam && topTeams[0]?.name === selectedTeam ? (
                <div className='flex items-center gap-2 text-sm font-bold text-yellow-500 animate-pulse'>
                  🏆 Votre équipe est en tête ! 🎉
                </div>
              ) : selectedTeam ? (
                <p className='text-xs text-muted-foreground'>
                  🎉 Vous serez notifié quand {selectedTeam} prend la tête !
                </p>
              ) : null}
            </div>
          </Card>
        </div>

        <div className='grid lg:grid-cols-3 gap-6'>
          {/* Chart Section */}
          <div className='lg:col-span-2'>
            <Card className='p-6 bg-card/50 backdrop-blur-sm border-border shadow-lg'>
              <div className='mb-4'>
                <h3 className='font-semibold text-lg text-foreground mb-1'>
                  Graphique de Progression
                </h3>
                <p className='text-sm text-muted-foreground'>
                  Mise à jour toutes les {REFRESH_DURATION} secondes
                </p>
              </div>

              <ResponsiveContainer width='100%' height={400}>
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray='3 3'
                    stroke='#333'
                    opacity={0.2}
                  />
                  <XAxis
                    dataKey='time'
                    stroke='#888'
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis
                    stroke='#888'
                    style={{ fontSize: '12px' }}
                    domain={[0, 100]}
                    label={{
                      value: 'Progression (%)',
                      angle: -90,
                      position: 'insideLeft',
                      style: { fill: '#888' },
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      border: '1px solid #333',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                    formatter={(value: number) => [`${value.toFixed(1)}%`, '']}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} iconType='line' />
                  {top10Teams.map((team) => (
                    <Line
                      key={team.name}
                      type='monotone'
                      dataKey={team.name}
                      stroke={team.color}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                      animationDuration={500}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Leaderboard Section */}
          <div className='space-y-4'>
            <Card className='p-6 bg-card/50 backdrop-blur-sm border-border shadow-lg'>
              <div className='flex items-center gap-2 mb-4'>
                <Trophy className='w-5 h-5 text-primary' />
                <h3 className='font-semibold text-lg text-foreground'>
                  Classement Actuel
                </h3>
              </div>

              <div className='space-y-3'>
                {topTeams.map((team, index) => (
                  <div
                    key={team.name}
                    className='flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors'
                  >
                    {/* Rank */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        index === 0
                          ? 'bg-yellow-500 text-black'
                          : index === 1
                          ? 'bg-gray-300 text-black'
                          : 'bg-amber-600 text-white'
                      }`}
                    >
                      {index + 1}
                    </div>

                    {/* Team Info */}
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center gap-2'>
                        <div
                          className='w-3 h-3 rounded-full'
                          style={{ backgroundColor: team.color }}
                          aria-hidden='true'
                        />
                        <p className='font-medium text-foreground truncate text-sm'>
                          {team.name}
                        </p>
                      </div>
                      <div className='w-full bg-secondary rounded-full h-2 mt-2'>
                        <div
                          className='h-2 rounded-full transition-all duration-500'
                          style={{
                            width: `${team.progress}%`,
                            backgroundColor: team.color,
                          }}
                        />
                      </div>
                    </div>

                    {/* Progress */}
                    <div className='text-right'>
                      <p className='font-bold text-foreground text-sm'>
                        {team.progress?.toFixed(1) || '0.0'}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Stats Card */}
            <Card className='p-6 bg-card/50 backdrop-blur-sm border-border shadow-lg'>
              <h3 className='font-semibold text-lg text-foreground mb-4'>
                Statistiques
              </h3>

              <div className='space-y-3'>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-muted-foreground'>
                    Équipes Actives
                  </span>
                  <span className='font-bold text-primary'>{teams.length}</span>
                </div>

                <div className='flex justify-between items-center'>
                  <span className='text-sm text-muted-foreground'>
                    Temps Écoulé
                  </span>
                  <span className='font-bold text-foreground'>
                    {formatTime(currentTime)}
                  </span>
                </div>

                <div className='flex justify-between items-center'>
                  <span className='text-sm text-muted-foreground'>
                    Leader Actuel
                  </span>
                  <span className='font-bold text-foreground truncate max-w-[120px]'>
                    {topTeams[0]?.name.replace('Team ', '')}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RealTimeProgress;
