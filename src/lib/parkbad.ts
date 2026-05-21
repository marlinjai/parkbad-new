/**
 * Parkbad Gütersloh facts that depend on the current date.
 *
 * Both helpers derive their value from `new Date()`, so they roll over on
 * their own every 1 January — no manual edit, no cron job. The history page
 * (server component, revalidates hourly) picks up the new value within an
 * hour of New Year; the footer (client component) updates instantly in the
 * visitor's browser.
 */

/** The year the Parkbad Gütersloh opened. */
export const PARKBAD_FOUNDING_YEAR = 1928;

/**
 * Years since the Parkbad opened: 98 in 2026, 99 in 2027, 100 in 2028.
 */
export function getParkbadYears(): number {
  return new Date().getFullYear() - PARKBAD_FOUNDING_YEAR;
}

/** The current calendar year — used for the footer copyright notice. */
export function getCurrentYear(): number {
  return new Date().getFullYear();
}
