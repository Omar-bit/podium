import TeamCard from "@/components/TeamCard";
import { Trophy, Sparkles } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { fetchTeams, fetchTeamById, Team } from "@/services/api";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    const loadTeams = async () => {
      try {
        setIsLoading(true);
        const data = await fetchTeams();
        setTeams(data);
        setError(null);

        // Start lazy loading member counts in the background
        setLoadingDetails(true);
        loadTeamDetails(data);
      } catch (err) {
        setError("Impossible de charger les équipes. Veuillez réessayer plus tard.");
        console.error("Failed to fetch teams:", err);
      } finally {
        setIsLoading(false);
      }
    };

    const loadTeamDetails = async (initialTeams: Team[]) => {
      const BATCH_SIZE = 10; // Load 10 teams at a time
      const teamIds = initialTeams.map(t => t.id);

      for (let i = 0; i < teamIds.length; i += BATCH_SIZE) {
        const batch = teamIds.slice(i, i + BATCH_SIZE);

        // Fetch this batch in parallel
        const batchPromises = batch.map(async (id) => {
          try {
            const teamDetails = await fetchTeamById(id);
            return teamDetails;
          } catch (error) {
            console.error(`Failed to fetch team ${id}:`, error);
            return null;
          }
        });

        const batchResults = await Promise.all(batchPromises);

        // Update teams with fetched details
        setTeams(prevTeams => {
          const updatedTeams = [...prevTeams];
          batchResults.forEach(teamDetail => {
            if (teamDetail) {
              const index = updatedTeams.findIndex(t => t.id === teamDetail.id);
              if (index !== -1) {
                updatedTeams[index] = teamDetail;
              }
            }
          });
          return updatedTeams;
        });

        // Small delay between batches to avoid overwhelming the API
        if (i + BATCH_SIZE < teamIds.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      setLoadingDetails(false);
    };

    loadTeams();
  }, []);

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Skip link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
                   focus:bg-white focus:text-black focus:p-3 focus:rounded-lg"
      >
        Skip to main content
      </a>

      {/* Hero Section */}
      <header className="relative overflow-hidden" role="banner">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute top-40 right-20 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col items-center text-center space-y-6 animate-fade-in">
            {/* Trophy icon */}
            <div className="relative" aria-hidden="true">
              <div className="w-20 h-20 bg-gradient-gold rounded-2xl flex items-center justify-center shadow-glow rotate-3 hover:rotate-0 transition-transform duration-500">
                <Trophy className="w-10 h-10 text-primary-foreground" />
              </div>
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-primary animate-pulse" />
            </div>

            {/* Title */}
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="text-foreground">Défi de la nuit </span>
              <br />
              <span className="text-gradient-gold">2025</span>
            </h1>

            {/* Description */}
            <p className="max-w-2xl text-muted-foreground text-lg md:text-xl leading-relaxed">
              Bienvenue sur la plateforme officielle du Challenge MIAGE Paris ! Les équipes s'affrontent pour présenter
              leurs solutions innovantes, leur excellence technique et l'intégration des bonnes pratiques
              d'accessibilité (WCAG). Découvrez les équipes participantes, explorez leurs soumissions
              et soyez témoin de l'avenir de l'innovation technologique.
            </p>

            {/* Stats */}
            <dl className="flex items-center gap-8 pt-4">
              <div className="text-center">
                <dt className="sr-only">Nombre d'équipes</dt>
                <dd className="font-display text-3xl font-bold text-primary">{teams.length}</dd>
                <div className="text-muted-foreground text-sm" aria-hidden="true">Équipes</div>
              </div>
              <div className="w-px h-12 bg-border" role="presentation" />
              <div className="text-center">
                <dt className="sr-only">Defis</dt>
                <dd className="font-display text-3xl font-bold text-primary">42</dd>
                <div className="text-muted-foreground text-sm" aria-hidden="true">Defis</div>
              </div>
              <div className="w-px h-12 bg-border" role="presentation" />
              <div className="text-center">
                <dt className="sr-only">Année de l'édition</dt>
                <dd className="font-display text-3xl font-bold text-primary">2025</dd>
                <div className="text-muted-foreground text-sm" aria-hidden="true">Édition</div>
              </div>
            </dl>
          </div>
        </div>
      </header>

      {/* Teams Grid Section */}
      <main id="main-content" className="container mx-auto px-4 pb-20" tabIndex={-1} role="main">
        <section aria-labelledby="teams-heading">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <h2 id="teams-heading" className="font-display text-2xl md:text-3xl font-bold text-foreground">
              Équipes Participantes
            </h2>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
              <Input
                type="search"
                placeholder="Rechercher une équipe..."
                className="pl-9 bg-secondary/50 border-border focus-visible:ring-2 focus-visible:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Rechercher des équipes par nom"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" role="status">
                <span className="sr-only">Chargement des équipes...</span>
              </div>
              <p className="text-muted-foreground text-lg mt-4">Chargement des équipes...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 text-lg">{error}</p>
            </div>
          ) : filteredTeams.length > 0 ? (
            <Carousel
              opts={{ align: "start", loop: true }}
              className="w-full"
              aria-label="Team carousel"
            >
              <CarouselContent className="-ml-4">
                {filteredTeams.map((team, index) => (
                  <CarouselItem
                    key={team.id}
                    className="pl-4 md:basis-1/2 lg:basis-1/3"
                    role="group"
                    aria-label={`Team ${team.name}, position ${index + 1}`}
                  >
                    <div className="p-1">
                      <TeamCard team={team} index={index} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Carousel Controls */}
              <div className="hidden md:flex justify-between mt-4">
                <CarouselPrevious aria-label="Équipe précédente" />
                <CarouselNext aria-label="Équipe suivante" />
              </div>
            </Carousel>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">Aucune équipe trouvée pour "{searchQuery}"</p>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8" role="contentinfo">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            © 2025 Challenge MIAGE Paris. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
