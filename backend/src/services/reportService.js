const PDFDocument = require('pdfkit');
const { Parser } = require('json2csv');

/**
 * Streams a PDF summary report of the repository analytics directly
 * to the HTTP response.
 */
function streamPdfReport(res, analytics) {
  const { repository, health, languages, contributors, pulls, issues, releases } = analytics;

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${repository.full_name.replace('/', '-')}-report.pdf"`
  );

  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(res);

  doc.fontSize(20).text(`${repository.full_name}`, { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(10).fillColor('gray').text(repository.description || 'No description provided');
  doc.fillColor('black').moveDown();

  doc.fontSize(14).text('Overview', { underline: true });
  doc.fontSize(11).moveDown(0.3);
  doc.text(`Stars: ${repository.stars}   Forks: ${repository.forks}   Watchers: ${repository.watchers}`);
  doc.text(`Open Issues: ${repository.open_issues}   License: ${repository.license || 'N/A'}`);
  doc.text(`Default Branch: ${repository.default_branch}`);
  doc.moveDown();

  doc.fontSize(14).text('Health Score', { underline: true });
  doc.fontSize(11).moveDown(0.3);
  doc.text(`Score: ${health.score} / 100  (${health.rating}★)`);
  Object.entries(health.breakdown).forEach(([key, value]) => {
    doc.text(`  - ${key}: ${value}`);
  });
  doc.moveDown();

  doc.fontSize(14).text('Languages', { underline: true });
  doc.fontSize(11).moveDown(0.3);
  Object.entries(languages || {}).forEach(([lang, bytes]) => {
    doc.text(`  - ${lang}: ${bytes.toLocaleString()} bytes`);
  });
  doc.moveDown();

  doc.fontSize(14).text('Top Contributors', { underline: true });
  doc.fontSize(11).moveDown(0.3);
  (contributors || []).slice(0, 10).forEach((c, i) => {
    doc.text(`  ${i + 1}. ${c.login} — ${c.contributions} commits`);
  });
  doc.moveDown();

  doc.fontSize(14).text('Pull Requests & Issues', { underline: true });
  doc.fontSize(11).moveDown(0.3);
  doc.text(`  Pull Requests: ${pulls.total} total (${pulls.open} open, ${pulls.merged} merged, ${pulls.closed} closed)`);
  doc.text(`  Issues: ${issues.total} total (${issues.open} open, ${issues.closed} closed)`);
  doc.moveDown();

  doc.fontSize(14).text('Releases', { underline: true });
  doc.fontSize(11).moveDown(0.3);
  doc.text(`  Total releases: ${releases.total}`);
  if (releases.latest) {
    doc.text(`  Latest: ${releases.latest.tag_name} (${releases.latest.published_at})`);
  }

  doc.end();
}

/**
 * Sends a flattened CSV summary of the analytics as an attachment.
 */
function sendCsvReport(res, analytics) {
  const { repository, health, pulls, issues, releases } = analytics;

  const flat = [
    {
      repository: repository.full_name,
      stars: repository.stars,
      forks: repository.forks,
      watchers: repository.watchers,
      open_issues: repository.open_issues,
      license: repository.license,
      health_score: health.score,
      health_rating: health.rating,
      pulls_total: pulls.total,
      pulls_open: pulls.open,
      pulls_merged: pulls.merged,
      issues_total: issues.total,
      issues_open: issues.open,
      issues_closed: issues.closed,
      releases_total: releases.total,
      latest_release: releases.latest ? releases.latest.tag_name : '',
    },
  ];

  const parser = new Parser();
  const csv = parser.parse(flat);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${repository.full_name.replace('/', '-')}-report.csv"`
  );
  res.send(csv);
}

function sendJsonReport(res, analytics) {
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${analytics.repository.full_name.replace('/', '-')}-report.json"`
  );
  res.status(200).json({ status: true, data: analytics });
}

module.exports = { streamPdfReport, sendCsvReport, sendJsonReport };
