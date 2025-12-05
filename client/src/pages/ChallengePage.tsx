import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Trophy, Users, Gift, FileText, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { fetchChallengeById, Challenge } from "@/services/api";

const ChallengePage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [challenge, setChallenge] = useState<Challenge | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadChallenge = async () => {
            if (!id) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const data = await fetchChallengeById(id);
                setChallenge(data);
                setError(null);
            } catch (err) {
                setError("Impossible de charger le défi. Veuillez réessayer plus tard.");
                console.error("Failed to fetch challenge:", err);
            } finally {
                setIsLoading(false);
            }
        };

        loadChallenge();
    }, [id]);

    if (isLoading) {
        return (
            <main role="main" className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
                <div className="text-center space-y-4 animate-fade-in">
                    <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" role="status">
                        <span className="sr-only">Chargement du défi...</span>
                    </div>
                    <p className="text-muted-foreground text-lg">Chargement du défi...</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main role="main" className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
                <div className="text-center space-y-4 animate-fade-in">
                    <h1 className="font-display text-3xl font-bold text-foreground">Erreur</h1>
                    <p className="text-red-500">{error}</p>
                    <Button
                        onClick={() => navigate(-1)}
                        variant="outline"
                        className="mt-4 focus-visible:ring-2 focus-visible:ring-primary"
                        aria-label="Retour"
                    >
                        <ArrowLeft aria-hidden="true" className="w-4 h-4 mr-2" />
                        Retour
                    </Button>
                </div>
            </main>
        );
    }

    if (!challenge) {
        return (
            <main role="main" className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
                <div className="text-center space-y-4 animate-fade-in">
                    <h1 className="font-display text-3xl font-bold text-foreground">Défi non trouvé</h1>
                    <p className="text-muted-foreground">Le défi que vous cherchez n'existe pas.</p>
                    <Button
                        onClick={() => navigate(-1)}
                        variant="outline"
                        className="mt-4 focus-visible:ring-2 focus-visible:ring-primary"
                        aria-label="Retour"
                    >
                        <ArrowLeft aria-hidden="true" className="w-4 h-4 mr-2" />
                        Retour
                    </Button>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-hero relative" role="main">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
                <div className="absolute top-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-40 left-20 w-72 h-72 bg-primary/3 rounded-full blur-3xl" />
            </div>

            <div className="relative container mx-auto px-4 py-8 md:py-12">
                {/* Back button */}
                <Button
                    onClick={() => navigate(-1)}
                    variant="ghost"
                    className="mb-8 text-muted-foreground hover:text-foreground hover:bg-secondary 
                     focus-visible:ring-2 focus-visible:ring-primary"
                    aria-label="Retour"
                >
                    <ArrowLeft aria-hidden="true" className="w-4 h-4 mr-2" />
                    Retour
                </Button>

                <article className="max-w-4xl mx-auto" aria-labelledby="challenge-name">
                    {/* Challenge header */}
                    <section className="bg-gradient-card rounded-2xl border border-border p-8 shadow-card animate-fade-in">
                        <div className="flex flex-col md:flex-row items-start gap-6">
                            {challenge.logo && (
                                <img
                                    src={challenge.logo}
                                    alt={`Logo ${challenge.name}`}
                                    className="w-24 h-24 object-contain rounded-xl bg-white/5 p-2"
                                />
                            )}

                            <div className="flex-1">
                                <h1 id="challenge-name" className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                                    {challenge.name}
                                </h1>

                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Trophy className="w-4 h-4 text-primary" />
                                        <span>{challenge.organizer}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-primary" />
                                        <span>{challenge.theme}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Challenge details */}
                    <div className="grid md:grid-cols-2 gap-6 mt-8">
                        {/* Description */}
                        <section className="bg-gradient-card rounded-xl border border-border p-6 shadow-card animate-fade-in" style={{ animationDelay: "100ms" }}>
                            <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                                <Gift className="w-5 h-5 text-primary" />
                                Prix
                            </h2>
                            <p className="text-foreground">{challenge.description || "Non spé cifié"}</p>
                        </section>

                        {/* Submission mode */}
                        <section className="bg-gradient-card rounded-xl border border-border p-6 shadow-card animate-fade-in" style={{ animationDelay: "200ms" }}>
                            <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                                <Github className="w-5 h-5 text-primary" />
                                Mode de soumission
                            </h2>
                            <p className="text-foreground">{challenge.submissionMode}</p>
                        </section>
                    </div>

                    {/* Expected elements */}
                    {challenge.expectedElements && challenge.expectedElements.length > 0 && (
                        <section className="mt-8 bg-gradient-card rounded-xl border border-border p-6 shadow-card animate-fade-in" style={{ animationDelay: "300ms" }}>
                            <h2 className="font-display text-xl font-bold text-foreground mb-4">
                                Éléments attendus
                            </h2>
                            <ul className="space-y-2">
                                {challenge.expectedElements.map((element, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                        <span className="text-foreground">{element}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* Teams */}
                    {challenge.teams && challenge.teams.length > 0 && (
                        <section className="mt-8 animate-fade-in" style={{ animationDelay: "400ms" }}>
                            <div className="flex items-center gap-3 mb-6">
                                <Users className="w-6 h-6 text-primary" />
                                <h2 className="font-display text-2xl font-bold text-foreground">
                                    Équipes participantes
                                </h2>
                                <span className="px-2 py-0.5 bg-secondary rounded-full text-xs text-muted-foreground">
                                    {challenge.teams.length}
                                </span>
                            </div>

                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {challenge.teams.map((team) => (
                                    <div
                                        key={team.id}
                                        onClick={() => navigate(`/team/${team.id}`)}
                                        className="group bg-gradient-card rounded-xl border border-border p-4 shadow-card 
                               hover:shadow-card-hover hover:border-primary/30 transition-all duration-300
                               cursor-pointer"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                                                <span className="text-xs font-bold text-primary">#{team.id}</span>
                                            </div>
                                            <p className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                                {team.name}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </article>
            </div>
        </main>
    );
};

export default ChallengePage;
