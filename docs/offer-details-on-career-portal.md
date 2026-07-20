# Offer Details on the Career Portal — Functional Specification

**Module:** Recruitment → Career Portal (CRP) + Internal (CRM)
**Screen:** Career Portal › My Applications › Application Detail
**Status:** Draft for review — no development started
**Prepared from:** live crawl of CollabCRM staging (`bluewhaletechnosoftpvtltd`), candidate `Arjun Patel` / `fa268d17-302b-426e-8426-d3dc526f620e`

---

## 1. Objective

When an application reaches the **Offered** stage, the candidate must be able to see the offer on the career portal instead of only receiving it by email. How much is shown depends on **how the recruiter released the offer**, because the three release modes carry different amounts of data.

---

## 2. Discovery — what the internal app does today

Captured from the live **Mark Offer** modal (DOM, not screenshots). All three modes are tabs in one modal titled `Mark Offer to - {Candidate Name}`.

| # | Tab (exact label) | Input fields | Primary CTA | Resulting status |
|---|---|---|---|---|
| 1 | `Attach Offer Letter` | **Offer Letter** `*` — file upload, `accept="application/pdf,.pdf"`, *PDF (max. 2mb)*<br>**Tentative Joining Date** `*` — date picker | `Save` | → Signatories screen → email with **Review & Sign Offer**.<br>On candidate signature, status auto-moves to **Offer Accepted** |
| 2 | `Offer Manually` | **Tentative Joining Date** `*` — date picker | `Preview Email` | → Email compose → **Offered**.<br>Accept/Reject must be updated **manually** by the recruiter |
| 3 | `Verbal Offer Shared` | **Tentative Joining Date** `*` — date picker | `Mark as Offered` | → **Offered** (offer already communicated outside the portal) |

**Exact helper copy in the modal** (reuse verbatim in the prototype):

- Tab 1 — *"Upon proceeding, you can add signatories for digital signatures. Once the candidate signs the offer letter, the candidate's status will be automatically updated to 'Offer Accepted'."*
- Tab 2 — *"Upon proceeding, you'll be able to preview and draft the offer email. Please note that the candidate's response (Accepted or Rejected) will need to be updated manually."*
- Tab 3 — *"By proceeding, the candidate's status will be updated to 'Offered', assuming the offer has already been communicated externally."*

Confirmation lines: tabs 1 & 2 use *"Are you sure you want to proceed with offering this candidate?"*; tab 3 uses *"Are you sure you've shared the offer with this candidate outside the portal?"*

### 2.1 Real API field names

From `GET /v1/candidate-int/candidate/view/{candidateId}`:

```
data.offer_detail_status         = ''      // empty until an offer is marked
data.offer_detail_joining_date   = null
data.offer_detail_remarks        = ''
data.status                      = 'selected'
data.final_result                = 'selected'
```

Use these names as-is. Anything new we add should follow the same `offer_detail_*` convention.

### 2.2 ✅ Resolved — where the Manual attachment lives

The `Offer Manually` **modal** has no file input — only the date picker (verified in DOM).

The attachment is on the **Send Offer email compose screen** that follows `Preview Email`
(breadcrumb: `Candidates › Interview Details › Send Offer`):

| Field | Value |
|---|---|
| Label | `Upload Attachment` — **no asterisk, optional** |
| Accepts | **DOCX & PDF (max. 2 MB)** |
| Actions | `Send` / `Cancel` |

Two consequences for the CRP:

1. **A manual offer may legitimately have no document.** Both states must be designed — see §4.2-B and §4.2-C. Not an edge case; it's the default.
2. **The file is not necessarily a PDF.** DOCX is accepted, so the document row must derive its type from the file name rather than hardcoding "PDF".

> Contrast with `Attach Offer Letter`, whose upload is **required** and **PDF-only (max 2mb)**. The two flows have genuinely different file rules — don't share one validator.

### 2.3 Review & Sign link contract

The link emailed as **Review & Sign Offer**, which the CRP must reproduce verbatim (§4.2-D):

```
/recruitment/{portal_slug}/markOffer/{offerId}/sign
  ?token={tokenA}:{tokenB}
  &domain={candidateEmailDomain}
  &portal_slug={tenant}
```

The `token` is two colon-separated hex strings. The CRP does **not** mint this link — it stores and re-renders whatever the offer record carries, so the portal button and the email button always point at the same signing session.

---

## 3. Proposed data model

New object on `Application`, in `src/store/types.ts`:

```ts
export type OfferMode = 'digital_sign' | 'manual' | 'verbal';

export interface OfferDocument {
  fileName: string;      // 'arjun-patel-1784542344W1V.pdf'
  fileUrl: string;       // staging-media URL
  fileSize: number;      // bytes — rendered as "PDF · 1.2 MB"
  uploadedAt: string;    // ISO
}

export interface OfferSignature {
  status: 'pending' | 'signed' | 'declined';
  signUrl: string;                 // SAME link emailed as "Review & Sign Offer"
  signedAt?: string;
  signatories: {
    name: string;
    email: string;
    party: 'company' | 'candidate';
    signedAt?: string;
  }[];
}

export interface OfferDetail {
  mode: OfferMode;
  /** Internal label: "Tentative Joining Date". CRP label: "Expected Joining Date". */
  joiningDate: string;             // maps to offer_detail_joining_date
  offeredAt: string;
  offeredByName: string;           // 'Gurpreetsingh Dhillon'
  document?: OfferDocument;        // mode = digital_sign (always) | manual (optional)
  signature?: OfferSignature;      // mode = digital_sign only
  remarks?: string;                // maps to offer_detail_remarks
}
```

Added to the existing interface:

```ts
export interface Application {
  // …existing fields…
  offer?: OfferDetail;
}
```

### 3.1 Which fields exist per mode

| Field | Verbal | Manual | Digital Sign |
|---|:--:|:--:|:--:|
| `joiningDate` | ✅ required | ✅ required | ✅ required |
| `offeredAt` / `offeredByName` | ✅ | ✅ | ✅ |
| `document` | ❌ never | ⚪ optional | ✅ required |
| `signature` | ❌ | ❌ | ✅ |
| `remarks` | ⚪ | ⚪ | ⚪ |

---

## 4. Career Portal — what we add

**File:** `src/pages/ViewApplicationPage.tsx`

A new **Offer card** rendered **above the existing accordion stack** (directly under the "Submitted {date}" divider), so it is the first thing the candidate sees. It is a highlighted card, *not* a collapsed accordion — this is the most important information on the page.

### 4.1 Visibility rule

Render only when `application.offer` exists **and** status is offer-related:

| Application status | Portal label | Show card? | Show document / CTA? |
|---|---|:--:|---|
| `Offered` | Offered | ✅ | ✅ per mode |
| `Offer Accepted` | Offer Accepted | ✅ | ✅ read-only, signed state |
| `Offer Declined` | Offer Declined | ✅ | ❌ hide CTA, keep dates |
| `Offer Revoked` | Offer On Hold | ✅ | ❌ hide document + CTA |
| anything else | — | ❌ | — |

> The brief says *"if the status is Offered."* I recommend extending to the four statuses above — an offer that vanishes from the portal the moment the candidate accepts is confusing, and they still need the signed document. Flagged as §7 Q2.

### 4.1a List ordering — My Applications

Offer-stage applications (`Offered`, `Offer Accepted`, `Offer Declined`, `Offer Revoked`) are **floated to the top of the My Applications list as one block**, most recent first. Everything else keeps the existing newest-first order below them.

Rationale: an offer is the item most needing the candidate's attention, and date-sorting alone scatters offers among drafts and in-progress applications. Implemented in `CandidateProfilePage.tsx`.

### 4.2 Card content by mode

**All modes** show the header and the joining date:

```
┌─────────────────────────────────────────────────────────┐
│  🎉  You have an offer                    [ OFFERED ]   │
│      Business Analyst · BlueWhale Technosoft Pvt. Ltd.  │
├─────────────────────────────────────────────────────────┤
│  EXPECTED JOINING DATE        OFFER RECEIVED ON         │
│  20 Jul, 2026                 14 Jul, 2026              │
└─────────────────────────────────────────────────────────┘
```

**A. Verbal Offer Shared** — nothing beyond the above.

Add one supporting line, since the candidate has no document to look at:
> *"Your offer has been shared with you directly by the recruitment team."*

**B. Offer Manually — no attachment:** same as Verbal, with the line:
> *"Your offer details have been sent to your registered email address."*

**C. Offer Manually — with attachment:** append a document row.

```
├─────────────────────────────────────────────────────────┤
│  📄  Offer_Letter_Arjun_Patel.pdf                       │
│      PDF · 1.2 MB              [ ⬇ Download ]           │
└─────────────────────────────────────────────────────────┘
```

**D. Attach Offer Letter (digital sign)** — document row **plus** signature state and the primary CTA. The link must be **the same `signUrl` sent in the email**, so the candidate can start signing from the portal.

```
├─────────────────────────────────────────────────────────┤
│  📄  arjun-patel-1784542344W1V.pdf                      │
│      PDF · 1.2 MB          ● Awaiting your signature    │
│                                                          │
│             [  Review & Sign Offer  →  ]                │
└─────────────────────────────────────────────────────────┘
```

Signature states:

| `signature.status` | Pill | Download | CTA |
|---|---|---|---|
| `pending` | ● Awaiting your signature (amber) | **hidden** | **Review & Sign Offer** |
| `signed` | ● Signed on {date} (green) | **Download Signed** | **View Signed Offer** |
| `declined` | ● Declined (red) | hidden | View Offer |

**Download gating — digital sign only.** There is no Download button until the letter is signed. Before signing, the only route to the document is **Review & Sign Offer**, which opens the signing session; the row still shows the file name and the awaiting-signature pill so the candidate knows what's outstanding. Once signed, Download appears and serves the **countersigned** copy — `signature.signedDocument`, a different file from the unsigned `offer.document`, which is never downloadable in this flow.

> This gating applies **only** where `offer.signature` exists. A **manual** attachment has no signing step and stays downloadable throughout — see §4.2-C.

### 4.3 Label change — required

The internal field is **"Tentative Joining Date"**. On the career portal it must render as **"Expected Joining Date"**. Same underlying `joiningDate` value, different label per side. This is a presentation-layer rename only.

### 4.4 Declining the offer — **implemented**

The candidate can **decline from the portal in all three modes**, while status is `Offered`.

- **Decline Offer** button sits in the card's action bar. For digital sign it is the secondary action next to **Review & Sign Offer**; for manual and verbal it is the only action.
- Opens a confirmation modal (same pattern as the existing Withdraw modal): *"Decline this offer?"* with an **optional free-text reason**, and `Keep Offer` / `Yes, Decline`.
- On confirm → `status = 'Offer Declined'`, `offer.declinedAt` stamped, `offer.declineReason` stored, and `offer.signature.status` flips to `declined` for the digital-sign flow.
- The card then shows a red footer: *"You declined this offer on {date}"* plus the reason, the action bar disappears, and **Withdraw** is suppressed (a declined application can't also be withdrawn).

**Accepting is deliberately not a portal action.** For digital sign, acceptance *is* signing — the live app auto-moves the status to Offer Accepted once signed. For manual and verbal, the live modal states the response "will need to be updated manually" by the recruiter. Adding a candidate-side Accept button would contradict that. Declining is the one thing the candidate can usefully do on their own, and it saves the recruiter a follow-up.

> ⚠️ This is a **business-logic change** — today no candidate action feeds status back from the portal for manual/verbal offers. Worth confirming the recruiter gets notified.

### 4.5 Styling

Reuse existing page tokens so the card does not look foreign — `rounded-2xl`, `border-[#E5E7EB]`, `shadow-sm`, label style `text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest`, values `text-sm font-semibold text-[#111827]`. Accent uses the portal's `primary` brand colour. The document row mirrors the existing **Resume** accordion row (icon tile + name + size + action button) so it needs no new pattern.

---

## 5. Internal side — what we add

**File:** `src/pages/CandidateDetailPage.tsx` (the prototype currently has **no** Mark Offer modal — it must be built)

### 5.1 New: Mark Offer modal

Three-tab modal replicating §2 exactly — same tab labels, same helper copy, same required fields, same CTA labels (`Save` / `Preview Email` / `Mark as Offered`).

### 5.2 Existing Offer Details card — extend

The card at `CandidateDetailPage.tsx:843` currently shows Offer Status, Department, Joining On, Remarks. Add:

- **Offer Mode** badge — `Digital Sign` / `Manual` / `Verbal`, so a recruiter can tell at a glance how it went out
- **Offer document** row when `offer.document` exists, with download
- **Signature status** when `mode = digital_sign` — per-signatory state (company + candidate), matching the Review Offer Letter & Add Signatories screen
- Keep **"Joining On"** wording as-is internally

### 5.3 Seed data

Add offer objects to existing seeded applications so all four states are demoable without data entry:

Seeded on **Alex Patel (`c1`)** — the default portal user — so all four states are visible in one login. They are floated to the top of My Applications as a block (§4.1a).

| Application id | Job | Mode | State |
|---|---|---|---|
| `a-offer-sign` | DevOps Engineer | `digital_sign` | signature `pending` — **no download**, Review & Sign only |
| `a-offer-signed` | 2D Artist | `digital_sign` | signature `signed`, status `Offer Accepted` — **Download Signed** |
| `a-offer-manual` | Data Analyst | `manual` | **with** attachment — downloadable |
| `a-offer-manual-nodoc` | Android Developer | `manual` | **without** attachment |
| `a-offer-verbal` | iOS Developer | `verbal` | date only |

---

## 6. Scope summary

**Career portal**
1. `OfferDetail` types in `types.ts`
2. Offer card on `ViewApplicationPage.tsx` with the four mode variants
3. "Tentative" → "Expected" Joining Date relabel
4. Status gating per §4.1

**Internal**
5. Mark Offer modal (3 tabs)
6. Offer Details card extension — mode badge, document, signature status
7. Seed data for all offer states

**Not in scope:** the actual e-signature engine, email sending, offer letter generation. The prototype links to a placeholder `signUrl`.

---

## 7. Open questions for PM

**Q1.** ~~Where does the Manual attachment live?~~ **Resolved** — it's the optional `Upload Attachment` on the Send Offer compose screen, DOCX & PDF, max 2 MB. See §2.2.

**Q2.** Should the offer card stay visible after **Offer Accepted / Declined / Revoked**, or strictly on **Offered** only? Recommendation: keep it visible — see §4.1.

**Q3.** On **Offer Revoked** (portal label *Offer On Hold*), should the document link be **withdrawn**? Recommendation: yes, hide document and CTA, keep the card with a neutral message.

**Q4.** ~~Should the candidate be able to Accept / Decline from the portal?~~ **Decided — implemented.** See §4.4.

**Q5.** Should the offer **salary/CTC** appear on the card? Not present in the Mark Offer modal today, so assumed **no**.

---

## Appendix — crawl evidence

| Artefact | Path |
|---|---|
| Mark Offer modal, tab 1 | `scratchpad/modal_tab1_attach.html` |
| Mark Offer modal, tab 2 | `scratchpad/modal_manual.html` |
| Mark Offer modal, tab 3 | `scratchpad/modal_verbal.html` |
| Candidate + offer API | `crawl-out/_recruitment_..._candidate_api.json` |

Endpoints observed:
- `GET /v1/candidate-int/candidate/view/{id}` — carries `offer_detail_*`
- `GET /v1/candidate-int/interview-schedule/detail/{id}` — rounds, `panel_suggestion`, `averageFeedbackScore`
