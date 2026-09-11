import { escapeHtml } from '@/lib/email';

export interface StaffEmailData {
  name: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  guests: number;
  space: string;
  message?: string;
  whatsappLink: string;
  adminUrl: string;
}

export interface ClientConfirmationData {
  name: string;
  date: string;
  time: string;
  guests: number;
  space: string;
  message?: string;
  status: string;
}

export interface StatusUpdateData {
  name: string;
  date: string;
  time: string;
  guests: number;
  space: string;
  status: string;
  statusKey: string;
  statusNote?: string;
}

function emailLayout(content: string, preheader?: string): string {
  const preheaderHtml = preheader
    ? `<div style="display: none; max-height: 0px; overflow: hidden;">${escapeHtml(preheader)}</div>`
    : '';

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>La Cachette</title>
</head>
<body style="margin: 0; padding: 0; background-color: #171310; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #E8D8B8; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
  ${preheaderHtml}
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #171310;">
    <tr>
      <td align="center" style="padding: 40px 10px;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; margin: 0 auto; background-color: #1a1614; border-top: 4px solid #C59A4A; border-radius: 4px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.5);">
          <tr>
            <td align="center" style="padding: 36px 30px 28px; background-color: #130f0d;">
              <h1 style="margin: 0; font-family: 'Playfair Display', Georgia, serif; color: #C59A4A; font-size: 28px; font-weight: normal; letter-spacing: 3px;">LA CACHETTE</h1>
              <p style="margin: 8px 0 2px; color: #E8D8B8; font-size: 14px; font-style: italic; letter-spacing: 1px;">L&rsquo;ambiance se cache ici.</p>
              <p style="margin: 4px 0 0; color: #B86B32; font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">Restaurant-Bar &middot; &Eacute;ki&eacute;, Yaound&eacute;</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 30px;">
              ${content}
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 28px 30px; background-color: #130f0d; border-top: 1px solid #33231b;">
              <p style="margin: 0 0 6px; color: #E8D8B8/80; font-size: 13px;">La Cachette &mdash; Sis &agrave; &Eacute;ki&eacute;, Dernier Poteau &mdash; Yaound&eacute;, Cameroun</p>
              <p style="margin: 0 0 6px; color: #888; font-size: 13px;">
                <a href="https://resto.chreolempire.com" style="color: #C59A4A; text-decoration: none;">resto.chreolempire.com</a>
                &nbsp;&middot;&nbsp;
                <a href="https://wa.me/237693547268" style="color: #25D366; text-decoration: none;">WhatsApp</a>
                &nbsp;&middot;&nbsp;
                <a href="https://t.me/LacachetteResto_Bot" style="color: #229ED9; text-decoration: none;">Telegram</a>
              </p>
              <p style="margin: 0 0 4px; color: #666; font-size: 11px;">
                <a href="mailto:restolacachatte@chreolempire.com" style="color: #666; text-decoration: none;">restolacachatte@chreolempire.com</a>
                &nbsp;&middot;&nbsp;
                <a href="mailto:lacachette@resto.chreolempire.com" style="color: #666; text-decoration: none;">lacachette@resto.chreolempire.com</a>
              </p>
              <p style="margin: 10px 0 0; color: #444; font-size: 11px;">&copy; ${new Date().getFullYear()} La Cachette &mdash; Une marque d&eacute;pos&eacute;e de <a href="https://chreolempire.com" style="color: #C59A4A; text-decoration: none;">Chreol Empire</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildNewReservationStaffEmail(data: StaffEmailData): string {
  const content = `
    <h2 style="margin: 0 0 24px; font-family: 'Playfair Display', Georgia, serif; color: #E8D8B8; font-size: 22px; font-weight: normal; border-bottom: 1px solid #33231b; padding-bottom: 16px;">&#127869;&#65039; Nouvelle Demande de R&eacute;servation</h2>

    <!-- Client Info -->
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 20px; background-color: #241c18; border-radius: 8px; overflow: hidden;">
      <tr>
        <td style="padding: 16px 20px; background-color: #2e1e14; border-bottom: 1px solid #4A2C20;">
          <p style="margin: 0; color: #C59A4A; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: bold;">&#128100; Informations Client</p>
        </td>
      </tr>
      <tr>
        <td style="padding: 20px;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #33231b; width: 130px; vertical-align: top;">
                <strong style="color: #C59A4A; font-size: 13px;">Client :</strong>
              </td>
              <td style="padding: 8px 0; border-bottom: 1px solid #33231b; vertical-align: top;">
                <span style="color: #E8D8B8; font-size: 16px; font-weight: bold;">${escapeHtml(data.name)}</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #33231b; vertical-align: top;">
                <strong style="color: #C59A4A; font-size: 13px;">T&eacute;l&eacute;phone :</strong>
              </td>
              <td style="padding: 8px 0; border-bottom: 1px solid #33231b; vertical-align: top;">
                <a href="tel:${escapeHtml(data.phone)}" style="color: #E8D8B8; text-decoration: none; font-size: 14px;">${escapeHtml(data.phone)}</a>
              </td>
            </tr>
            ${data.email ? `
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #33231b; vertical-align: top;">
                <strong style="color: #C59A4A; font-size: 13px;">Email :</strong>
              </td>
              <td style="padding: 8px 0; border-bottom: 1px solid #33231b; vertical-align: top;">
                <a href="mailto:${escapeHtml(data.email)}" style="color: #E8D8B8; text-decoration: none; font-size: 14px;">${escapeHtml(data.email)}</a>
              </td>
            </tr>
            ` : ''}
          </table>
        </td>
      </tr>
    </table>

    <!-- Reservation Details -->
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 20px; background-color: #241c18; border-radius: 8px; overflow: hidden;">
      <tr>
        <td style="padding: 16px 20px; background-color: #2e1e14; border-bottom: 1px solid #4A2C20;">
          <p style="margin: 0; color: #C59A4A; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: bold;">&#128197; D&eacute;tails de la R&eacute;servation</p>
        </td>
      </tr>
      <tr>
        <td style="padding: 20px;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #33231b; width: 130px;">
                <strong style="color: #C59A4A; font-size: 13px;">&#128197; Date &amp; Heure :</strong>
              </td>
              <td style="padding: 8px 0; border-bottom: 1px solid #33231b;">
                <span style="color: #E8D8B8; font-size: 14px; font-weight: bold;">${escapeHtml(data.date)} &agrave; ${escapeHtml(data.time)}</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #33231b;">
                <strong style="color: #C59A4A; font-size: 13px;">&#128101; Convives :</strong>
              </td>
              <td style="padding: 8px 0; border-bottom: 1px solid #33231b;">
                <span style="color: #E8D8B8; font-size: 14px;">${escapeHtml(data.guests.toString())} personne${data.guests > 1 ? 's' : ''}</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; ${data.message ? 'border-bottom: 1px solid #33231b;' : ''}">
                <strong style="color: #C59A4A; font-size: 13px;">&#128205; Espace :</strong>
              </td>
              <td style="padding: 8px 0; ${data.message ? 'border-bottom: 1px solid #33231b;' : ''}">
                <span style="color: #E8D8B8; font-size: 14px;">${escapeHtml(data.space)}</span>
              </td>
            </tr>
            ${data.message ? `
            <tr>
              <td colspan="2" style="padding: 12px 0 0 0;">
                <p style="margin: 0 0 8px; color: #C59A4A; font-size: 13px; font-weight: bold;">&#128172; Message du client :</p>
                <div style="color: #E8D8B8; background-color: #1a1614; padding: 12px 16px; border-radius: 6px; font-style: italic; border-left: 3px solid #C59A4A; line-height: 1.5;">&laquo;&nbsp;${escapeHtml(data.message)}&nbsp;&raquo;</div>
              </td>
            </tr>
            ` : ''}
          </table>
        </td>
      </tr>
    </table>

    <!-- Action Buttons -->
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center" style="padding-bottom: 10px;">
          <a href="${escapeHtml(data.adminUrl)}" style="display: inline-block; padding: 13px 28px; background-color: #C59A4A; color: #171310; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px; min-width: 230px; text-align: center;">&#128295; G&eacute;rer dans l&rsquo;Admin</a>
        </td>
      </tr>
      <tr>
        <td align="center" style="padding-bottom: 10px;">
          <a href="${escapeHtml(data.whatsappLink)}" style="display: inline-block; padding: 13px 28px; background-color: #25D366; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px; min-width: 230px; text-align: center;">&#128242; Contacter sur WhatsApp</a>
        </td>
      </tr>
      <tr>
        <td align="center">
          <a href="https://t.me/LacachetteResto_Bot" style="display: inline-block; padding: 13px 28px; background-color: #229ED9; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px; min-width: 230px; text-align: center;">&#129302; Ouvrir Telegram Bot</a>
        </td>
      </tr>
    </table>
  `;

  return emailLayout(content, `Nouvelle réservation de ${data.name} pour le ${data.date}`);
}

export function buildReservationConfirmationClientEmail(data: ClientConfirmationData): string {
  const content = `
    <p style="margin: 0 0 6px; font-size: 18px;">Bonjour <strong style="color: #C59A4A;">${escapeHtml(data.name)}</strong>,</p>
    
    <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.6; color: #aaa;">
      Votre demande de r&eacute;servation a bien &eacute;t&eacute; enregistr&eacute;e. Notre &eacute;quipe vous contactera tr&egrave;s prochainement via WhatsApp pour confirmer votre table.
    </p>
    
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px; background-color: #241c18; border-radius: 8px; overflow: hidden; border-left: 4px solid #C59A4A;">
      <tr>
        <td style="padding: 16px 20px; border-bottom: 1px solid #33231b;">
          <p style="margin: 0; color: #C59A4A; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: bold;">R&eacute;capitulatif de votre demande</p>
        </td>
      </tr>
      <tr>
        <td style="padding: 20px;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #33231b;">
                <span style="color: #C59A4A; display: inline-block; width: 28px;">&#128197;</span>
                <strong style="color: #E8D8B8; display: inline-block; width: 80px; font-size: 13px;">Date :</strong>
                <span style="color: #E8D8B8; font-size: 14px;">${escapeHtml(data.date)}</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #33231b;">
                <span style="color: #C59A4A; display: inline-block; width: 28px;">&#8987;</span>
                <strong style="color: #E8D8B8; display: inline-block; width: 80px; font-size: 13px;">Heure :</strong>
                <span style="color: #E8D8B8; font-size: 14px;">${escapeHtml(data.time)}</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #33231b;">
                <span style="color: #C59A4A; display: inline-block; width: 28px;">&#128101;</span>
                <strong style="color: #E8D8B8; display: inline-block; width: 80px; font-size: 13px;">Convives :</strong>
                <span style="color: #E8D8B8; font-size: 14px;">${escapeHtml(data.guests.toString())} personne${data.guests > 1 ? 's' : ''}</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #33231b;">
                <span style="color: #C59A4A; display: inline-block; width: 28px;">&#128205;</span>
                <strong style="color: #E8D8B8; display: inline-block; width: 80px; font-size: 13px;">Espace :</strong>
                <span style="color: #E8D8B8; font-size: 14px;">${escapeHtml(data.space)}</span>
              </td>
            </tr>
            ${data.message ? `
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #33231b;">
                <span style="color: #C59A4A; display: inline-block; width: 28px;">&#128172;</span>
                <strong style="color: #E8D8B8; display: inline-block; width: 80px; font-size: 13px;">Message :</strong>
                <span style="color: #E8D8B8; font-style: italic; font-size: 13px;">${escapeHtml(data.message)}</span>
              </td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 12px 0 4px 0;">
                <span style="color: #C59A4A; display: inline-block; width: 28px;">&#128203;</span>
                <strong style="color: #E8D8B8; display: inline-block; width: 80px; font-size: 13px;">Statut :</strong>
                <span style="display: inline-block; background-color: #B86B32; color: #fff; padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: bold; text-transform: uppercase;">${escapeHtml(data.status)}</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    
    <p style="margin: 0; font-size: 14px; line-height: 1.7; color: #aaa;">
      Merci de votre confiance, <strong style="color: #C59A4A;">${escapeHtml(data.name)}</strong>. 
      Nous avons h&acirc;te de vous accueillir chez La Cachette !&nbsp;&#127870;
    </p>
  `;

  return emailLayout(content, `Votre demande de réservation à La Cachette pour le ${data.date}`);
}

export function buildStatusUpdateClientEmail(data: StatusUpdateData): string {
  let bgColor = '#4A2C20';
  let bannerText = data.status;
  let closingMessage = `Merci de votre confiance, <strong style="color: #C59A4A;">${escapeHtml(data.name)}</strong>.`;

  switch (data.statusKey) {
    case 'CONFIRMED':
      bgColor = '#596044';
      bannerText = '&#9989; R&eacute;servation Confirm&eacute;e';
      closingMessage = `Merci, <strong style="color: #C59A4A;">${escapeHtml(data.name)}</strong> ! Nous vous attendons avec impatience. &Agrave; tr&egrave;s bient&ocirc;t chez La Cachette&nbsp;&#127870;`;
      break;
    case 'CANCELLED':
      bgColor = '#9A4F32';
      bannerText = '&#10060; R&eacute;servation Annul&eacute;e';
      closingMessage = `Nous sommes d&eacute;sol&eacute;s de ne pas pouvoir vous accueillir cette fois, <strong style="color: #C59A4A;">${escapeHtml(data.name)}</strong>. N&rsquo;h&eacute;sitez pas &agrave; refaire une r&eacute;servation quand vous le souhaitez.`;
      break;
    case 'RESCHEDULED':
      bgColor = '#4A6FA5';
      bannerText = '&#128197; R&eacute;servation Report&eacute;e';
      closingMessage = `Votre nouvelle date est not&eacute;e, <strong style="color: #C59A4A;">${escapeHtml(data.name)}</strong>. Nous avons h&acirc;te de vous voir !`;
      break;
    case 'OTHER':
      bgColor = '#596044';
      bannerText = '&#128179; R&egrave;glement Confirm&eacute;';
      closingMessage = `Merci <strong style="color: #C59A4A;">${escapeHtml(data.name)}</strong>, votre r&egrave;glement a bien &eacute;t&eacute; re&ccedil;u. &Agrave; tr&egrave;s bient&ocirc;t&nbsp;!`;
      break;
    case 'PENDING':
      bgColor = '#C59A4A';
      bannerText = '&#8205;&#9203; En Attente de Confirmation';
      break;
  }

  const content = `
    <p style="margin: 0 0 20px; font-size: 18px;">Bonjour <strong style="color: #C59A4A;">${escapeHtml(data.name)}</strong>,</p>
    
    <div style="background-color: ${bgColor}; padding: 16px 20px; border-radius: 8px; margin-bottom: 24px; text-align: center;">
      <h2 style="margin: 0; color: #ffffff; font-size: 18px; font-family: -apple-system, BlinkMacSystemFont, sans-serif; letter-spacing: 1px;">${bannerText}</h2>
    </div>
    
    ${data.statusNote ? `
    <div style="margin-bottom: 24px; padding: 16px; background-color: #1a1614; border-left: 3px solid ${bgColor}; border-radius: 4px;">
      <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #E8D8B8;"><strong style="color: #C59A4A;">Note de l&rsquo;&eacute;quipe :</strong><br>${escapeHtml(data.statusNote)}</p>
    </div>
    ` : ''}
    
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px; background-color: #241c18; border-radius: 8px; overflow: hidden;">
      <tr>
        <td style="padding: 16px 20px; border-bottom: 1px solid #4A2C20;">
          <p style="margin: 0; color: #C59A4A; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: bold;">D&eacute;tails de votre r&eacute;servation</p>
        </td>
      </tr>
      <tr>
        <td style="padding: 20px;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #33231b;">
                <span style="color: #C59A4A; display: inline-block; width: 28px;">&#128197;</span>
                <strong style="color: #E8D8B8; display: inline-block; width: 80px; font-size: 13px;">Date :</strong>
                <span style="color: #E8D8B8; font-size: 14px;">${escapeHtml(data.date)}</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #33231b;">
                <span style="color: #C59A4A; display: inline-block; width: 28px;">&#8987;</span>
                <strong style="color: #E8D8B8; display: inline-block; width: 80px; font-size: 13px;">Heure :</strong>
                <span style="color: #E8D8B8; font-size: 14px;">${escapeHtml(data.time)}</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #33231b;">
                <span style="color: #C59A4A; display: inline-block; width: 28px;">&#128101;</span>
                <strong style="color: #E8D8B8; display: inline-block; width: 80px; font-size: 13px;">Convives :</strong>
                <span style="color: #E8D8B8; font-size: 14px;">${escapeHtml(data.guests.toString())} personne${data.guests > 1 ? 's' : ''}</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0;">
                <span style="color: #C59A4A; display: inline-block; width: 28px;">&#128205;</span>
                <strong style="color: #E8D8B8; display: inline-block; width: 80px; font-size: 13px;">Espace :</strong>
                <span style="color: #E8D8B8; font-size: 14px;">${escapeHtml(data.space)}</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <p style="margin: 0; font-size: 14px; line-height: 1.7; color: #aaa;">${closingMessage}</p>
  `;

  return emailLayout(content, `Mise à jour de votre réservation à La Cachette : ${data.status}`);
}
