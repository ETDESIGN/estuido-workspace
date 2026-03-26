#!/bin/bash
# send-draft-to-self.sh - Send draft email to Florian's own inbox for review

TO="inerys.contact@gmail.com"
SUBJECT="📧 TEST DRAFT - Review before sending to prospect"
PROSPECT="contact@altipa.fr"
COMPANY="Altipa"

BODY="Hello Florian,

This is a TEST draft created by the Inerys Agent system.

Below is the draft that would be sent to $PROSPECT at $COMPANY:

==========================================================================
TO: $PROSPECT
SUBJECT: Partenariat Inerys - $COMPANY

Bonjour,

Je me permets de vous contacter au sujet de $COMPANY.

Chez Inerys, nous accompagnons les entreprises du secteur Packaging dans leurs projets d'emballage sur mesure. Notre usine en Chine nous permet de garantir une qualité optimale tout en maîtrisant l'ensemble de la chaîne de production.

Nos clients comme L'Oréal, Cabaïa et Tour de France nous font confiance pour leur production.

Seriez-vous disponible pour un bref échange afin que je puisse vous présenter nos réalisations?

Dans l'attente de votre retour, je vous souhaite une excellente journée.

Cordialement,

Florian
Inerys - Premium Custom Packaging
Quality Production | Design to Delivery
==========================================================================

SYSTEM INFO:
- Created: $(date)
- Pipeline: Inerys Agent v1.0
- Status: Ready for production
- Next: Review this draft, then we can send to actual prospect

To send this to the prospect:
1. Review the draft above
2. If approved, run: ./pipeline.sh $PROSPECT --company \"$COMPANY\" --niche \"Packaging\"
3. The system will create the actual email in your drafts folder

--
Inerys Agent Automation System"

echo "Sending test draft to your inbox ($TO)..."
echo ""

# Send using gog
gog -a inerys.contact@gmail.com gmail send \
    --to="$TO" \
    --subject="$SUBJECT" \
    --body="$BODY"

echo ""
echo "✅ Test email sent!"
echo ""
echo "📧 Check your inbox: https://mail.google.com/mail/u/inerys.contact@gmail.com/"
echo "   You should see an email with the draft content for review"
echo ""
echo "This proves the system can put emails in your Gmail! 🎉"
