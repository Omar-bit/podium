import { useNavigate } from 'react-router-dom';
import { Team } from '@/data/teams';
import { Calendar, Users, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchTeamById } from '@/services/api';

interface TeamCardProps {
  team: Team;
  index: number;
}

const TeamCard = ({ team, index }: TeamCardProps) => {
  const [teamsMembers, setTeamsMembers] = useState<string[]>([]);
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  useEffect(() => {
    // Simulate fetching team members
    const fetchTeamMembers = async () => {
      const teamDetails = await fetchTeamById(team.id);
      console.log('Fetched members for team', team.id, teamDetails.members);
      setTeamsMembers(teamDetails.members);
    };

    fetchTeamMembers();
  }, []);

  return (
    <article
      onClick={() => navigate(`/team/${team.id}`)}
      className='group relative bg-gradient-card rounded-xl border border-border p-6 cursor-pointer 
                 shadow-card transition-all duration-300 ease-out
                 hover:shadow-card-hover hover:border-primary/30 hover:-translate-y-1
                 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background outline-none'
      style={{ animationDelay: `${index * 100}ms` }}
      role='button'
      tabIndex={0}
      aria-label={`View details for team ${team.name}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate(`/team/${team.id}`);
        }
      }}
    >
      {/* Glow background */}
      <div className='absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-xl overflow-hidden pointer-events-none'>
        <div className='absolute -top-16 -right-16 w-96 h-96 bg-radial-glow' />
      </div>

      {/* Gold accent line */}
      <div className='absolute top-0 left-6 right-6 h-[2px] bg-gradient-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full' />

      {/* Rank badge */}
      <div className='absolute -top-3 -right-3 w-10 h-10 bg-gradient-gold rounded-full flex items-center justify-center shadow-glow opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100'>
        <span className='text-primary-foreground font-bold text-sm'>
          #{team.id}
        </span>
      </div>

      <div className='space-y-4'>
        {/* Team Name */}
        <h3 className='font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300'>
          {team.name}
        </h3>

        {/* Team Info */}
        <div className='space-y-2'>
          <div className='flex items-center gap-2 text-muted-foreground text-sm'>
            <Calendar className='w-4 h-4 text-primary/70' />
            <span>Submitted {formatDate(team.createdAt)}</span>
          </div>
          <div className='flex items-center gap-2 text-muted-foreground text-sm'>
            <Users className='w-4 h-4 text-primary/70' />
            <span>
              {teamsMembers.length > 0
                ? `${teamsMembers.length} members`
                : '...'}
            </span>
          </div>
        </div>

        {/* CTA */}
        <div className='flex items-center gap-1 text-primary text-sm font-medium pt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-1'>
          <span>View Team</span>
          <ChevronRight className='w-4 h-4' />
        </div>
      </div>

      {/* Status Label */}
      <div className='absolute bottom-2 right-2 px-3 py-1 text-xs font-medium rounded-full shadow-md bg-primary/10 text-primary border border-primary/20 backdrop-blur-sm'>
        {team.status === 'en_cours' && 'En cours'}
        {team.status === 'submitted' && 'Submitted'}
      </div>
    </article>
  );
};

export default TeamCard;
