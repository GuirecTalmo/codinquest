import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation — CodeInQuest",
  description:
    "Conditions générales d'utilisation du service CodeInQuest.",
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-display font-bold text-text-primary mb-3">
        {title}
      </h2>
      <div className="text-text-secondary space-y-3 leading-relaxed">
        {children}
      </div>
    </section>
  );
}

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-bg">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/"
            className="text-accent hover:text-accent-border font-medium text-sm mb-6 inline-block transition-colors"
          >
            ← Retour à l&apos;accueil
          </Link>

          <div className="bg-surface border-[3px] border-border shadow-hard p-8">
            <h1 className="text-3xl font-display font-bold text-text-primary mb-2">
              Conditions générales d&apos;utilisation
            </h1>
            <p className="text-text-secondary text-sm mb-8">
              Dernière mise à jour : 23 septembre 2026
            </p>

            <Section title="1. Objet">
              <p>
                Les présentes conditions générales d&apos;utilisation
                (« CGU ») régissent l&apos;accès et l&apos;utilisation du
                service CodeInQuest, une application de quiz d&apos;entraînement
                aux entretiens techniques front-end (HTML, CSS, JavaScript,
                React, Vue.js...), organisée sous forme de divisions et de
                classement. L&apos;utilisation du service implique
                l&apos;acceptation pleine et entière des présentes CGU.
              </p>
            </Section>

            <Section title="2. Éditeur du service">
              <p>
                CodeInQuest est édité par [À compléter : nom et contact de
                l&apos;éditeur, ex. « Prénom Nom — email@exemple.com »].
              </p>
            </Section>

            <Section title="3. Accès au service et création de compte">
              <p>
                Certaines fonctionnalités (quiz, classement, historique,
                progression) nécessitent la création d&apos;un compte avec une
                adresse email et un mot de passe. Vous vous engagez à fournir
                des informations exactes et à conserver la confidentialité de
                vos identifiants : toute action réalisée depuis votre compte
                est réputée effectuée par vous.
              </p>
              <p>
                Le service est proposé gratuitement, à titre de projet
                personnel, sans garantie de disponibilité continue.
              </p>
            </Section>

            <Section title="4. Fonctionnement du service">
              <p>
                CodeInQuest propose des quiz à choix multiples organisés par
                catégorie et par niveau. La réussite des quiz fait progresser
                votre division au sein d&apos;un classement visible par les
                autres utilisateurs inscrits (pseudo/nom et score). Les
                catégories, quiz, niveaux et règles de progression peuvent
                évoluer à tout moment sans préavis.
              </p>
            </Section>

            <Section title="5. Engagements de l'utilisateur">
              <p>En utilisant CodeInQuest, vous vous engagez à :</p>
              <ul className="list-disc list-inside space-y-1">
                <li>ne créer qu&apos;un seul compte par personne ;</li>
                <li>ne pas tenter de contourner, automatiser ou tricher sur les mécanismes de quiz, de score ou de classement ;</li>
                <li>ne pas perturber le bon fonctionnement du service (surcharge, exploitation de failles, extraction massive de données) ;</li>
                <li>ne pas utiliser un pseudo ou nom trompeur, injurieux ou portant atteinte à un tiers.</li>
              </ul>
              <p>
                Tout manquement à ces engagements peut entraîner la
                suspension ou la suppression du compte concerné.
              </p>
            </Section>

            <Section title="6. Propriété intellectuelle">
              <p>
                Le contenu du service (questions, textes, interface, éléments
                graphiques) est protégé par le droit de la propriété
                intellectuelle. Toute reproduction ou réutilisation sans
                autorisation, en dehors d&apos;un usage personnel du service,
                est interdite.
              </p>
            </Section>

            <Section title="7. Données personnelles">
              <p>
                Le traitement de vos données personnelles est décrit dans la{' '}
                <Link
                  href="/confidentialite"
                  className="text-accent hover:text-accent-border underline"
                >
                  politique de confidentialité
                </Link>
                .
              </p>
            </Section>

            <Section title="8. Responsabilité et disponibilité">
              <p>
                CodeInQuest est fourni « en l&apos;état », sans garantie
                d&apos;exactitude absolue des contenus pédagogiques ni de
                disponibilité continue du service. L&apos;éditeur ne saurait
                être tenu responsable d&apos;une indisponibilité temporaire,
                d&apos;une perte de données ou d&apos;un préjudice indirect
                lié à l&apos;utilisation du service.
              </p>
            </Section>

            <Section title="9. Suppression de compte">
              <p>
                Vous pouvez demander la suppression de votre compte à tout
                moment en contactant l&apos;éditeur (voir « Données
                personnelles » ci-dessus). L&apos;éditeur peut également
                suspendre ou supprimer un compte en cas de non-respect des
                présentes CGU.
              </p>
            </Section>

            <Section title="10. Modification des CGU">
              <p>
                Les présentes CGU peuvent être modifiées à tout moment,
                notamment pour refléter une évolution du service ou de la
                réglementation. La date de dernière mise à jour figure en
                haut de cette page. Il vous appartient de la consulter
                régulièrement.
              </p>
            </Section>

            <Section title="11. Droit applicable">
              <p>
                Les présentes CGU sont soumises au droit français. Tout
                litige relatif à leur interprétation ou leur exécution relève
                de la compétence des tribunaux français.
              </p>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}
