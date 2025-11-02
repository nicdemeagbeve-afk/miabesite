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
        { name: "Profil & Paramètres", description: "Mettez à jour vos informations personnelles (nom, prénom, date de naissance, expertise), votre mot de passe, votre photo de profil et d'autres paramètres de votre compte." },
        { name: "Parrainage", description: "Accédez à votre code de parrainage unique, suivez le nombre d'amis parrainés, gérez vos pièces et appliquez des codes de parrainage." },
        { name: "Toutes les Communautés", description: "Découvrez et rejoignez des communautés d'utilisateurs, ou explorez celles que vous avez créées." },
        { name: "Créer une Communauté", description: "Lancez l'assistant de création pour démarrer votre propre communauté (nécessite 1000 pièces)." },
        { name: "Documentation", description: "La page que vous lisez actuellement, expliquant les fonctionnalités du tableau de bord." },
        { name: "Support WhatsApp", description: "Un lien direct pour contacter notre équipe de support via WhatsApp." },
        { name: "Créer un site", description: "Lancez l'assistant de création pour démarrer un nouveau site web." },
        { name: "Redirection automatique (PWA/Web)", description: "Si vous êtes connecté et accédez à la page d'accueil, vous serez automatiquement redirigé vers votre tableau de bord." },
      ],
    },
    {
      section: "Fonctionnement des Menus Spécifiques au Site",
      fields: [
        { name: "Accès aux sections spécifiques", description: "Les sections 'Vue d'Ensemble', 'Messages', 'Éditeur Avancé' et 'Gestion Avancée' sont des outils de gestion pour un site spécifique. Pour y accéder, vous devez d'abord sélectionner un site en cliquant sur 'Gérer le site' depuis la page 'Mes Sites'." },
        { name: "Indicateur visuel", description: "Lorsque vous n'avez pas encore sélectionné de site, ces liens de menu seront grisés et inactifs. Une info-bulle apparaîtra au survol pour vous indiquer qu'une sélection de site est nécessaire." },
        { name: "Activation", description: "Une fois que vous avez cliqué sur 'Gérer le site' pour un de vos sites, les liens de gestion du site deviendront actifs et vous pourrez naviguer entre eux." },
      ],
    },
    {
      section: "Options de Design Avancées (dans 'Gestion Avancée')",
      fields: [
        { name: "Changer de Template", description: "Sélectionnez un nouveau modèle de design pour votre site. Cela peut modifier l'agencement et le style général. Notez que le template ne peut être changé qu'une seule fois après la création initiale." },
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
        { name: "Informations Personnelles", description: "Mettez à jour votre prénom, nom, domaine d'expertise, nom public, numéros de contact, e-mail, couleurs, logo et localisation de votre entreprise." },
        { name: "Section Héro", description: "Personnalisez le slogan accrocheur, votre histoire/mission et l'image de fond de la bannière principale." },
        { name: "Compétences / Expertise", description: "Ajoutez, modifiez ou supprimez jusqu'à 10 compétences avec titre, description et icône." },
        { name: "Produits & Services", description: "Gérez jusqu'à 5 de vos offres avec titre, prix, devise, description, image et bouton d'action." },
        { name: "Témoignages", description: "Ajoutez, modifiez ou supprimez jusqu'à 5 témoignages de clients avec auteur, localisation, citation et avatar." },
        { name: "Réseaux Sociaux & Contact", description: "Configurez l'action du bouton de contact principal, la visibilité du formulaire de contact et vos liens Facebook, Instagram, LinkedIn." },
        { name: "Conditions de Paiement & Livraison", description: "Définissez les modes de paiement acceptés (jusqu'à 5), les options de livraison/déplacement et si un acompte est requis." },
        { name: "Visibilité des Sections", description: "Contrôlez la visibilité de chaque section majeure de votre site (Héro, À Propos, Produits & Services, Témoignages, Compétences, Contact)." },
      ],
    },
    {
      section: "Programme de Parrainage",
      fields: [
        { name: "Votre Code de Parrainage", description: "Un code unique à 5 chiffres que vous pouvez partager avec vos amis. Chaque parrainage réussi vous rapporte des pièces." },
        { name: "Amis Parrainés", description: "Suivez le nombre d'utilisateurs qui se sont inscrits en utilisant votre code." },
        { name: "Vos Pièces", description: "Accumulez des pièces en parrainant des amis. Vous gagnez 10 pièces pour chaque tranche de 2 parrainages. Ces pièces pourront être utilisées pour des fonctionnalités premium ou retirées à l'avenir." },
        { name: "Appliquer un Code de Parrainage", description: "Si un ami vous a parrainé, entrez son code pour lier vos comptes. Vous ne pouvez être parrainé qu'une seule fois." },
        { name: "Transférer des Pièces", description: "Envoyez vos pièces à un autre utilisateur en utilisant son code de parrainage." },
        { name: "Créer votre Communauté", description: "Attecheignez 1000 pièces pour débloquer la possibilité de créer votre propre communauté." },
      ],
    },
    {
      section: "Gestion des Communautés",
      fields: [
        { name: "Créer une Communauté", description: "Définissez le nom, les objectifs, la catégorie et choisissez deux templates premium que les membres pourront utiliser. Vous pouvez la rendre publique ou privée (avec un code de jointure)." },
        { name: "Rejoindre une Communauté", description: "Rejoignez des communautés publiques directement ou des communautés privées avec un code de jointure. Chaque communauté a une limite de 100 membres." },
        { name: "Toutes les Communautés", description: "Parcourez les communautés existantes, recherchez par nom ou filtrez par catégorie." },
      ],
    },
    {
      section: "Tableau de Bord Administrateur (Accès Restreint)",
      fields: [
        { name: "Vue d'Ensemble", description: "Accédez à des statistiques globales sur les utilisateurs, les communautés (publiques/privées) et l'utilisation des templates sur la plateforme." },
        { name: "Gérer les Admins", description: "En tant que Super Admin, vous pouvez ajouter de nouveaux administrateurs en utilisant leur code de parrainage et rétrograder les administrateurs existants." },
        { name: "Gestion des Pièces", description: "Transférez des pièces aux utilisateurs (les administrateurs ont un solde illimité) et consultez l'historique détaillé de toutes les transactions de pièces." },
      ],
    },
    {
      section: "Notifications Push",
      fields: [
        { name: "Activer/Désactiver les Notifications", description: "Un bouton (icône de cloche) est disponible en bas à gauche de la page d'accueil. Cliquez dessus pour activer ou désactiver les notifications push et recevoir des mises à jour importantes de Miabesite." },
      ],
    },
    {
      section: "Bannière de Consentement aux Cookies",
      fields: [
        { name: "Gestion des Cookies", description: "Une bannière apparaît en bas de l'écran lors de votre première visite pour vous informer de l'utilisation des cookies. Vous pouvez accepter ou refuser, conformément à notre Politique de Confidentialité." },
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
            Ce guide vous aidera à naviguer et à utiliser toutes les fonctionnalités de votre tableau de bord pour gérer vos sites web et interagir avec la plateforme efficacement.
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