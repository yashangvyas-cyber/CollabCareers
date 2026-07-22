# User Stories — External Interview Panelists (continued)

> Continues the story set that starts with **"Invite external Panelist"** (Story 1, already written).
> Same format throughout: Story → Pre-condition → Acceptance Criteria → Field Values →
> Validations → Post-condition → Impact. Examples use the demo data: candidate **Arjun Mehta**
> (Flutter Developer), round **Technical Round, 25-Jul-2026, 10:00 AM IST**, external panelists
> **Alice Johnson, Bob Williams, Carol Davis, Dan Brown** (all `@external.com`).

---

## Story 2 — View external panelists in interview details

**Story:**
As a recruiter, I want to see every external panelist invited to an interview round — along with
their current status, availability response and submitted feedback — inside the candidate's
Interview Details, so that I always know where each outside panelist stands without digging
through emails.

**Pre-condition:**
1. At least one external panelist has been invited on the round (Story 1).
2. The recruiter has permission to view the candidate's interview details.

**Acceptance Criteria:**
1. Path: Job Applications → open candidate → **Interview Details** tab → round card → **Interview Panel** section.
2. External panelists appear as **chips in the same row as internal panel members** — initials avatar + full name + a small colored **status dot**.
   *Example: the round shows `SU Super User` (internal) and then `AJ Alice Johnson ●`, `BW Bob Williams ●`, `CD Carol Davis ●`, `DB ~~Dan Brown~~ ●`.*
3. Status dot color tells the status at a glance:
   | Status | Dot color | Chip look |
   |---|---|---|
   | Invited | Indigo | Normal |
   | Availability Confirmed | Green | Normal |
   | Availability Declined | Orange | Normal |
   | Feedback Submitted | Purple | Normal |
   | Cancelled | Grey | Greyed out, name struck through, dashed border |
4. **Hovering a chip opens a small card** showing: "External Panelist" label, full name, **email address**, status chip, availability response if given (*"✓ Available"* or *"✕ Not available"*, plus the panelist's note in italics), and the Cancel / Resend actions (Story 3).
   *Example: hovering `Bob Williams` shows `bob.williams@external.com`, chip `Availability Confirmed`, line `✓ Available`.*
5. When an external panelist has **submitted feedback**, a separate row appears under the round in the same style as internal feedback:
   **"Interview Panel Feedback (Provided by Carol Davis) `External`"** — expanding it shows the per-criteria star ratings with remarks, the **Average Rating**, the **Overall Remarks**, and the panelist's **suggestion** (e.g. Should Hire).
6. External feedback is shown **separately** and is **NOT counted** in the round's internal Feedback Score average.
7. Cancelled panelists stay visible (greyed) — they are never silently removed, so the round history stays complete.

**Field Values:**
| Field | Where shown | Value |
|---|---|---|
| Name | Chip + hover card | First + Last name as entered while inviting |
| Email | Hover card only | As entered while inviting |
| Status | Dot + hover card chip | Invited / Availability Confirmed / Availability Declined / Feedback Submitted / Cancelled |
| Availability | Hover card | ✓ Available / ✕ Not available + optional note |
| Feedback | Separate feedback row | Suggestion, per-criteria ratings (0–10 stars), remarks, average, overall remarks |

**Validations:**
1. Chips wrap to the next line when there are many panelists — the layout must never break or overflow the panel (works with 10+ panelists).
2. A long email in the hover card is truncated with "…" rather than stretching the card.

**Post-condition:**
1. The view always reflects the **live status** — the moment a panelist confirms availability or submits feedback through their secure link, the chip dot, hover card, and feedback rows update.

**Impact:**
1. Candidate → Interview Details tab (Interview Panel section + feedback rows).
2. Round Feedback Score calculation (must exclude external scores).

---

## Story 3 — Cancel / Resend an external panelist invitation

**Story:**
As a recruiter, I want to cancel an external panelist's invitation when they are no longer
needed, or resend the invitation email when they lost it or haven't responded, so that I can
manage the external panel without re-scheduling the whole round.

**Pre-condition:**
1. The external panelist already exists on the round (Story 1).
2. Actions are reached from the panelist's hover card in Interview Details (Story 2).

**Acceptance Criteria:**

*Cancel:*
1. The hover card of every non-cancelled panelist shows a **Cancel** button.
2. Cancel asks for confirmation before acting — the button changes to **"Confirm cancel?"** (red); a second click confirms; moving the mouse away resets it. This prevents accidental cancellation.
3. On confirmation: status becomes **Cancelled**, the chip turns grey with the name struck through, and a toast shows *"Invitation cancelled for dan.brown@external.com"*.
4. The panelist's **secure link stops working immediately** — opening it now shows a "This invitation has been cancelled" screen instead of the interview details.
5. If the panelist had already submitted feedback before cancellation, that feedback **stays visible** to the recruiter (marked as from a cancelled panelist) — it is a record, not deleted.

*Resend:*
6. Every panelist's hover card shows a **Resend** button.
7. Resend sends the **same invitation email with the same secure link** again, and shows a toast *"Invite resent to alice.johnson@external.com"*.
8. Resending does **not** change an active panelist's status — if Bob already confirmed availability, he stays "Availability Confirmed"; his progress is never reset by a resend.
9. Resending a **Cancelled** panelist **re-activates** the invitation — status returns to **Invited** and the secure link works again.
   *Example: Dan Brown was cancelled by mistake → recruiter hovers his greyed chip → Resend → Dan is "Invited" again and receives the email.*

**Field Values:**
| Action | Available when | Result status |
|---|---|---|
| Cancel | Status is anything except Cancelled | Cancelled |
| Resend | Always | Unchanged (active panelist) / Invited (was Cancelled) |

**Validations:**
1. Cancel is never shown for an already-cancelled panelist (only Resend remains).
2. Cancel requires the two-step confirmation — a single stray click must not cancel anyone.

**Post-condition:**
1. Cancelled panelist: link dead, chip greyed, feedback (if any) retained, recruiter toast shown.
2. Resent panelist: email delivered again with the same link; cancelled ones become Invited again.

**Impact:**
1. Candidate → Interview Details tab (hover card actions, chip state).
2. External panelist's secure page (`cancelled` screen when the link is dead).
3. Email sending (resend uses the same invitation email as Story 1 — no new template).

---

## Recruiter Notification Emails

Three system emails to the **recruiter who scheduled the round**, sent when an external
panelist responds. Same visual template as the panelist emails (brand header, detail rows,
one button). Subjects front-load the useful facts — who, what, which interview.

---

### Email 1 — Panelist accepted the invitation (availability confirmed)

**Subject:** `Bob Williams is available — Arjun Mehta · Technical Round (25-Jul-2026)`

**Body:**

> Hi **Gurpreetsingh**,
>
> **Bob Williams** (bob.williams@external.com) has confirmed availability for the interview below.
>
> | | |
> |---|---|
> | Candidate | Arjun Mehta |
> | Role | Flutter Developer |
> | Interview Round | Round 1 — Technical Round |
> | Interview Date | 25-Jul-2026 · 10:00 AM IST (GMT+5:30) |
> | Panelist's note | "Happy to join, please share the meet link 10 minutes early." |
>
> No action is needed — this is a confirmation for your records.
>
> **[ View Interview Details ]**

*The "Panelist's note" row appears only when the panelist wrote one.*

---

### Email 2 — Panelist declined the invitation (not available)

**Subject:** `Bob Williams is unavailable — Arjun Mehta · Technical Round (25-Jul-2026)`

**Body:**

> Hi **Gurpreetsingh**,
>
> **Bob Williams** (bob.williams@external.com) is **not available** for the interview below.
>
> | | |
> |---|---|
> | Candidate | Arjun Mehta |
> | Role | Flutter Developer |
> | Interview Round | Round 1 — Technical Round |
> | Interview Date | 25-Jul-2026 · 10:00 AM IST (GMT+5:30) |
> | Panelist's note | "I am travelling that week — happy to help any day after the 28th." |
>
> You may want to **invite another panelist** or **reschedule the round**.
>
> **[ View Interview Details ]**

---

### Email 3 — Panelist submitted feedback

**Subject:** `Feedback received from Carol Davis — Arjun Mehta · Technical Round`

**Body:**

> Hi **Gurpreetsingh**,
>
> **Carol Davis** (carol.davis@external.com) has submitted interview feedback.
>
> | | |
> |---|---|
> | Candidate | Arjun Mehta |
> | Role | Flutter Developer |
> | Interview Round | Round 1 — Technical Round |
> | Suggestion | **Should Hire** |
> | Average Rating | 8 / 10 |
>
> The full feedback — per-skill ratings and remarks — is available on the interview details page.
>
> **[ View Feedback ]**

---

### Rules common to all three notification emails

1. Sent **only to the recruiter who scheduled the round** (the "Scheduled by" user).
2. Sent **immediately** when the panelist submits their response.
3. The button opens the candidate's Interview Details with the round in view.
4. If a panelist changes their availability later (allowed until feedback is submitted), the recruiter gets a fresh Email 1 or Email 2 — the latest response always wins.
5. No notification is sent for a **Cancelled** panelist's link activity (the link is dead).
