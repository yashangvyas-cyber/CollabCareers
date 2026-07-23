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
2. External panelists appear as **chips in the same row as internal panel members** — initials avatar + full name + a small **`External`** tag + a small colored **status dot** — so outside panelists are identifiable at a glance, without hovering.
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

## Story 4 — Panelist views the interview details & responds with availability (secure link)

**Story:**
As an external panelist, I want my secure email link to open a page with everything about the
interview — the candidate, their CV, the job, the round, the date & time with a clear timezone,
and where to join — and to accept or decline the invitation right there with an optional note,
so that I can prepare and respond without creating any account or logging in.

**Pre-condition:**
1. The panelist received the invitation email (Story 1) and clicks its button.
2. The invitation has not been cancelled by the recruiter.

**Acceptance Criteria:**

*Viewing the interview details:*
1. The email button opens a **secure link** (`/panel/<token>`) — **no login, no signup, no OTP**. The link works only for that one panelist and that one interview.
2. The page is branded with the platform + the job's **business unit** (logo and brand color).
   *Example: Arjun Mehta's round shows the MindInventory logo and its pink-red accent.*
3. **Candidate panel** shows: name, job title, email, phone, LinkedIn profile link, **View Resume** (opens the CV), Total Experience, Skills, Notice Period (Days), Current Organization.
   *Example: Arjun Mehta · Flutter Developer · 2Y 5M · Dart, Firebase, Flutter · FlutterApps.*
4. **Round block** shows: round number & name, mode with meeting type, **date & time with the timezone spelled out** — external panelists have no timezone settings of their own, so the zone is always explicit.
   *Example: `25/Jul/2026 · 10:00 AM IST (GMT+5:30)` — never a bare `25/Jul/2026, 10:00`.*
5. Where to join depends on the mode:
   - **Online** → a **Join Link** row with a "Join Google Meet" button.
   - **Offline** → a **Location** row with the business unit's office address.
   *Example (offline): 4th Floor, Shivalik Shilp, Iscon Cross Rd, Ahmedabad, Gujarat 380015.*
6. A wrong or expired link shows an **"Invalid Link"** screen; a cancelled invitation shows a **"cancelled"** screen — never someone else's data, never an error dump.

*Responding with availability:*
7. A bar titled **"Interview Panel Invitation"** sits at the top (it stays visible while scrolling): *"Can you join this interview? The recruiter is notified by email."* with **Accept** and **Decline** buttons.
8. Responding is **double-confirm**: clicking **Accept** or **Decline** opens a compact confirmation dialog — title *"Accept this invitation?"* / *"Decline this invitation?"*, the **optional note** box, the line *"The recruiter will be notified by email."*, and **Go back / Yes, accept invitation** (or *Yes, decline invitation*) buttons. Nothing is sent until the "Yes" button. The dialog does **not** repeat the interview details — they are fully visible on the page behind it.
9. The note box hints at what to write — accepting: *"Add a note for the recruiter… (optional)"*; declining: *"Propose an alternate time or leave a message… (optional)"*.
   *Example: Emma Clarke declines with "I am travelling that week — happy to help any day after the 28th."*
10. On confirming in the dialog, a toast confirms: *"Response submitted — Accepted. The recruiter has been notified via email."* and the bar changes to a status line: **"You've accepted / declined this interview invitation."**
11. The panelist can **change their response later** (Change response) — until they submit feedback. The latest response always wins.
12. The **feedback form stays locked until the panelist accepts** — someone who declined (or hasn't answered) cannot rate the candidate.

*What the recruiter sees after:*
13. In Interview Details the panelist's chip dot changes — green for accepted, orange for declined — and the hover card shows *"✓ Available"* or *"✕ Not available"* plus the note (Story 2).
14. The recruiter receives notification **Email 1 (accepted)** or **Email 2 (declined)** — formats below.

**Field Values:**
| Field | Type | Mandatory | Notes |
|---|---|---|---|
| Accept / Decline | Choice (one of two) | Yes | Two-step: choice + Confirm |
| Note | Free text, max 500 characters | No | Sent to the recruiter along with the response |

**Validations:**
1. A response is never sent by a single click — the confirmation dialog must be explicitly confirmed ("Yes, accept/decline invitation"). Go back closes it with nothing sent.
2. The note is optional — Confirm works with it empty.
3. A cancelled or invalid link can never submit a response.

**Post-condition:**
1. Panelist status changes: Invited → **Availability Confirmed** (accepted) or **Availability Declined** (declined).
2. The recruiter's view and email are updated immediately (AC 13–14).
3. Accepting unlocks the feedback form; declining keeps it locked.

**Impact:**
1. New public page at `/panel/<token>` — outside the login wall; must expose nothing beyond this one interview.
2. Interview Details view (Story 2 — chip status + hover card).
3. Recruiter notification emails 1 and 2 (below).

---

## Story 5 — Panelist submits interview feedback & receives a receipt email

**Story:**
As an external panelist, I want to rate the candidate on each skill, give my hiring suggestion
and overall remarks on the same secure page — and then receive a receipt email that lets me
re-open and see exactly what I submitted — so that my evaluation reaches the recruiter
instantly and I keep a copy for my own reference.

**Pre-condition:**
1. The panelist has **accepted** the invitation (Story 4) — feedback stays locked before that. The collapsed bar reads *"Interview Panel Feedback (Accept the invitation first)"* until then.
2. The **interview start time has passed** — before that the bar reads *"(Opens after the interview starts — …)"* even for accepted panelists (Story 6, AC 3).
3. The invitation has not been cancelled.

**Acceptance Criteria:**

*Submitting feedback:*
1. On the secure page, the panelist opens **"Interview Panel Feedback (Tap to add feedback)"** — a collapsible section under the interview details.
2. The form has three parts:
   - **Interview Panel Suggestion** * — five choice pills: **Next Round · No Show/Cancel · Not Sure · Should Hire · Should Reject** (one must be selected).
   - **One rating row per skill** defined on the job — a **0–10 star rating** with a live *"N out of 10"* readout, plus an optional remark box (*"Remark for Flutter expertise…"*).
     *Example: the Flutter Developer job rates Flutter expertise, State management, App store delivery experience, Code quality.*
   - **Overall Remarks** * — free-text summary.
3. On **Submit Feedback**: a toast confirms *"Feedback submitted. The recruiter has been notified via email."* and the section becomes a read-only **"Your Feedback (Submitted)"** summary.
4. Feedback can be submitted **once** — after submitting, the whole page turns read-only (ratings, suggestion and remarks stay visible but locked, and the availability bar disappears).
   *Example: Carol Davis submitted 8/10 with "Should Hire" — reopening her link shows her submission, not an empty form.*

*The receipt email:*
5. Right after submitting, the panelist receives a **different email from the invitation** — a receipt, not a request:
   - **Subject:** `Feedback Received: Arjun Mehta – Flutter Developer` *(the invitation email's subject carried the interview date; this one leads with "Feedback Received")*.
   - **Body:** *"Thank you for taking the time to interview **Arjun Mehta** for the **Flutter Developer** position. We've shared your feedback with the recruitment team — here's a copy for your records."*
   - **Details:** Candidate, Role, Interview Round, Interview Date (with timezone).
   - **Your Submission:** the chosen suggestion (e.g. **Should Hire**) and the overall remarks, quoted.
   - **Button:** **"View Your Feedback"** — reopens the same secure link in its read-only state.
6. There is **no "action required" language** anywhere in the receipt — nothing is asked of the panelist anymore.

*What the recruiter sees after:*
7. The panelist's chip dot turns **purple (Feedback Submitted)** and a **"Interview Panel Feedback (Provided by Carol Davis) `External`"** row appears under the round — expanding shows per-skill stars, remarks, Average Rating, Overall Remarks and the suggestion (Story 2, AC 5).
8. The recruiter receives notification **Email 3 (feedback submitted)** — format below.

**Field Values:**
| Field | Type | Mandatory | Notes |
|---|---|---|---|
| Interview Panel Suggestion | One of 5 pills | Yes | Next Round / No Show/Cancel / Not Sure / Should Hire / Should Reject |
| Skill rating (per skill) | 0–10 stars | Yes | One row per evaluation skill on the job |
| Remark (per skill) | Free text | No | Shown next to that skill's rating |
| Overall Remarks | Free text, max 1000 characters | Yes | The written summary the recruiter reads first |

**Validations:**
1. Submit is blocked until a suggestion is selected and Overall Remarks is filled.
2. Per-skill remarks are optional — ratings alone are enough.
3. Feedback cannot be opened, filled or submitted before the invitation is accepted (Story 4, AC 12).
4. A second submission is impossible — the form never reappears after submitting.

**Post-condition:**
1. Panelist status: Availability Confirmed → **Feedback Submitted**; their page and link stay read-only permanently.
2. The receipt email is delivered to the panelist; the recruiter gets Email 3.
3. The feedback appears in Interview Details **separately** from internal feedback and is excluded from the internal Feedback Score average (Story 2, AC 6).

**Impact:**
1. Secure panelist page (`/panel/<token>`) — form, read-only state.
2. Panelist emails — a second template (receipt) alongside the invitation.
3. Candidate → Interview Details (external feedback row, chip status).
4. Recruiter notification Email 3 (below).

---

## Story 6 — The waiting period: accepted early, interview later

**Story:**
As an external panelist who accepted an invitation days before the interview, I want the system
to guide me correctly through the wait — remind me at the right time, let me change my response
if plans change, and open the feedback form only once the interview actually starts — so I am
never asked to do something at the wrong moment.

**The example timeline used throughout** *(mirrors a real case)*:
invitation sent **Wed, 23 Jul** → panelist accepts **Thu, 24 Jul** → interview is **Sat, 1 Aug, 10:00 AM IST**.

**Pre-condition:**
1. The panelist accepted the invitation (Story 4) and the interview date is still in the future.

**Acceptance Criteria:**

*Panelist side (24 Jul → 1 Aug):*
1. Accepting early works exactly like Story 4 — the recruiter is notified the same day (Email 1), not on interview day.
2. During the wait the secure link stays fully usable: view the details, re-read the join link/venue, **change the response** (Story 4, AC 11), or update the note. Every change re-notifies the recruiter — latest response wins.
3. **The feedback form is locked until the interview starts.** The collapsed bar reads:
   *"Interview Panel Feedback (Opens after the interview starts — 01/Aug/2026, 10:00 AM IST)"*.
   Accepting does NOT open it — a panelist must never be able to rate a candidate they haven't met yet.
   *(Before accepting, the bar still reads "(Accept the invitation first)" — two different lock reasons, two different messages.)*
4. **The day before the interview (31 Jul)** the panelist receives the reminder — **Email D** below.
5. **From 10:00 AM on 1 Aug** the feedback form unlocks automatically — Story 5 takes over from here.
6. If no feedback arrives within ~24 hours after the interview, one gentle nudge — **Email E** below — is sent. One nudge only, never a chain.

*Recruiter side during the wait:*
7. The chip shows green **Availability Confirmed** the whole time — no extra notifications during the quiet period.
8. The recruiter can still cancel or resend at any point (Story 3); cancelling stops the reminder from being sent.
9. When feedback arrives, the normal flow resumes: chip turns purple, Email 3 to the recruiter.

**Field Values:**
| Event | When | Trigger |
|---|---|---|
| Reminder (Email D) | 24 hours before interview start | Only for status Availability Confirmed |
| Feedback unlock | At interview start time (interview's timezone) | Automatic, no email |
| Nudge (Email E) | ~24 hours after interview start, if no feedback | Once only |

**Validations:**
1. Feedback submission is impossible before the interview start time — even with the accepted link.
2. The reminder goes **only** to panelists who are Availability Confirmed — never to declined, unanswered, or cancelled invitations.
3. The nudge is skipped if feedback was already submitted or the invitation was cancelled.

**Post-condition:**
1. The panelist reaches interview day informed and on time; feedback flows in right after the interview, not before, not never.

**Impact:**
1. Secure panelist page (time-based feedback lock + lock message).
2. Two new scheduled emails (D — reminder, E — nudge) with time-based triggers.
3. No recruiter-side UI change — statuses and notifications already cover it.

---

## Story 7 — Unresponsive panelist: invited, but no decision

**Story:**
As a recruiter, when an external panelist has not answered the invitation, I want the system to
chase them once and warn me before it is too late, so that the panel is never silently
incomplete on interview day.

**The example timeline:** invitation sent **Wed, 23 Jul** → no response → interview is **Sat, 1 Aug, 10:00 AM IST**.

**Pre-condition:**
1. The panelist's status is still **Invited** and the interview date is in the future.

**Acceptance Criteria:**

*Automatic chasing (system):*
1. **48 hours after the invitation** with no response (25 Jul) → the panelist receives the one-time **response reminder — Email F** below. Never repeated.
2. **24 hours before the interview** (31 Jul), still no response → the **recruiter** receives the **no-response alert — Email 4** below, in time to act.

*Recruiter side:*
3. The chip stays **Invited** (indigo dot); the hover card shows a warning line: **"No response yet · invited 2 days ago"** — the recruiter sees at a glance who is silent and for how long.
4. All existing actions stay available: **Resend** the invite (Story 3), **Cancel** it, or invite a replacement panelist (Story 1).

*Panelist side:*
5. The secure link keeps working the whole time — a late response (even on interview day) follows the normal flow (Story 4) and notifies the recruiter as usual.
6. If they never respond, **nothing is cancelled automatically** — the record simply stays Invited, and the feedback form stays locked forever (they never accepted — Story 6, AC 3).

**Field Values:**
| Event | When | Trigger |
|---|---|---|
| Response reminder (Email F) | 48 hours after the invite | Status still Invited; sent once |
| No-response alert (Email 4) | 24 hours before interview start | Status still Invited |
| Auto-cancel | Never | — (the recruiter decides, not the system) |

**Validations:**
1. Email F goes only to panelists whose status is **Invited** — never after a response or a cancellation, and never more than once.
2. Email 4 is sent only if the status is **still Invited** at the 24-hours-before mark.
3. A resend by the recruiter does not reset or repeat the automatic chase — one Email F per invitation, full stop.

**Post-condition:**
1. Either the panelist responds (normal flow resumes), or the recruiter is warned a day ahead with time to resend, reach out directly, or invite someone else.

**Impact:**
1. Two new time-triggered emails (F — panelist chase, 4 — recruiter alert).
2. Interview Details hover card (the "No response yet · invited N days ago" line).
3. No change to statuses or tokens — Invited simply persists.

---

## Recruiter Notification Emails

Four system emails to the **recruiter who scheduled the round** — three sent when an external
panelist responds, plus one time-based alert (Email 4) — sent when an external
panelist responds. Same visual template as the panelist emails (brand header, detail rows,
one button). Subjects front-load the useful facts — who, what, which interview.

---

### Email 1 — Panelist accepted the invitation (availability confirmed)

**Subject:** `Bob Williams is available — Arjun Mehta · Technical Round (25-Jul-2026)`

**Body:**

> Hi **Gurpreetsingh**,
>
> Good news — **Bob Williams** (bob.williams@external.com) has confirmed they're available for the interview below.
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
>
> Thank you,
> **CollabCRM Recruitment**
>
> *Powered by CollabCRM · This is an automated notification — please do not reply.*

*The "Panelist's note" row appears only when the panelist wrote one.*

---

### Email 2 — Panelist declined the invitation (not available)

**Subject:** `Bob Williams is unavailable — Arjun Mehta · Technical Round (25-Jul-2026)`

**Body:**

> Hi **Gurpreetsingh**,
>
> Heads up — **Bob Williams** (bob.williams@external.com) can't make the interview below.
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
>
> Thank you,
> **CollabCRM Recruitment**
>
> *Powered by CollabCRM · This is an automated notification — please do not reply.*

---

### Email 3 — Panelist submitted feedback

**Subject:** `Feedback received from Carol Davis — Arjun Mehta · Technical Round`

**Body:**

> Hi **Gurpreetsingh**,
>
> **Carol Davis** (carol.davis@external.com) has shared their interview feedback.
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
>
> Thank you,
> **CollabCRM Recruitment**
>
> *Powered by CollabCRM · This is an automated notification — please do not reply.*

---

### Email 4 — No response from a panelist (sent 24 hours before the interview)

Sent only if the panelist's status is **still Invited** at the 24-hours-before mark (Story 7, AC 2).

**Subject:** `No response from Alice Johnson — Arjun Mehta · Technical Round (25-Jul-2026)`

**Body:**

> Hi **Gurpreetsingh**,
>
> Heads up — **Alice Johnson** (alice.johnson@external.com) hasn't responded to the interview invitation, and the interview is in 24 hours.
>
> | | |
> |---|---|
> | Candidate | Arjun Mehta |
> | Role | Flutter Developer |
> | Interview Round | Round 1 — Technical Round |
> | Interview Date | 25-Jul-2026 · 10:00 AM IST (GMT+5:30) |
> | Invited on | 23-Jul-2026 |
>
> You may want to **resend the invite**, **reach out directly**, or **invite another panelist**.
>
> **[ View Interview Details ]**
>
> Thank you,
> **CollabCRM Recruitment**
>
> *Powered by CollabCRM · This is an automated notification — please do not reply.*

---

### Rules common to all recruiter notification emails

1. Sent **only to the recruiter who scheduled the round** (the "Scheduled by" user).
2. Sent **immediately** when the panelist submits their response.
3. The button opens the candidate's Interview Details with the round in view.
4. If a panelist changes their availability later (allowed until feedback is submitted), the recruiter gets a fresh Email 1 or Email 2 — the latest response always wins.
5. No notification is sent for a **Cancelled** panelist's link activity (the link is dead).

---

## Panelist Emails

Six emails go **to the external panelist**. All come from the business unit's sender name
(*"MindInventory Talent Acquisition" &lt;no-reply@collabcrm.com&gt;*), carry the BU logo, and
end with the same secure button link plus the line
*"This secure link is personal to you — no login required."*

---

### Email A — Interview invitation (sent on invite AND on every resend)

**Subject:** `Interview Invitation: Arjun Mehta – Flutter Developer · 25/Jul/2026`
*(candidate, role and date up front — no "Action Required" prefix in the subject)*

**Body:**

> Hi **Carol**,
>
> We'd love to have you on the interview panel for the **Flutter Developer** position.
>
> Here are the proposed details — please have a look and let us know if you can make it.
>
> **Interview Details:**
>
> | | |
> |---|---|
> | Candidate | Arjun Mehta |
> | Role | Flutter Developer |
> | Interview Round | Round 1 — Technical Round |
> | Proposed Date | 25/Jul/2026 |
> | Proposed Time | 10:00 AM IST (GMT+5:30) |
> | Mode | Online (Google Meet) |
>
> **Can you make it?**
> If the time works for you, just confirm below. If not, no problem — leave a note and the recruiter will find a better slot.
>
> **[ Confirm Availability ]**
>
> *This secure link is personal to you — no login required.*
>
> Thank you,
> **The Talent Acquisition Team**
>
> *Powered by CollabCRM*

**Variations:**

1. **Offline round** → an extra **Location** row with the business unit's office address replaces the meeting link context (*4th Floor, Shivalik Shilp, Iscon Cross Rd, Ahmedabad, Gujarat 380015*), and Mode shows `Offline`.
2. **Resend** (Story 3) → the **same secure link**, but the wording adapts to what the panelist already answered — the email never asks a question that's already been answered:
   - **Already confirmed** → *"You've confirmed you're available — here are the details for your reference."* · ask block: **"You're confirmed"** — *"Keep this link handy — you can view the interview details or update your response anytime."* · button: **[ View Interview Details ]**
   - **Already declined** → *"You let us know you can't make it — the details are below in case anything changes."* · ask block: **"Change of plans?"** — *"If your schedule frees up, you can update your response using the link below."* · button: **[ Update Availability ]**
   - **No response yet** → the standard body above, button **[ Confirm Availability ]**.

---

### Email B — Feedback receipt (sent right after the panelist submits feedback)

**Subject:** `Feedback Received: Arjun Mehta – Flutter Developer`
*(no date needed — the interview is done; nothing more is asked)*

**Variation:** if the panelist's suggestion was **No Show/Cancel**, the opening line becomes
*"Thank you for making time for the **Flutter Developer** interview."* — we never thank someone
"for interviewing" a candidate who didn't show up.

**Body:**

> Hi **Carol**,
>
> Thank you for taking the time to interview **Arjun Mehta** for the **Flutter Developer** position.
>
> We've shared your feedback with the recruitment team — here's a copy for your records.
>
> **Interview Details:**
>
> | | |
> |---|---|
> | Candidate | Arjun Mehta |
> | Role | Flutter Developer |
> | Interview Round | Round 1 — Technical Round |
> | Interview Date | 25/Jul/2026 · 10:00 AM IST (GMT+5:30) |
>
> **Your Submission:**
> Suggestion: **Should Hire**
> *"Strong Flutter fundamentals and a very structured approach to state management. Would move forward."*
>
> **[ View Your Feedback ]**
>
> *This secure link is personal to you — no login required.*
>
> Thank you,
> **The Talent Acquisition Team**
>
> *Powered by CollabCRM*

---

### Email C — Cancellation notice (sent when the panelist or the interview is cancelled)

**When it is sent:**

1. The recruiter **cancels that panelist's invitation** (Story 3), or
2. The **whole interview round is cancelled** — every active external panelist on the round gets it (already-cancelled panelists are not emailed twice).

**Subject:** `Interview Cancelled: Arjun Mehta – Flutter Developer · 25/Jul/2026`

**Body:**

> Hi **Dan**,
>
> We're sorry for the change of plans — the interview below has been **cancelled**, so you won't need to join this one.
>
> We truly appreciate you making the time for us, and we'd love to have you on a future interview panel.

**Variation:** the second line depends on what the panelist had done — only thank them for
"making the time" if they actually committed time:

- **Had confirmed availability (or submitted feedback)** → *"We truly appreciate you making the time for us, and we'd love to have you on a future interview panel."*
- **Never responded, or had declined** → *"Thank you for considering it — we'd love to have you on a future interview panel."*
>
> **Interview Details:**
>
> | | |
> |---|---|
> | Candidate | Arjun Mehta |
> | Role | Flutter Developer |
> | Interview Round | Round 1 — Technical Round |
> | Interview Date | 25/Jul/2026 · 10:00 AM IST (GMT+5:30) |
>
> No action is needed on your side — your secure link has been deactivated.
>
> Thank you,
> **The Talent Acquisition Team**
>
> *Powered by CollabCRM*

**Rules:**

1. No accept/decline or feedback is possible after this email — the link only shows the "invitation cancelled" screen.
2. If the panelist had already submitted feedback, the recruiter keeps it (Story 3, AC 5) — but the panelist's page stays on the cancelled screen.
3. If the recruiter later **resends** (re-activates) the invitation, the panelist receives a fresh **Email A** and the link works again.

---

### Email D — Interview reminder (sent 24 hours before the interview)

Sent **only** to panelists whose status is **Availability Confirmed** (Story 6, AC 4).

**Subject:** `Reminder: Arjun Mehta interview – 01/Aug/2026, 10:00 AM IST (GMT+5:30)`

**Body:**

> Hi **Bob**,
>
> A quick reminder — your interview panel session for the **Flutter Developer** position is coming up.
>
> Everything you need — the details and the meeting link — is on your secure page below.
>
> **Interview Details:**
>
> | | |
> |---|---|
> | Candidate | Arjun Mehta |
> | Role | Flutter Developer |
> | Interview Round | Round 1 — Technical Round |
> | Interview Date | 01/Aug/2026 · 10:00 AM IST (GMT+5:30) |
>
> **See you there?**
> If anything has changed and you can't make it anymore, please update your response — the recruiter will be notified right away.
>
> **[ View Interview Details ]**
>
> *This secure link is personal to you — no login required.*
>
> Thank you,
> **The Talent Acquisition Team**
>
> *Powered by CollabCRM*

*Variation: offline rounds say "the details and the venue address" instead of "the meeting link".*

---

### Email E — Feedback nudge (sent ~24 hours after the interview, only if no feedback yet)

Skipped if feedback was already submitted or the invitation was cancelled. **Sent once, never repeated.**

**Subject:** `How did it go? Share your feedback – Arjun Mehta`

**Body:**

> Hi **Rahul**,
>
> Thanks again for joining the interview for the **Flutter Developer** position.
>
> When you have a few minutes, please share your feedback — it helps the team decide quickly.
>
> **Interview Details:**
>
> | | |
> |---|---|
> | Candidate | Arjun Mehta |
> | Role | Flutter Developer |
> | Interview Round | Round 1 — Technical Round |
> | Interview Date | 20/Jul/2026 · 03:00 PM IST (GMT+5:30) |
>
> **[ Share Your Feedback ]**
>
> *This secure link is personal to you — no login required.*
>
> Thank you,
> **The Talent Acquisition Team**
>
> *Powered by CollabCRM*

---

### Email F — Response reminder (sent once, 48 hours after the invite, if no answer)

Sent **only** while the status is still **Invited** (Story 7, AC 1). Never repeated, and a manual
resend by the recruiter does not trigger it again.

**Subject:** `Still able to join? Arjun Mehta interview – 25/Jul/2026`

**Body:**

> Hi **Alice**,
>
> Just checking in — we haven't heard from you about the interview below, and the recruiter is finalising the panel.
>
> It only takes a moment to respond — and if the time doesn't work, a quick decline with a note helps just as much.
>
> **Interview Details:**
>
> | | |
> |---|---|
> | Candidate | Arjun Mehta |
> | Role | Flutter Developer |
> | Interview Round | Round 1 — Technical Round |
> | Proposed Date | 25/Jul/2026 |
> | Proposed Time | 10:00 AM IST (GMT+5:30) |
> | Mode | Online (Google Meet) |
>
> **Can you make it?**
> If the time works for you, just confirm below. If not, no problem — leave a note and the recruiter will find a better slot.
>
> **[ Confirm Availability ]**
>
> *This secure link is personal to you — no login required.*
>
> Thank you,
> **The Talent Acquisition Team**
>
> *Powered by CollabCRM*

---

### Rules common to all panelist emails

1. Emails A and B open the **same secure link** — the page just shows a different state (form or read-only submission). Email C has **no button at all** — the link is dead, so nothing is offered.
2. The receipt (Email B) and cancellation (Email C) contain **no "action required" language** — they ask nothing of the panelist.
3. The timezone is always spelled out next to the time (`IST (GMT+5:30)`), since external panelists have no timezone settings.
4. Exactly one email per event: invited/resent → Email A, feedback submitted → Email B, cancelled → Email C, 24h before the interview (confirmed) → Email D, ~24h after with no feedback → Email E (once only), 48h with no answer → Email F (once only).
