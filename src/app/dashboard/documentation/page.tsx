import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Documentation du Wizard",
  description: "Comprenez chaque champ du formulaire de création de site web.",
};

export default function DocumentationPage() {
  const wizardFields = [
    {
      section: "Infos Essentielles & Design",
      fields: [
        { name: "Prénom", description: "Votre prénom, pour personnaliser votre profil." },
        { name: "Nom", description: "Votre nom de famille, pour compléter votre profil." },
        { name: "Domaine d'expertise / Travail", description: "Décrivez votre métier ou votre domaine d'activité (ex: Développeur Web, Artisan Plombier)." },
        { name: "Nom Public & Activité", description: "Le nom de votre entreprise ou votre nom d'artiste, et ce que vous faites (ex: Mamadou Couture, Aïsha Délices). C'est ce qui apparaîtra en grand sur votre site." },
        { name: "Numéro WhatsApp (Obligatoire)", description: "Le numéro de téléphone où vos clients peuvent vous joindre facilement via WhatsApp." },
        { name: "Numéro de Téléphone Secondaire (Optionnel)", description: "Un autre numéro de téléphone si vous en avez un, pour plus d'options de contact." },
        { name: "E-mail (Optionnel)", description: "Votre adresse e-mail pour les contacts professionnels." },
        { name: "Couleur Principale du Site", description: "La couleur dominante de votre site. Choisissez celle qui représente le mieux votre marque." },
        { name: "Couleur Secondaire du Site", description: "Une deuxième couleur pour compléter le design de votre site." },
        { name: "Logo ou Photo de Profil (Optionnel)", description: "Votre logo d'entreprise ou une photo de vous. Elle apparaîtra en haut de votre site." },
        { name: "Localisation de l'Entreprise", description: "L'adresse principale ou la zone où vous proposez vos services (ex: Dakar, Sénégal)." },
      ],
    },
    {
      section: "Contenu (Les Pages Clés)",
      fields: [
        { name: "Slogan Accrocheur (Bannière d'Accueil)", description: "Une phrase courte et percutante qui apparaît en grand sur la page d'accueil de votre site. Elle doit donner envie aux visiteurs d'en savoir plus." },
        { name: "Mon Histoire / Ma Mission (Page 'À Propos')", description: "Racontez votre parcours, vos valeurs, ou ce qui vous motive. Cela aide les visiteurs à vous faire confiance et à comprendre votre vision." },
        { name: "Image de Fond du Héro (Optionnel)", description: "Une belle image pour décorer la bannière principale de votre site. Elle donne le ton visuel." },
      ],
    },
    {
      section: "Produits & Services",
      fields: [
        { name: "Titre du Produit/Service", description: "Le nom de ce que vous vendez ou proposez (ex: Formation Digitale Débutant, Réparation de Téléphone)." },
        { name: "Prix/Tarif", description: "Le coût de votre offre. Laissez vide si c'est sur devis." },
        { name: "Devise", description: "L'unité monétaire de votre prix (ex: XOF, USD, EUR)." },
        { name: "Description Détaillée", description: "Expliquez ce qui est inclus dans votre offre, sa durée, ou ses avantages. Soyez clair et concis." },
        { name: "Image du Produit/Service (Optionnel)", description: "Une photo qui met en valeur votre produit ou service." },
        { name: "Bouton d'Action", description: "Ce que le visiteur peut faire : acheter, demander un devis, réserver, ou simplement vous contacter." },
      ],
    },
    {
      section: "Configuration et Réseaux",
      fields: [
        { name: "Action du Bouton 'Contact/Commander'", description: "Où voulez-vous que vos clients soient dirigés quand ils cliquent sur le bouton principal de contact ? (WhatsApp, formulaire, téléphone)." },
        { name: "Afficher un formulaire de contact ?", description: "Cochez cette case si vous voulez que les visiteurs puissent vous envoyer un message directement depuis votre site." },
        { name: "Lien Facebook (Optionnel)", description: "L'adresse de votre page Facebook pour que les visiteurs puissent vous suivre." },
        { name: "Lien Instagram (Optionnel)", description: "L'adresse de votre profil Instagram pour partager vos visuels." },
        { name: "Lien LinkedIn (Optionnel)", description: "L'adresse de votre profil LinkedIn pour les contacts professionnels." },
        { name: "Modes de Paiement Acceptés", description: "Les différentes façons dont vos clients peuvent vous payer (cash, mobile money, virement bancaire, etc.)." },
        { name: "Livraison / Déplacement", description: "Comment vos produits sont livrés ou si vous vous déplacez pour vos services (local, national, international, etc.)." },
        { name: "Acompte requis ?", description: "Cochez si vous demandez un acompte avant de commencer un service ou d'envoyer une commande." },
      ],
    },
    {
      section: "Témoignages (Optionnel)",
      fields: [
        { name: "Auteur", description: "Le nom de la personne qui a laissé le témoignage." },
        { name: "Témoignage", description: "Le message de satisfaction de votre client. C'est une preuve de votre bon travail." },
        { name: "Localisation", description: "D'où vient le client qui a laissé le témoignage." },
        { name: "Avatar de l'auteur (Optionnel)", description: "Une photo de profil du client pour rendre le témoignage plus authentique." },
      ],
    },
    {
      section: "Compétences / Expertise (Optionnel)",
      fields: [
        { name: "Titre de la Compétence", description: "Le nom d'une de vos compétences ou d'un domaine où vous excellez (ex: Plomberie, Développement Web)." },
        { name: "Description", description: "Expliquez brièvement ce que cette compétence implique ou ce que vous proposez dans ce domaine." },
        { name: "Icône (Nom Lucide React)", description: "Choisissez une petite image (icône) pour illustrer visuellement cette compétence. (Ex: Wrench, Hammer)." },
      ],
    },
    {
      section: "Visibilité des Sections (Optionnel)",
      fields: [
        { name: "Afficher la Section Héro", description: "Contrôle si la grande bannière d'accueil de votre site est visible." },
        { name: "Afficher la Section 'À Propos'", description: "Contrôle si la section qui raconte votre histoire ou votre mission est visible." },
        { name: "Afficher la Section 'Produits & Services'", description: "Contrôle si la liste de vos offres est visible." },
        { name: "Afficher la Section 'Témoignages'", description: "Contrôle si les avis de vos clients sont visibles." },
        { name: "Afficher la Section 'Compétences'", description: "Contrôle si la section de vos compétences est visible." },
        { name: "Afficher la Section 'Contact'", description: "Contrôle si la section de contact est visible." },
      ],
    },
  ];

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8 text-center lg:text-left">Documentation du Wizard de Création de Site</h1>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Le Wizard de Création de Site</CardTitle>
          <CardDescription className="text-muted-foreground">
            Notre assistant de création de site vous guide pas à pas pour mettre votre business en ligne. Remplissez simplement les informations demandées, et notre système générera un site web professionnel et adapté à votre activité en quelques minutes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {wizardFields.map((section, sectionIndex) => (
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
              {sectionIndex < wizardFields.length - 1 && <Separator className="my-8" />}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}