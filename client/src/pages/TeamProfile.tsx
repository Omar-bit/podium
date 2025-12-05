import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Users, User, Trophy, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { fetchTeamById, Team } from "@/services/api";


const TeamProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [team, setTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTeam = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await fetchTeamById(id);
        setTeam(data);
        setError(null);
      } catch (err) {
        setError("Impossible de charger l'équipe. Veuillez réessayer plus tard.");
        console.error("Failed to fetch team:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTeam();
  }, [id]);

  if (isLoading) {
    return (
      <main
        role="main"
        className="min-h-screen bg-gradient-hero flex items-center justify-center p-4"
      >
        <div className="text-center space-y-4 animate-fade-in">
          <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" role="status">
            <span className="sr-only">Chargement de l'équipe...</span>
          </div>
          <p className="text-muted-foreground text-lg">Chargement de l'équipe...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main
        role="main"
        className="min-h-screen bg-gradient-hero flex items-center justify-center p-4"
      >
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="font-display text-3xl font-bold text-foreground">
            Erreur
          </h1>
          <p className="text-red-500">{error}</p>
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="mt-4 focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Retour à la page d'accueil"
          >
            <ArrowLeft aria-hidden="true" className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Button>
        </div>
      </main>
    );
  }

  if (!team) {
    return (
      <main
        role="main"
        className="min-h-screen bg-gradient-hero flex items-center justify-center p-4"
      >
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="font-display text-3xl font-bold text-foreground">
            Équipe non trouvée
          </h1>
          <p className="text-muted-foreground">
            L'équipe que vous cherchez n'existe pas.
          </p>
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="mt-4 focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Retour à la page d'accueil"
          >
            <ArrowLeft aria-hidden="true" className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Button>
        </div>
      </main>
    );
  }

  const teamDefis = team.defis || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-gradient-hero relative" role="main">
      {/* Skip navigation for screen readers & keyboard */}
      <a
        href="#team-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
                focus:bg-white focus:text-black focus:p-3 focus:rounded-lg"
      >
        Aller au contenu
      </a>

      {/* Background decorations - hidden from screen readers */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-20 w-72 h-72 bg-primary/3 rounded-full blur-3xl" />
      </div>

      <div id="team-content" className="relative container mx-auto px-4 py-8 md:py-12">
        {/* Back button */}
        <Button
          onClick={() => navigate("/")}
          variant="ghost"
          className="mb-8 text-muted-foreground hover:text-foreground hover:bg-secondary 
                     focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Retour à la page d'accueil"
        >
          <ArrowLeft aria-hidden="true" className="w-4 h-4 mr-2" />
          Retour à l'accueil
        </Button>

        <article className="max-w-3xl mx-auto" aria-labelledby="team-name">
          {/* Team header card */}
          <section
            className="bg-gradient-card rounded-2xl border border-border p-8 shadow-card animate-fade-in"
            role="region"
            aria-label="Informations de l'équipe"
          >
            <div className="flex items-start gap-6">
              <div
                className="w-20 h-20 bg-gradient-gold rounded-xl flex items-center justify-center shadow-glow flex-shrink-0"
                aria-hidden="true"
              >
                <Trophy className="w-10 h-10 text-primary-foreground" />
              </div>

              <div className="flex-1 min-w-0">
                <span
                  className="inline-block px-3 py-1 bg-secondary rounded-full text-xs text-primary font-medium mb-2"
                  aria-label={`Identifiant de l'équipe ${team.id}`}
                >
                  Équipe #{team.id}
                </span>

                <h1
                  id="team-name"
                  className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4"
                >
                  {team.name}
                </h1>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar aria-hidden="true" className="w-5 h-5 text-primary/70" />
                  <span>Soumis le {formatDate(team.createdAt)}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Members list */}
          <section
            className="mt-8 animate-fade-in"
            style={{ animationDelay: "100ms" }}
            aria-labelledby="team-members-title"
          >
            <div className="flex items-center gap-3 mb-6">
              <Users aria-hidden="true" className="w-6 h-6 text-primary" />
              <h2
                id="team-members-title"
                className="font-display text-2xl font-bold text-foreground"
              >
                Membres de l'équipe
              </h2>

              <span
                className="px-2 py-0.5 bg-secondary rounded-full text-xs text-muted-foreground"
                aria-label={`${team.members.length} membres`}
              >
                {team.members.length}
              </span>
            </div>

            <ul className="grid gap-4" role="list">
              {team.members.map((member, index) => (
                <li key={member}>
                  <div
                    className="group bg-gradient-card rounded-xl border border-border p-5 shadow-card 
                               hover:shadow-card-hover hover:border-primary/30 transition-all duration-300 
                               focus-within:ring-2 focus-within:ring-primary"
                    style={{ animationDelay: `${(index + 2) * 100}ms` }}
                    role="group"
                    aria-label={`Membre ${index + 1}: ${member}`}
                    tabIndex={0}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center
                                   transition-colors duration-300"
                        aria-hidden="true"
                      >
                        <User className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                      </div>

                      <div className="flex-1">
                        <p className="font-medium text-foreground group-hover:text-primary transition-colors duration-300">
                          {member}
                        </p>
                        <p className="text-sm text-muted-foreground">Membre de l'équipe</p>
                      </div>

                      <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                        <span className="text-xs font-medium text-muted-foreground">
                          {index + 1}
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
          <section
            className="mt-10 animate-fade-in"
            style={{ animationDelay: "200ms" }}
          >
            
            <div className="grid md:grid-cols-3 gap-4">
              {teamDefis.slice(0, 3).map((d) => (
                <div
                  key={d.id}
                  className="group relative bg-gradient-card border border-border rounded-xl p-5 shadow-card 
                   hover:shadow-card-hover hover:border-primary/30 hover:-translate-y-1 transition-all duration-300
                   cursor-pointer overflow-hidden"
                >
                  {/* Glow background */}
                  <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-xl overflow-hidden pointer-events-none">
                    <div className="absolute -top-16 -right-16 w-96 h-96 bg-radial-glow" />
                  </div>

                  {/* Gold accent line */}
                  <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />

                  <div className="relative z-10">
                    <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {d.titre}
                    </h3>

                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {d.description}
                    </p>

                    <div className="flex items-center justify-between mt-4">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${d.status === "submitted"
                          ? "bg-green-500/15 text-green-600 border border-green-600/20"
                          : "bg-yellow-500/15 text-yellow-600 border border-yellow-600/20"
                          }`}
                      >
                        {d.status === "submitted" ? "Soumis" : "En cours"}
                      </span>

                      <ChevronRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-all" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Selected Challenges Section */}
          {team.selectedchall && team.selectedchall.length > 0 && (
            <section
              className="mt-10 animate-fade-in"
              style={{ animationDelay: "300ms" }}
              aria-labelledby="selected-challenges-title"
            >
              <div className="flex items-center gap-3 mb-6">
                <Trophy className="w-6 h-6 text-primary" />
                <h2
                  id="selected-challenges-title"
                  className="font-display text-2xl font-bold text-foreground"
                >
                  Défis sélectionnés
                </h2>
                <span
                  className="px-2 py-0.5 bg-secondary rounded-full text-xs text-muted-foreground"
                  aria-label={`${team.selectedchall.length} défis`}
                >
                  {team.selectedchall.length}
                </span>
              </div>

              <ul className="grid gap-4" role="list">
                {team.selectedchall.map((challenge, index) => (
                  <li key={challenge.id}>
                    <div
                      onClick={() => navigate(`/challenge/${challenge.id}`)}
                      className="group bg-gradient-card rounded-xl border border-border p-5 shadow-card 
                                 hover:shadow-card-hover hover:border-primary/30 transition-all duration-300
                                 cursor-pointer"
                      style={{ animationDelay: `${(index + 4) * 100}ms` }}
                      role="button"
                      tabIndex={0}
                      aria-label={`Voir le défi: ${challenge.name}`}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          navigate(`/challenge/${challenge.id}`);
                        }
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center
                                     flex-shrink-0 transition-colors duration-300"
                          aria-hidden="true"
                        >
                          <span className="text-sm font-bold text-primary group-hover:text-primary">
                            #{challenge.id}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground group-hover:text-primary transition-colors duration-300">
                            {challenge.name}
                          </h3>
                        </div>

                        <ChevronRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-all duration-300" aria-hidden="true" />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

        </article>
      </div>
    </main>
  );
};

export default TeamProfile;
