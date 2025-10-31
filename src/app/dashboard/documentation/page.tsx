import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Documentation du Tableau de Bord",
  description: "Comprenez chaque fonctionnalité de votre tableau de bord Miabesite.",
};

export default function DocumentationPage() {
  const dashboardSections = [
    {
      section: "Navigation du Tableau de Bord",
      fields: [
        { name: "Mes Sites", description: "Affiche la liste de tous vos sites web. C'est le point de départ pour gérer vos projets." },
        { name: "Vue d'Ensemble", description: "Un aperçu rapide des statistiques et des actions clés pour le site sélectionné." },
        { name: "Messages", description: "Consultez et gérez les messages envoyés via le formulaire de contact de votre site." },
        { name: "Éditeur Avancé", description: "Accédez à un formulaire détaillé pour personnaliser tous les aspects de votre site (textes, images, produits, témoignages, compétences, etc.)." },
        { name: "Gestion Avancée", description: "Gérez les options techniques comme la liaison de domaine personnalisé, le téléchargement du code source, et les options de design avancées." },
        { name: "Profil & Paramètres", description: "Mettez à jour vos informations personnelles, votre mot de passe et d'autres paramètres de votre compte." },
        { name: "Documentation", description: "La page que vous lisez actuellement, expliquant les fonctionnalités du tableau de bord." },
        { name: "Support WhatsApp", description: "Un lien direct pour contacter notre équipe de support via WhatsApp." },
        { name: "Créer un site", description: "Lancez l'assistant de création pour démarrer un nouveau site web." },
      ],
    },
    {
      section: "Fonctionnement des Menus Spécifiques au Site",
      fields: [
        { name: "Accès aux sections spécifiques", description: "Pour accéder aux sections 'Vue d'Ensemble', 'Messages', 'Éditeur Avancé' et 'Gestion Avancée', vous devez d'abord cliquer sur 'Gérer le site' depuis la page 'Mes Sites' pour sélectionner un site spécifique. Ces options ne sont actives que lorsqu'un site est en cours de gestion." },
        { name: "Indicateur visuel", description: "Les liens de menu qui nécessitent la sélection d'un site seront grisés et afficheront une info-bulle si aucun site n'est sélectionné, vous guidant sur la marche à suivre." },
      ],
    },
    {
      section: "Options de Design Avancées (dans 'Gestion Avancée')",
      fields: [
        { name: "Changer de Template", description: "Sélectionnez un nouveau modèle de design pour votre site. Cela peut modifier l'agencement et le style général." },
        { name: "Couleur Principale", description: "Définissez la couleur dominante de votre site, utilisée pour les titres, boutons principaux, etc." },
        { name: "Couleur Secondaire", description: "Choisissez une couleur complémentaire pour les accents, les arrière-plans secondaires, etc." },
        { name: "Police de Caractères", description: "Sélectionnez la police de texte de votre site. (Fonctionnalité en cours de développement)." },
        { name: "Afficher la section Témoignages", description: "Activez ou désactivez la visibilité de la section où les avis de vos clients sont affichés." },
        { name: "Afficher la section Compétences", description: "Activez ou désactivez la visibilité de la section présentant vos compétences et expertises." },
      ],
    },
    {
      section: "Éditeur Avancé (page dédiée)",
      fields: [
        { name: "Informations de Base & Branding", description: "Mettez à jour le nom public, les numéros de contact, l'e-mail, les couleurs, le logo et la localisation de votre entreprise." },
        { name: "Section Héro", description: "Personnalisez le slogan accrocheur, votre histoire/mission et l'image de fond de la bannière principale." },
        { name: "Compétences / Expertise", description: "Ajoutez, modifiez ou supprimez jusqu'à 10 compétences avec titre, description et icône." },
        { name: "Produits & Services", description: "Gérez jusqu'à 5 de vos offres avec titre, prix, devise, description, image et bouton d'action." },
        { name: "Témoignages", description: "Ajoutez, modifiez ou supprimez jusqu'à 5 témoignages de clients avec auteur, localisation, citation et avatar." },
        { name: "Réseaux Sociaux & Contact", description: "Configurez l'action du bouton de contact principal, la visibilité du formulaire de contact et vos liens Facebook, Instagram, LinkedIn." },
        { name: "Conditions de Paiement & Livraison", description: "Définissez les modes de paiement acceptés, les options de livraison/déplacement et si un acompte est requis." },
        { name: "Visibilité des Sections", description: "Contrôlez la visibilité de chaque section majeure de votre site (Héro, À Propos, Produits & Services, Témoignages, Compétences, Contact)." },
      ],
    },
    {
      section: "Changement de Thème (Clair/Sombre)",
      fields: [
        { name: "Bouton de bascule de thème", description: "Un bouton (icône soleil/lune) est disponible dans l'en-tête de la page d'accueil et du tableau de bord. Cliquez dessus pour changer le thème de l'application entre le mode clair, le mode sombre ou le thème du système d'exploitation." },
        { name: "Palette de couleurs", description: "La palette de couleurs de l'application a été mise à jour pour utiliser des nuances de bleu, de gris, de blanc et de violet, s'adaptant automatiquement au thème choisi." },
      ],
    },
  ];

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8 text-center lg:text-left">Documentation du Tableau de Bord</h1>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Comprendre votre Tableau de Bord Miabesite</CardTitle>
          <CardDescription className="text-muted-foreground">
            Ce guide vous aidera à naviguer et à utiliser toutes les fonctionnalités de votre tableau de bord pour gérer vos sites web efficacement.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {dashboardSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h2 className="text-xl font-semibold mb-4 text-primary">{section.section}</h2>
              <div className="space-y-4">
                {section.fields.map((field, fieldIndex) => (
                  <div key={fieldIndex} className="border-l-4 border-accent pl-4 py-2">
                    <h3 className="text-lg font-medium">{field.name}</h3>
                    <p className="text-muted-foreground text-sm">{field.description}</p>
                  </div>
                ))}
              </div>
              {sectionIndex < dashboardSections.length - 1 && <Separator className="my-8" />}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}