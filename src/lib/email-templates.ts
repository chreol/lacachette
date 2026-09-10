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
        <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; margin: 0 auto; background-color: #1a1614; border-top: 4px solid #C59A4A; border-radius: 4px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.5);">
          <tr>
            <td align="center" style="padding: 40px 30px; background-color: #130f0d;">
              <h1 style="margin: 0; font-family: 'Playfair Display', Georgia, serif; color: #C59A4A; font-size: 28px; font-weight: normal; letter-spacing: 2px;">LA CACHETTE</h1>
              <p style="margin: 10px 0 0; color: #B86B32; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Restaurant-Bar &middot; &Eacute;ki&eacute;, Yaound&eacute;</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px;">
              ${content}
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 30px; background-color: #130f0d; border-top: 1px solid #33231b;">
              <p style="margin: 0 0 10px; color: #E8D8B8; font-size: 14px;">La Cachette &mdash; &Eacute;ki&eacute;, Yaound&eacute;</p>
              <p style="margin: 0 0 10px; color: #888; font-size: 14px;"><a href="https://restolacachette.chreolempire.com" style="color: #C59A4A; text-decoration: none;">restolacachette.chreolempire.com</a></p>
              <p style="margin: 0; color: #666; font-size: 12px;">&copy; ${new Date().getFullYear()} La Cachette. Tous droits r&eacute;serv&eacute;s.</p>
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
    <h2 style="margin: 0 0 20px; font-family: 'Playfair Display', Georgia, serif; color: #E8D8B8; font-size: 22px; font-weight: normal;">&#127869;&#65039; Nouvelle Demande de R&eacute;servation</h2>
    
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 25px; background-color: #241c18; border-radius: 8px; overflow: hidden;">
      <tr>
        <td style="padding: 20px;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #33231b;">
                <strong style="color: #C59A4A; display: inline-block; width: 120px;">Client :</strong>
                <span style="color: #E8D8B8;">${escapeHtml(data.name)}</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #33231b;">
                <strong style="color: #C59A4A; display: inline-block; width: 120px;">T&eacute;l&eacute;phone :</strong>
                <span style="color: #E8D8B8;">${escapeHtml(data.phone)}</span>
              </td>
            </tr>
            ${data.email ? `
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #33231b;">
                <strong style="color: #C59A4A; display: inline-block; width: 120px;">Email :</strong>
                <span style="color: #E8D8B8;">${escapeHtml(data.email)}</span>
              </td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #33231b;">
                <strong style="color: #C59A4A; display: inline-block; width: 120px;">Date :</strong>
                <span style="color: #E8D8B8;">${escapeHtml(data.date)} &agrave; ${escapeHtml(data.time)}</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #33231b;">
                <strong style="color: #C59A4A; display: inline-block; width: 120px;">Convives :</strong>
                <span style="color: #E8D8B8;">${escapeHtml(data.guests.toString())}</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #33231b;">
                <strong style="color: #C59A4A; display: inline-block; width: 120px;">Espace :</strong>
                <span style="color: #E8D8B8;">${escapeHtml(data.space)}</span>
              </td>
            </tr>
            ${data.message ? `
            <tr>
              <td style="padding: 8px 0;">
                <strong style="color: #C59A4A; display: block; margin-bottom: 4px;">Message :</strong>
                <div style="color: #E8D8B8; background-color: #1a1614; padding: 10px; border-radius: 4px; font-style: italic;">${escapeHtml(data.message)}</div>
              </td>
            </tr>
            ` : ''}
          </table>
        </td>
      </tr>
    </table>
    
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center" style="padding-bottom: 15px;">
          <a href="${escapeHtml(data.adminUrl)}" style="display: inline-block; padding: 12px 24px; background-color: #C59A4A; color: #171310; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px; width: 250px; text-align: center;">G&eacute;rer dans l'Admin</a>
        </td>
      </tr>
      <tr>
        <td align="center">
          <a href="${escapeHtml(data.whatsappLink)}" style="display: inline-block; padding: 12px 24px; background-color: #25D366; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px; width: 250px; text-align: center;">Contacter sur WhatsApp</a>
        </td>
      </tr>
    </table>
  `;

  return emailLayout(content, `Nouvelle réservation de ${data.name} pour le ${data.date}`);
}

export function buildReservationConfirmationClientEmail(data: ClientConfirmationData): string {
  const content = `
    <p style="margin: 0 0 20px; font-size: 16px;">Bonjour <strong>${escapeHtml(data.name)}</strong>,</p>
    
    <p style="margin: 0 0 25px; font-size: 16px; line-height: 1.5;">Votre demande de r&eacute;servation a bien &eacute;t&eacute; enregistr&eacute;e.</p>
    
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 25px; background-color: #241c18; border-radius: 8px; overflow: hidden; border-left: 4px solid #C59A4A;">
      <tr>
        <td style="padding: 20px;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #33231b;">
                <span style="color: #C59A4A; display: inline-block; width: 30px;">&#128197;</span>
                <strong style="color: #E8D8B8; display: inline-block; width: 80px;">Date :</strong>
                <span style="color: #E8D8B8;">${escapeHtml(data.date)}</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #33231b;">
                <span style="color: #C59A4A; display: inline-block; width: 30px;">&#128336;</span>
                <strong style="color: #E8D8B8; display: inline-block; width: 80px;">Heure :</strong>
                <span style="color: #E8D8B8;">${escapeHtml(data.time)}</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #33231b;">
                <span style="color: #C59A4A; display: inline-block; width: 30px;">&#128101;</span>
                <strong style="color: #E8D8B8; display: inline-block; width: 80px;">Convives :</strong>
                <span style="color: #E8D8B8;">${escapeHtml(data.guests.toString())}</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #33231b;">
                <span style="color: #C59A4A; display: inline-block; width: 30px;">&#128205;</span>
                <strong style="color: #E8D8B8; display: inline-block; width: 80px;">Espace :</strong>
                <span style="color: #E8D8B8;">${escapeHtml(data.space)}</span>
              </td>
            </tr>
            ${data.message ? `
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #33231b;">
                <span style="color: #C59A4A; display: inline-block; width: 30px;">&#128172;</span>
                <strong style="color: #E8D8B8; display: inline-block; width: 80px;">Message :</strong>
                <span style="color: #E8D8B8;">${escapeHtml(data.message)}</span>
              </td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 12px 0 4px 0;">
                <span style="color: #C59A4A; display: inline-block; width: 30px;">&#128203;</span>
                <strong style="color: #E8D8B8; display: inline-block; width: 80px;">Statut :</strong>
                <span style="display: inline-block; background-color: #B86B32; color: #171310; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: bold; text-transform: uppercase;">${escapeHtml(data.status)}</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    
    <p style="margin: 0; font-size: 15px; line-height: 1.5; color: #aaa; font-style: italic;">
      Notre &eacute;quipe vous contactera tr&egrave;s prochainement via WhatsApp pour confirmer votre r&eacute;servation.
    </p>
  `;

  return emailLayout(content, `Votre demande de réservation à La Cachette pour le ${data.date}`);
}

export function buildStatusUpdateClientEmail(data: StatusUpdateData): string {
  let bgColor = '#4A2C20';
  let bannerText = data.status;
  
  switch (data.statusKey) {
    case 'CONFIRMED':
      bgColor = '#596044';
      bannerText = '&#9989; R&eacute;servation Confirm&eacute;e';
      break;
    case 'CANCELLED':
      bgColor = '#9A4F32';
      bannerText = '&#10060; R&eacute;servation Annul&eacute;e';
      break;
    case 'RESCHEDULED':
      bgColor = '#4A6FA5';
      bannerText = '&#128197; R&eacute;servation D&eacute;cal&eacute;e';
      break;
    case 'PENDING':
      bgColor = '#C59A4A';
      bannerText = '&#8205;&#9203; En Attente';
      break;
  }

  const content = `
    <p style="margin: 0 0 20px; font-size: 16px;">Bonjour <strong>${escapeHtml(data.name)}</strong>,</p>
    
    <div style="background-color: ${bgColor}; padding: 15px 20px; border-radius: 6px; margin-bottom: 25px; text-align: center;">
      <h2 style="margin: 0; color: #ffffff; font-size: 18px; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">${bannerText}</h2>
    </div>
    
    ${data.statusNote ? `
    <div style="margin-bottom: 25px; padding: 15px; background-color: #1a1614; border-left: 3px solid ${bgColor}; border-radius: 4px;">
      <p style="margin: 0; font-size: 15px; line-height: 1.5; color: #E8D8B8;"><strong>Mot de l'&eacute;quipe :</strong> ${escapeHtml(data.statusNote)}</p>
    </div>
    ` : ''}
    
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 10px; background-color: #241c18; border-radius: 8px; overflow: hidden;">
      <tr>
        <td style="padding: 20px;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #33231b;">
                <span style="color: #C59A4A; display: inline-block; width: 30px;">&#128197;</span>
                <strong style="color: #E8D8B8; display: inline-block; width: 80px;">Date :</strong>
                <span style="color: #E8D8B8;">${escapeHtml(data.date)}</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #33231b;">
                <span style="color: #C59A4A; display: inline-block; width: 30px;">&#128336;</span>
                <strong style="color: #E8D8B8; display: inline-block; width: 80px;">Heure :</strong>
                <span style="color: #E8D8B8;">${escapeHtml(data.time)}</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #33231b;">
                <span style="color: #C59A4A; display: inline-block; width: 30px;">&#128101;</span>
                <strong style="color: #E8D8B8; display: inline-block; width: 80px;">Convives :</strong>
                <span style="color: #E8D8B8;">${escapeHtml(data.guests.toString())}</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0;">
                <span style="color: #C59A4A; display: inline-block; width: 30px;">&#128205;</span>
                <strong style="color: #E8D8B8; display: inline-block; width: 80px;">Espace :</strong>
                <span style="color: #E8D8B8;">${escapeHtml(data.space)}</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;

  return emailLayout(content, `Mise à jour de votre réservation à La Cachette : ${data.status}`);
}
