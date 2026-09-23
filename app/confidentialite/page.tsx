import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Politique de confidentialité — CodeInQuest',
  description:
    "Comment CodeInQuest collecte, utilise et protège vos données personnelles.",
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

export default function PrivacyPolicyPage() {
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
              Politique de confidentialité
            </h1>
            <p className="text-text-secondary text-sm mb-8">
              Dernière mise à jour : 23 septembre 2026
            </p>

            <Section title="Responsable du traitement">
              <p>
                CodeInQuest est un projet édité par [À compléter : nom et
                contact du responsable du traitement, ex. « Prénom Nom —
                email@exemple.com »]. Pour toute question sur vos données
                personnelles ou pour exercer vos droits, contactez ce
                responsable à l&apos;adresse ci-dessus.
              </p>
            </Section>

            <Section title="Données collectées">
              <p>Lors de la création d&apos;un compte, nous collectons :</p>
              <ul className="list-disc list-inside space-y-1">
                <li>votre adresse email (obligatoire, sert d&apos;identifiant de connexion) ;</li>
                <li>votre nom (facultatif) ;</li>
                <li>votre mot de passe, qui n&apos;est jamais stocké en clair : il est haché avant tout enregistrement en base ;</li>
              </ul>
              <p>
                Lors de l&apos;utilisation de l&apos;application, nous
                enregistrons également votre progression : quiz réalisés,
                scores, division et niveau atteints, afin de faire
                fonctionner le classement et l&apos;historique.
              </p>
              <p>
                CodeInQuest n&apos;utilise aucun outil d&apos;analyse
                d&apos;audience ni traceur publicitaire : aucune donnée de
                navigation n&apos;est collectée à des fins statistiques ou
                marketing.
              </p>
            </Section>

            <Section title="Finalités et base légale">
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <span className="text-text-primary font-medium">Création et gestion du compte, authentification</span> — exécution du contrat qui vous lie à CodeInQuest (les conditions d&apos;utilisation du service) ;
                </li>
                <li>
                  <span className="text-text-primary font-medium">Suivi de progression et classement</span> — exécution de ce même contrat, ce suivi étant au cœur du service ;
                </li>
                <li>
                  <span className="text-text-primary font-medium">Sécurité (limitation des tentatives d&apos;inscription/connexion)</span> — intérêt légitime à protéger le service contre les abus.
                </li>
              </ul>
            </Section>

            <Section title="Cookies">
              <p>
                CodeInQuest dépose uniquement un cookie de session strictement
                nécessaire au fonctionnement du service (rester connecté).
                Aucun cookie de mesure d&apos;audience ou publicitaire
                n&apos;est utilisé ; ce cookie ne nécessite donc pas de
                bannière de consentement au titre de la réglementation
                applicable (cookies strictement nécessaires au service
                demandé).
              </p>
            </Section>

            <Section title="Destinataires des données">
              <p>
                Vos données ne sont ni vendues, ni partagées avec des tiers à
                des fins commerciales. Elles sont uniquement accessibles à
                l&apos;équipe technique de CodeInQuest, dans la limite
                nécessaire au fonctionnement et à la maintenance du service.
              </p>
            </Section>

            <Section title="Durée de conservation">
              <p>
                Vos données sont conservées tant que votre compte est actif.
                Vous pouvez demander la suppression de votre compte et des
                données associées à tout moment (voir « Vos droits »
                ci-dessous) ; elles sont alors supprimées sans délai
                injustifié.
              </p>
            </Section>

            <Section title="Sécurité">
              <p>
                Les mots de passe sont hachés (bcrypt) avant stockage, les
                échanges avec le site sont chiffrés (HTTPS), et des limites
                de tentatives protègent les formulaires de connexion et
                d&apos;inscription contre les abus automatisés.
              </p>
            </Section>

            <Section title="Vos droits">
              <p>
                Conformément au Règlement général sur la protection des
                données (RGPD), vous disposez d&apos;un droit
                d&apos;accès, de rectification, d&apos;effacement, de
                limitation, d&apos;opposition et de portabilité sur vos
                données personnelles. Vous pouvez exercer ces droits en
                contactant le responsable du traitement mentionné ci-dessus.
                Vous disposez également du droit d&apos;introduire une
                réclamation auprès de la CNIL (
                <a
                  href="https://www.cnil.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent-border underline"
                >
                  www.cnil.fr
                </a>
                ).
              </p>
            </Section>

            <Section title="Modifications de cette politique">
              <p>
                Cette politique peut être mise à jour, notamment en cas
                d&apos;évolution du service ou de la réglementation. La date
                de dernière mise à jour figure en haut de cette page.
              </p>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}
