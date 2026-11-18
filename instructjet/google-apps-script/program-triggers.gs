/**
 * InstructJet – Business Support Program triggers (replaces Vercel Cron).
 *
 * Setup (once):
 *  1. Open https://script.google.com → New project (or add this file to the
 *     existing OTP / send_email Apps Script project).
 *  2. Project Settings → Time zone: Asia/Jakarta (or yours). Trigger hours use it.
 *  3. Project Settings → Script properties → add:
 *       APP_URL              https://instructjet.com        (no trailing slash)
 *       PROGRAM_CRON_SECRET  same value as PROGRAM_CRON_SECRET in Vercel
 *  4. Select `setupProgramTriggers` in the toolbar and click Run. Approve the
 *     permissions (external requests + triggers).
 *  5. Optional: run `testDailyEmails` / `testWeeklyScrape` once and check
 *     View → Executions for the logged results.
 *
 * What it does:
 *  - runDailyProgramEmails: every day at DAILY_HOUR. Calls the daily endpoint in
 *    batches until every participant has been handled.
 *  - runWeeklyScrape: every SCRAPE_WEEKDAY at SCRAPE_HOUR. Refreshes the catalog
 *    one type per request (UrlFetchApp gives up after ~60s per request).
 *    Runs the evening before the week starts so Monday's picks are fresh.
 */

var DAILY_HOUR = 8;                                   // 08:00–09:00 script time zone
var SCRAPE_WEEKDAY = ScriptApp.WeekDay.SUNDAY;
var SCRAPE_HOUR = 20;
var SCRAPE_TYPES = ['networking_event', 'investor_event', 'course', 'community', 'other'];
var MAX_DAILY_BATCHES = 40;                           // 40 × 15 participants = 600 per day

function config_() {
  var props = PropertiesService.getScriptProperties();
  var appUrl = (props.getProperty('APP_URL') || '').replace(/\/$/, '');
  var secret = props.getProperty('PROGRAM_CRON_SECRET');
  if (!appUrl || !secret) throw new Error('Set APP_URL and PROGRAM_CRON_SECRET in Script properties');
  return { appUrl: appUrl, secret: secret };
}

function call_(path) {
  var cfg = config_();
  var res = UrlFetchApp.fetch(cfg.appUrl + path, {
    method: 'post',
    headers: { Authorization: 'Bearer ' + cfg.secret },
    muteHttpExceptions: true,
  });
  var code = res.getResponseCode();
  var text = res.getContentText();
  var json = null;
  try { json = JSON.parse(text); } catch (e) {}
  if (code >= 300) {
    console.error(path + ' → HTTP ' + code + ': ' + text.slice(0, 500));
    return null;
  }
  console.log(path + ' → ' + text.slice(0, 500));
  return json;
}

function runDailyProgramEmails() {
  var totals = { sent: 0, failed: 0, skipped: 0 };
  for (var i = 0; i < MAX_DAILY_BATCHES; i++) {
    var r = call_('/api/program/cron/daily?limit=15');
    if (!r) break;
    totals.sent += r.sent || 0;
    totals.failed += r.failed || 0;
    totals.skipped += r.skipped || 0;
    if (r.paused || !r.remaining) break;
  }
  console.log('Daily program emails: ' + JSON.stringify(totals));
}

function runWeeklyScrape() {
  SCRAPE_TYPES.forEach(function (type) {
    call_('/api/program/cron/scrape?type=' + type);
  });
}

function setupProgramTriggers() {
  var handlers = ['runDailyProgramEmails', 'runWeeklyScrape'];
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (handlers.indexOf(t.getHandlerFunction()) !== -1) ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('runDailyProgramEmails').timeBased().everyDays(1).atHour(DAILY_HOUR).create();
  ScriptApp.newTrigger('runWeeklyScrape').timeBased().onWeekDay(SCRAPE_WEEKDAY).atHour(SCRAPE_HOUR).create();
  console.log('Triggers installed: daily emails at ' + DAILY_HOUR + ':00, weekly scrape on ' + SCRAPE_WEEKDAY + ' at ' + SCRAPE_HOUR + ':00');
}

function testDailyEmails() { runDailyProgramEmails(); }
function testWeeklyScrape() { runWeeklyScrape(); }
