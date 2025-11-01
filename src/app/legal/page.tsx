import React from "react";
import type { Metadata } from "next";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Mentions Légales & Confidentialité",
  description: "Informations légales, politique de confidentialité et conditions générales d'utilisation de Miabesite.",
};

export default function LegalPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto py-12 px-4 md:px-6">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-center">
          Informations Légales
        </h1>

        <Card className="w-full max-w-4xl mx-auto mb-12">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Mentions Légales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <div>
              <h3 className="text-lg font-semibold text-foreground">1. Éditeur du Site</h3>
              <p><strong>Nom de la plateforme :</strong> Miabesite</p>
              <p><strong>Fondateur :</strong> Nicodème Ayao AGBEVE</p>
              <p><strong>Statut :</strong> Étudiant Autodidacte en Développement Web et Gestion de Projet</p>
              <p><strong>Nationalité :</strong> Togolais</p>
              <p><strong>Contact :</strong> contact@miabesite.site</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">2. Hébergement</h3>
              <p><strong>Hébergeur :</strong> Cooliy (Contabo VPS)</p>
              <p><strong>Adresse :</strong> [Votre adresse physique ou celle de Cooliy si applicable]</p>
              <p><strong>Site Web :</strong> <a href="https://cooliy.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://cooliy.com</a></p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">3. Propriété Intellectuelle</h3>
              <p>L'ensemble de ce site (contenu et présentation) est protégé par les lois togolaises et internationales sur la propriété intellectuelle, notamment le droit d'auteur. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.</p>
              <p>La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est formellement interdite sauf autorisation expresse de l'éditeur.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full max-w-4xl mx-auto mb-12">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Politique de Confidentialité (RGPD)</CardTitle>
            <CardDescription>
              Miabesite s'engage à protéger la vie privée de ses utilisateurs conformément au Règlement Général sur la Protection des Données (RGPD).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <div>
              <h3 className="text-lg font-semibold text-foreground">1. Données Collectées</h3>
              <p>Nous collectons les données suivantes :</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong>Données d'identification :</strong> Nom, prénom, adresse e-mail, numéros de téléphone (WhatsApp, secondaire), date de naissance.</li>
                <li><strong>Données de profil :</strong> Domaine d'expertise, photo de profil, code de parrainage, points de fidélité, communautés rejointes.</li>
                <li><strong>Données de site web :</strong> Contenu de votre site (textes, images, couleurs, template, etc.), sous-domaine.</li>
                <li><strong>Données d'utilisation :</strong> Adresses IP, type de navigateur, pages visitées, temps passé sur le site, interactions.</li>
                <li><strong>Données de contact :</strong> Messages envoyés via les formulaires de contact des sites créés.</li>
                <li><strong>Cookies :</strong> Pour la gestion de session, la personnalisation et l'analyse d'audience.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">2. Finalités de la Collecte</h3>
              <p>Vos données sont collectées pour :</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Fournir et gérer les services de création et d'hébergement de sites web.</li>
                <li>Assurer le support technique et la communication avec les utilisateurs.</li>
                <li>Améliorer nos services et développer de nouvelles fonctionnalités.</li>
                <li>Personnaliser l'expérience utilisateur et les sites créés.</li>
                <li>Gérer le programme de parrainage et les récompenses.</li>
                <li>Analyser l'utilisation de la plateforme à des fins statistiques.</li>
                <li>Assurer la sécurité de la plateforme et prévenir la fraude.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">3. Base Légale du Traitement</h3>
              <p>Le traitement de vos données est basé sur :</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong>L'exécution d'un contrat :</strong> Pour la fourniture de nos services.</li>
                <li><strong>Votre consentement :</strong> Pour les cookies non essentiels et certaines communications marketing.</li>
                <li><strong>L'intérêt légitime :</strong> Pour l'amélioration de nos services et la sécurité de la plateforme.</li>
                <li><strong>Obligation légale :</strong> Pour répondre aux exigences légales et réglementaires.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">4. Destinataires des Données</h3>
              <p>Vos données peuvent être partagées avec :</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Les équipes internes de Miabesite.</li>
                <li>Nos sous-traitants techniques (ex: Supabase pour la base de données et l'authentification, Cooliy pour l'hébergement).</li>
                <li>Des outils d'analyse d'audience (si utilisés, avec anonymisation).</li>
              </ul>
              <p>Nous nous assurons que nos partenaires respectent le RGPD.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">5. Vos Droits (RGPD)</h3>
              <p>Conformément au RGPD, vous disposez des droits suivants :</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong>Droit d'accès :</strong> Obtenir la confirmation que vos données sont traitées et en obtenir une copie.</li>
                <li><strong>Droit de rectification :</strong> Demander la correction de données inexactes ou incomplètes.</li>
                <li><strong>Droit à l'effacement ("droit à l'oubli") :</strong> Demander la suppression de vos données.</li>
                <li><strong>Droit à la limitation du traitement :</strong> Demander la suspension du traitement de vos données.</li>
                <li><strong>Droit d'opposition :</strong> Vous opposer au traitement de vos données pour des raisons légitimes.</li>
                <li><strong>Droit à la portabilité :</strong> Recevoir vos données dans un format structuré et les transmettre à un autre responsable de traitement.</li>
                <li><strong>Droit de retirer votre consentement :</strong> À tout moment, sans affecter la licéité du traitement basé sur le consentement effectué avant ce retrait.</li>
              </ul>
              <p>Pour exercer ces droits, veuillez nous contacter à contact@miabesite.site.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">6. Durée de Conservation</h3>
              <p>Vos données sont conservées pendant la durée nécessaire à la réalisation des finalités pour lesquelles elles ont été collectées, augmentée des durées légales de conservation.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">7. Mesures de Sécurité</h3>
              <p>Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour garantir un niveau de sécurité adapté au risque, notamment pour protéger vos données contre la destruction, la perte, l'altération, la divulgation non autorisée ou l'accès illégal.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">8. Contact DPO</h3>
              <p>Pour toute question relative à la protection de vos données, vous pouvez contacter notre Délégué à la Protection des Données (DPO) :</p>
              <p><strong>Nicodème Ayao AGBEVE</strong></p>
              <p><strong>Email :</strong> contact@miabesite.site</p>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Conditions Générales d'Utilisation (CGU)</CardTitle>
            <CardDescription>
              Veuillez lire attentivement les présentes conditions avant d'utiliser la plateforme Miabesite.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <div>
              <h3 className="text-lg font-semibold text-foreground">1. Acceptation des CGU</h3>
              <p>En accédant et en utilisant la plateforme Miabesite, vous acceptez d'être lié par les présentes Conditions Générales d'Utilisation (CGU), ainsi que par notre Politique de Confidentialité et nos Mentions Légales. Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser nos services.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">2. Services Offerts</h3>
              <p>Miabesite propose un service de création et d'hébergement de sites web automatisé, basé sur l'intelligence artificielle. Nos services incluent :</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Génération de sites web à partir de formulaires.</li>
                <li>Hébergement sur un sous-domaine (ex: votrenom.ctcsite.com).</li>
                <li>Outils d'édition de contenu et de design.</li>
                <li>Support technique via WhatsApp.</li>
                <li>Programme de parrainage.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">3. Obligations de l'Utilisateur</h3>
              <p>Vous vous engagez à :</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Fournir des informations exactes et complètes lors de l'inscription et de la création de votre site.</li>
                <li>Utiliser la plateforme de manière légale et conforme aux présentes CGU.</li>
                <li>Ne pas publier de contenu illégal, diffamatoire, obscène, menaçant ou portant atteinte aux droits de tiers.</li>
                <li>Maintenir la confidentialité de vos identifiants de connexion.</li>
                <li>Ne pas tenter d'accéder de manière non autorisée à nos systèmes ou aux données d'autres utilisateurs.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">4. Propriété Intellectuelle</h3>
              <p>Miabesite conserve tous les droits de propriété intellectuelle sur la plateforme, son code, son design et ses fonctionnalités. Le contenu que vous publiez sur votre site reste votre propriété, mais vous nous accordez une licence non exclusive pour l'héberger et le diffuser via nos services.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">5. Limitation de Responsabilité</h3>
              <p>Miabesite s'efforce d'assurer la disponibilité et la sécurité de ses services, mais ne peut garantir une absence totale d'interruptions ou d'erreurs. Nous ne serons pas responsables des dommages directs ou indirects résultant de l'utilisation ou de l'impossibilité d'utiliser nos services.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">6. Résiliation</h3>
              <p>Nous nous réservons le droit de suspendre ou de résilier votre compte et l'accès à nos services en cas de non-respect des présentes CGU, de comportement abusif ou illégal, ou pour toute autre raison jugée nécessaire, avec ou sans préavis.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">7. Modifications des CGU</h3>
              <p>Nous nous réservons le droit de modifier les présentes CGU à tout moment. Les modifications prendront effet dès leur publication sur le site. Il est de votre responsabilité de consulter régulièrement les CGU pour prendre connaissance des éventuelles mises à jour.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">8. Loi Applicable et Juridiction</h3>
              <p>Les présentes CGU sont régies par le droit togolais. Tout litige relatif à l'interprétation ou à l'exécution des présentes CGU sera soumis aux tribunaux compétents du Togo.</p>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}