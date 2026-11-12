# Kumquat coverage audit against USMLE (05/11/2026)

## What this is mapped against
- The USMLE Step 1 discipline "Biostatistics, epidemiology/population health, and interpretation of the medical literature".
- The Step 2CK/Step 3 additions: applying evidence, screening decisions, quality improvement and patient safety, and research ethics.
- The topic lists in First Aid and the main QBanks.

## How to read the tables
- **Status:** covered well = taught in a lesson and drilled by several items. Thin = only one or two items, or only a vault, twin or distractor mention. Missing = absent.
- **Where:**
  - L = lesson unit.step
  - C = casebook
  - R = round
  - B, S, S2 = question bank, Step 1, Step 2CK/3 items
  - V, X, T = design, bias and test items
  - Tw = twin
  - G = generator
  - Va = vault
  - CW = concept web
  - Lab = interactive lab
- **Priority:** for passing the Steps.

## Structural observations
- **No `[appraise]` items in the Step 1 vignette pool** (S:0–51). Critical appraisal is only drilled through B, S2 and the rounds. Step 1 now includes abstract-based literature items.
- **No `[tests]` items in the bank**, and only 3 Step 1 test-choice vignettes (S:41–43).
- The topic mix draws on a **`W:` pool** (e.g. `W:dx`) that is not in the export, so I could not audit it.
- The labs cover KM curves (via the test picker), forest plots, funnel plots and ROC/cut-off points. But **no question shows a figure and asks the learner to read it.** The exams do this often.
- Rounding, NNT and 2×2 mechanics are very well drilled (12 generators). The volume of calculation practice is sufficient. The gaps are conceptual and Step 2/3 applied content.

## 1. Epidemiology and population health

| Concept | Status | Where | Priority |
|---|---|---|---|
| Incidence vs prevalence; population at risk | covered well | L2.3–4, S:15, G genEpi, Tw, R screening s4 | high |
| Incidence rate and person-time | covered well | L2.5, G genEpi, Tw | high |
| P ≈ I × D, effect of cure / survival | covered well | L2.6, B:36, S:19, S2:8 | high |
| Attack rate, secondary attack rate | covered well | L2.7, S:16, S:20, B:59, R fever s2 | medium |
| Case-fatality; infection fatality vs ascertainment | covered well | C Legionnaires, C MERS, B:74 | medium |
| Mortality rates (crude, age- and cause-specific, infant, neonatal, maternal mortality ratio, proportionate mortality) | missing | none | medium |
| Direct vs indirect standardisation (concept) | covered well | B:52, B:38, S2:10, G genEpi (SMR) | medium |
| Direct standardisation worked calculation | missing | none | medium |
| R₀, herd immunity threshold | covered well | L2.8, S:14, G genHerd, C MERS | medium |
| Effective R (Rₑ = R₀ × susceptible fraction), overdispersion | thin | R fever s3 | low |
| **Vaccine efficacy = (ARU − ARV)/ARU = 1 − RR** | missing | none | **high** |
| Epidemic curve shapes | covered well | B:57–58, Tw, C Broad Street, C Legionnaires | medium |
| Outbreak investigation steps, case definition | covered well | C Legionnaires, R resin, L2 | medium |
| Surveillance types | covered well | B:51, B:60–61, L2 core | low |
| Notifiable / reportable diseases | missing | none | low |
| Levels of prevention (primary to quaternary) | covered well | L2.9, B:40, S:17–18, Tw | high |
| Primordial prevention | missing (only as distractor B:40) | B:40 | low |
| Bradford Hill criteria | covered well | B:39, Va, C smoking, C Semmelweis, R resin | medium |
| Natural experiments | covered well | C Broad Street | low |
| Screening programme criteria (Wilson–Jungner) | thin | Va only | medium |
| Social determinants of health, health disparities, health equity measures | missing | none | medium |
| Demographic transition, population pyramids | missing | none | low |

## 2. Diagnostic and screening tests

| Concept | Status | Where | Priority |
|---|---|---|---|
| Sens / spec / PPV / NPV from a 2×2 | covered well | L3, S:0, G gen2x2, Va | high |
| Prevalence effect on predictive values | covered well | L3.4, B:13, S:2, R screening, Tw | high |
| SnNOut / SpPIn | covered well | L3.5, B:12, S:4 | high |
| Moving the cut-off; ROC position | covered well | L3.6, S:1, B:15, Lab cut-off dial | high |
| ROC / AUC | covered well | B:16, S:6 | medium |
| LRs and the odds form of Bayes | covered well | L3.8, S:5, G genLR, G genPost, S2:2, R night shift | high |
| Series vs parallel testing | covered well | L3.7, S:3, Tw | medium |
| Spectrum, verification, incorporation bias | covered well | L3.9, X:12–13 | medium |
| **Precision vs accuracy; reliability vs validity** | thin | Tw only | **high** |
| Inter-rater reliability (kappa) | covered well | L8.6, B:10, T:12 | medium |
| Overall accuracy and its prevalence trap | thin | Va only | low |
| **Test and treatment thresholds (threshold model)** | missing | implied in R night shift ("Tests are for the middle") | **high (Step 2/3)** |
| Clinical decision rules (Wells, PERC, Ottawa, Centor) in Bayes terms | thin | R night shift (Wells only) | medium |
| Overdiagnosis | thin | Tw, S2:0 | medium |
| Number needed to screen | thin | B:55 | medium |
| Reference ranges: mean ± 2 SD flags 5% of healthy people | covered well | S2:29 | low |

## 3. Quantifying risk and effect size

| Concept | Status | Where | Priority |
|---|---|---|---|
| RR, OR (ad/bc), when OR ≈ RR | covered well | L4.6, S:12, B:19, G genRROR, C smoking | high |
| ARR, RRR, NNT (round up), NNH | covered well | L4, S:10–11, G genNNT, G genARR, R statin, C RECOVERY, C MRC | high |
| Baseline risk drives NNT | covered well | L4.4, R statin, S2:5 | high |
| Attributable risk, attributable fraction | covered well | L4.7, S:8–9, B:20 | high |
| Population attributable risk and fraction | covered well (but see accuracy A3) | B:62–63, Va | medium |
| Hazard ratio | covered well | L4.8, B:11, S2:6, C WHI | medium |
| Rate ratio from person-time | thin | C smoking step 7 | low |
| Converting OR to RR when the outcome is common | thin | B:19 explanation | low |

## 4. Study design

| Concept | Status | Where | Priority |
|---|---|---|---|
| Cross-sectional, cohort (prospective and retrospective), case-control, nested case-control, ecological, case series | covered well | L5, V:0–10, S:21–22, S:26 | high |
| Rare disease vs rare exposure | covered well | L5.3–4, B:22–23 | high |
| RCT, crossover, cluster, factorial | covered well | L5.5, V:5–6, V:12, B:64 | medium |
| Non-inferiority and equivalence | covered well (fix sign convention: W4, A10) | B:35, B:65, S2:20, V:11, Tw | medium |
| Pragmatic vs explanatory; efficacy vs effectiveness | covered well | L10.7, Tw | medium |
| Trial phases I–IV | covered well | L5.7, S:23–25, B:46 | high |
| Phase 0 (micro-dosing) | missing | none | low |
| Hierarchy of evidence | covered well | L5.8, designs reference | medium |
| Quasi-experimental designs (controlled before–after, interrupted time series, stepped-wedge) | thin | C Semmelweis, S2:12 | medium (Step 3) |
| Matching and overmatching; case:control ratio | thin | V:7, L6.6 | low |
| Active-comparator new-user design | thin | S2:13 | low |
| Qualitative research, Mendelian randomisation | missing | none | low |

## 5. Bias and confounding

| Concept | Status | Where | Priority |
|---|---|---|---|
| Selection biases (volunteer, Berkson, healthy worker, Neyman / late-look, attrition) | covered well | L6.2, X:0–5, S:28, S:31, S:33 | high |
| Information biases (recall, interviewer, detection, performance, Hawthorne, Pygmalion, misclassification) | covered well | L6.3, X:6–11, S:27, Tw | high |
| **USMLE / First Aid bias names: procedure, measurement, observer-expectancy, non-response, sampling** | thin (only Pygmalion and observer-expectancy map across) | S:27 | **high** |
| Confounding, methods to control it | covered well | L6.4–6, B:43–44, X:14, S:29 | high |
| Confounding vs effect modification | covered well | L6.5, S:29–30, Tw, C RECOVERY | high |
| Mediator vs confounder | covered well | B:68, Tw, Va | medium |
| Collider bias | missing (only as distractor in B:68) | none | low |
| Simpson's paradox (by name) | missing | none | low |
| Confounding by indication; healthy-adherer effect | covered well | X:15, S2:11, S2:13–14, C HRT | medium |
| Reverse causation | covered well | X:16, S2:16 | medium |
| Regression to the mean | covered well | X:17 | medium |
| Lead-time, length-time bias, overdiagnosis | covered well | L6.7, S:32, X:18–19, Tw | high |
| Publication bias, funnel plot | covered well | B:32, X:20, Lab | medium |
| Immortal-time bias | missing | none | low |
| Residual confounding | thin | C HRT | low |

## 6. Statistics and inference

| Concept | Status | Where | Priority |
|---|---|---|---|
| Normal distribution, 68–95–99.7, z-scores | covered well | L1.6–7, S:35, G genZ, S2:29 | high |
| Right skew and mean/median/mode | covered well | L1.8, B:8, S:34 | high |
| **Left skew, bimodal distributions; effect of outliers and transformations on mean, median and SD** | missing | none | **medium-high** |
| Measures of dispersion (range, IQR, variance, percentiles) | thin | B:8 | medium |
| H₀ / H₁ | thin (H₁ never named) | L7.2 | medium |
| One- vs two-tailed tests | missing | none | low-medium |
| p value interpretation | covered well (wording: I1) | L7.2, B:4 | high |
| CI interpretation; line of no effect | covered well | L7.3, B:0–1, S:13, S2:17, Va | high |
| **Overlapping CIs between two groups vs the CI of the difference** | missing | none | **high** |
| Type I / II errors, power and its determinants | covered well | L7.4–5, B:2–3, B:5, S:38–40, Tw | high |
| Sample size determinants | covered well | L7.5, Va formula | medium |
| SD vs SE; CI for a mean | covered well | L7.6, B:6, S:36, G genSE | high |
| Multiple comparisons, Bonferroni | covered well (fix W5) | B:9, R journal club, Va | medium |
| Statistical vs clinical significance | covered well | L7.7, S2:18, Tw | high |
| Correlation, r, r² | covered well | L7.8, S:37, T:10 | medium |
| **Regression: linear coefficients, logistic → adjusted OR, what "adjusted" means** | thin | T:11, test picker only | **medium-high** |
| Kaplan–Meier, censoring, median survival, log-rank, Cox | covered well | B:53–54, S2:19, T:8–9 | medium |
| Interim analyses, early stopping | thin | S2:25, C WHI | medium |
| Independent probabilities (multiplying; small risks add) | thin | S2:30 | low |

## 7. Choosing statistical tests

| Concept | Status | Where | Priority |
|---|---|---|---|
| t-tests, ANOVA (one-way and repeated measures) | covered well | L8, T:0–1, T:4, T:15, S:41, S:43 | high |
| Chi-square, Fisher, McNemar | covered well | T:2, T:6–7, S:42, S2:22 | high |
| Non-parametric tests | covered well | T:3, T:5, T:14, S2:21 | medium |
| Pearson vs Spearman | covered well | T:10, test picker | medium |
| Agreement: kappa vs Bland–Altman | covered well | T:12–13, Tw | low |

## 8. Interpreting the medical literature

| Concept | Status | Where | Priority |
|---|---|---|---|
| PICO; validity, results, applicability | covered well | L9.1, checklists | medium |
| Randomisation, concealment, blinding | covered well | L9.3, B:26–27, B:45, C MRC, Tw | high |
| ITT vs per-protocol; loss to follow-up | covered well | L9.4, B:29, B:34–35, S:31, S2:15, Tw | high |
| Meta-analysis: forest plot, I², funnel plot | covered well | L9.6, B:30–33, S2:23, Lab | medium |
| GRADE | covered well | B:56, B:67, Va | low |
| Surrogate and composite endpoints | covered well | B:66, S2:24, Va | medium |
| Subgroup credibility | covered well | C RECOVERY, R journal club | medium |
| Generalisability / external validity | thin | L9.7, S:33 | high |
| **Abstract and drug-advertisement format items (multi-question)** | missing | none | **high** |
| **Reading figures in questions (KM, forest, funnel, ROC, epidemic curve)** | thin (labs only; no question shows a figure to read) | Labs | **high** |
| Spin, selective reporting, outcome switching, trial registration | thin | X:20 fix line, Lab Risk "spin" | medium |
| Funding source, conflicts of interest | missing | none | medium |

## 9. Step 2CK/3: applying evidence and screening

| Concept | Status | Where | Priority |
|---|---|---|---|
| Absolute benefit vs harm for one patient; shared decisions | covered well | R statin, S2:4–6, L4.5 | high |
| **Screening decisions: USPSTF logic and grades, harms, when to stop, life-expectancy rule** | thin | S2:0 (PSA), S2:9, B:17, B:55 | **high** |
| Pre-test probability from decision rules | thin | R night shift | medium |
| Test and treatment thresholds | missing | none | high |
| Cost-effectiveness, QALYs, decision trees | missing | none | low-medium |
| Risk communication (natural frequencies, icon arrays) | covered well | L3.2, R statin s2x | medium |

## 10. Step 2CK/3: QI and patient safety

| Concept | Status | Where | Priority |
|---|---|---|---|
| Swiss cheese; active vs latent errors | covered well | L10.2, S:46, Tw | high |
| Near miss, adverse event, sentinel event | covered well | L10.3, B:49, S:47 | high |
| RCA, FMEA, PDSA, Pareto | covered well | L10.4, S:44–45, B:48, S2:26 | high |
| Just culture | covered well | L10.5 | medium |
| Hierarchy of safety interventions (forcing functions to education) | thin | S2:27 | medium |
| **Structure / process / outcome / balancing measures (Donabedian)** | missing | none | **high** |
| **Run charts and statistical process control (common vs special cause)** | thin (run chart only as distractor) | B:48, L10.4 | **high** |
| Fishbone (Ishikawa) diagram | missing | none | medium |
| **Cognitive biases in diagnosis (anchoring, availability, premature closure, confirmation, framing, base-rate neglect)** | missing | none | **high** |
| **Disclosure of medical errors and apology** | missing | none | **high** |
| Handoffs (SBAR, I-PASS), checklists, surgical time-out, medication reconciliation | missing | none | medium |
| Never events; adverse-event reporting (MedWatch, VAERS) | missing | none | low |
| Alarm fatigue, burnout, second victim | missing | none | low |

## 11. Research ethics

| Concept | Status | Where | Priority |
|---|---|---|---|
| Belmont principles | covered well | L10.6, C Tuskegee | high |
| Informed consent elements; right to withdraw | covered well | B:70, S2:28, C Tuskegee step 6 | high |
| IRB and vulnerable populations | covered well (fix I13) | B:69, L10 core | medium |
| Equipoise; placebo ethics | covered well | B:47, S:48, C MRC | medium |
| **Data safety monitoring boards, stopping rules** | missing | only implied in C WHI | **medium-high** |
| Nuremberg Code, Declaration of Helsinki | missing | none | medium |
| Minors in research: parental permission and child assent | missing | none | medium |
| Undue inducement and payment; therapeutic misconception | thin | C Tuskegee step 6 distractor | low-medium |
| Emergency research exception, waiver of consent | missing | none | low |
| Confidentiality / HIPAA in research | missing | none | low |

---

## The 15 highest-value gaps, with teaching notes

### 1. Abstract and drug-ad questions (high)
Step 1, 2CK and 3 all present a one-page abstract or pharmaceutical advertisement followed by two or three questions.

Work in this order:
1. Read the questions first.
2. In the abstract, find the design, the population (inclusion and exclusion criteria), the intervention, the comparator and the **primary** outcome.
3. Turn any relative claim into absolute numbers from the results table (ARR, NNT).
4. Check the common traps:
   - a "significant" secondary or subgroup result while the primary outcome failed;
   - a surrogate endpoint;
   - a composite driven by its softest component;
   - a non-inferiority result advertised as "as effective as";
   - per-protocol analysis only;
   - industry funding.
5. Ask whether the patient in the question would have been eligible. If they would have been excluded (age, renal function, pregnancy), the result doesn't directly apply.

Typical questions: compute the NNT; name the main limitation; pick the statement the data actually support; decide to which patient the results generalise.

### 2. Overlapping confidence intervals (high)
Two different questions get confused.
- **CI of the difference:** if the 95% CI for a difference (or ratio) excludes 0 (or 1), the difference is significant.
- **CIs of two separate groups:** if the two 95% CIs **do not overlap**, the difference is significant at p < 0.05. If they **overlap**, you cannot conclude it is non-significant: two intervals can overlap by up to about a quarter of their width while p < 0.05.

The exam convention (First Aid) is "non-overlapping → significant; overlapping → usually no significant difference." Teach the convention, flag the caveat, and always prefer the CI of the difference when it is given.

### 3. Vaccine efficacy (high)
Vaccine efficacy is a relative risk reduction:

VE = (attack rate in unvaccinated − attack rate in vaccinated) / attack rate in unvaccinated = 1 − RR.

Example: influenza in 10% of unvaccinated and 2% of vaccinated → VE = (10 − 2)/10 = 80%. The ARR is 8 points, so the number needed to vaccinate is 1/0.08 ≈ 13.
- **Efficacy** comes from an RCT. **Effectiveness** is the real-world value, often from test-negative case-control studies, where VE = 1 − OR.
- Herd immunity links to this: coverage needed ≈ (1 − 1/R₀)/VE. For R₀ 15 and VE 95%, that is 0.93/0.95 ≈ 98%.

### 4. Test and treatment thresholds (high, Step 2/3)
Every diagnostic decision has two thresholds.
- Below the **testing threshold**, the disease is unlikely enough that neither testing nor treating helps (the patient goes home).
- Above the **treatment threshold**, you treat without testing, because no plausible negative result would bring the probability low enough.
- Testing only makes sense **between** the two.

The treatment threshold falls as treatment becomes safer or more beneficial: threshold probability = harm / (harm + benefit). The test threshold falls as the test becomes more accurate and safer.

This is why a low-risk PE patient who is PERC-negative gets no D-dimer, an intermediate one gets a D-dimer, and a high-risk one goes straight to CTPA (or empirical anticoagulation if imaging is delayed). It is the formal version of the app's "tests are for the middle" line.

### 5. Cognitive biases in diagnosis (high, Step 2/3)
Step 2CK/3 safety items name the thinking error. Define each with a one-line vignette:
- **Anchoring:** sticking to the first impression despite new data.
- **Availability:** judging likelihood by how easily cases come to mind (the last patient had a dissection).
- **Premature closure:** stopping the search once one diagnosis fits.
- **Confirmation bias:** seeking only supporting evidence.
- **Framing effect:** decisions change with how options are presented ("90% survive" vs "10% die").
- **Representativeness / base-rate neglect:** ignoring prevalence, which ties directly to the PPV lessons.
- **Diagnostic momentum:** a label passed along handoffs unchallenged.
- **Search satisficing:** stopping after the first abnormality (the second fracture is missed).
- **Sunk-cost bias.**

Fixes: a diagnostic time-out ("what else could this be?"), checklists, and second opinions. These are cognitive errors, not latent system errors. They fit the Swiss cheese lesson as active errors at the sharp end.

### 6. Disclosure of medical errors (high, Step 2/3)
Errors that reach the patient are disclosed promptly, honestly and personally, whether or not harm occurred.
- Disclosure is done by the responsible physician (with risk management support), not delegated or delayed until the investigation finishes.
- Content: what happened, the likely consequences, what is being done to correct it and prevent recurrence, and a sincere apology.
- Don't speculate, blame colleagues, or alter records.
- The error is also reported through the institution's safety system. Near misses are reported internally, and disclosing them to the patient is optional.
- If a colleague's error is found, first encourage them to disclose, then escalate.

On the exam the answer is almost never "wait", "tell only the family" or "say nothing because there was no harm".

### 7. Donabedian structure, process, outcome and balancing measures (high, Step 2/3)
QI items ask you to classify a metric.
- **Structure:** the resources and setting (nurse-to-patient ratio, a working barcode scanner, a stroke unit).
- **Process:** what was done (% of diabetics with an annual foot exam, door-to-needle time, hand-hygiene compliance).
- **Outcome:** the result for patients (amputation rate, 30-day mortality, HbA1c control).
- **Balancing measure:** unintended effects elsewhere (faster discharges → more readmissions; tighter glucose targets → more hypoglycaemia).

Process measures respond quickly and are easy to attribute. Outcome measures matter most but need risk adjustment (link to S2:11). A good PDSA project names one of each, e.g. for the KCl story: storage separation (structure), double-check compliance (process), wrong-drug events (outcome), dispensing delays (balancing).

### 8. Run charts, control charts and fishbone diagrams (high, Step 2/3)
A **run chart** plots a measure over time against its median. Non-random signals (the IHI rules):
- a **shift**: 6 or more consecutive points on one side of the median;
- a **trend**: 5 or more consecutive points all rising or all falling;
- too few or too many runs;
- an obvious outlier.

A **control (SPC) chart** adds a mean and control limits at about ±3 sigma.
- **Common-cause** variation is random noise inside the limits. React by changing the system, not by chasing single points.
- **Special-cause** variation is a point outside the limits or a rule violation. React by investigating that event.

A **fishbone (Ishikawa) diagram** sorts the possible causes found in an RCA into categories (people, methods, equipment, materials, environment, measurement). A **Pareto chart** then ranks them.

### 9. Screening decisions in practice (high, Step 2/3)
A screening programme helps only if early treatment changes outcomes (Wilson–Jungner), and benefit must be shown as lower **mortality in RCTs** (lead time, length time and overdiagnosis distort survival).
- USPSTF grades: A/B offer; C offer selectively; D don't; I insufficient evidence.
- Harms to name: false positives and their work-up, overdiagnosis and overtreatment, anxiety, procedure complications.
- Stop screening when life expectancy is under about 10 years, or past the upper age limit.

Anchor examples (USPSTF, current at review; check before exam):
- colorectal 45–75;
- mammography every 2 years at 40–74;
- cervical 21–65;
- low-dose CT lung at 50–80 with ≥ 20 pack-years, current or quit < 15 years;
- one-off AAA ultrasound in men 65–75 who have ever smoked;
- PSA 55–69 by shared decision.

The NNS shows the trade-off: hundreds to thousands are screened to prevent one death.

### 10. Distribution shape, dispersion and outliers (medium-high)
The app only teaches right skew.
- **Left (negative) skew:** mean < median < mode, with the tail on the left. Example: age at death in high-income countries.
- **Bimodal:** two peaks. Example: age at diagnosis of Hodgkin lymphoma.
- **An extreme outlier** moves the mean and SD a lot, and the median and IQR hardly at all. That is why medians and IQRs are used for skewed data.
- **Adding a constant** to every value shifts the mean, median and mode but leaves the SD unchanged.
- **Multiplying** every value by k multiplies the mean and SD by k.
- Variance is SD².

These are short calculation-free Step 1 items that the current pool can't generate.

### 11. Reading regression output (medium-high)
- **Linear regression:** each coefficient is the change in the outcome per one-unit change in that predictor, holding the others constant. R² is the share of variance explained.
- **Logistic regression:** for a binary outcome, e^β is the **adjusted odds ratio**. An adjusted OR of 1.8 (95% CI 1.2–2.7) for smoking means 80% higher odds after accounting for the other variables in the model.
- "Adjusted" only covers what is **in the model**: unmeasured confounding remains (the HRT lesson).
- Don't adjust for mediators or colliders.
- Too many variables for too few events (rule of thumb about 10 events per variable) causes overfitting.
- A crude OR that moves a lot after adjustment signals confounding.
- Cox regression is the time-to-event version and gives an adjusted HR.

### 12. DSMBs, Helsinki, Nuremberg and children in research (medium-high)
- **DSMB:** an independent committee that alone sees unblinded interim results. It can recommend stopping for clear benefit, harm or futility under pre-specified rules. Stopping early for benefit tends to overestimate the effect (S2:25). WHI was stopped this way.
- **Nuremberg Code (1947):** voluntary consent is absolutely essential.
- **Declaration of Helsinki (1964, revised):** physicians' duties in research; placebo only when no proven intervention exists or under strict methodological conditions; post-trial access.
- **Children:** permission from parents plus the child's own **assent** (from about age 7). The research risk ceiling rises only with prospect of direct benefit.
- **Payment:** must not be so large it becomes **undue inducement**.
- **Therapeutic misconception:** participants believing research is individualised care. It must be corrected during consent.

### 13. Exam names for biases (high)
The app mostly uses epidemiology and Cochrane names. USMLE uses First Aid names, so map them explicitly:
- **Procedure bias:** groups treated differently apart from the intervention. Equals the app's "performance bias".
- **Measurement bias:** the instrument or method systematically misrecords. Overlaps with misclassification and information bias.
- **Observer-expectancy bias:** equals Pygmalion.
- **Non-response bias:** responders differ from non-responders. A form of selection bias.
- **Sampling bias:** the sample isn't representative. Selection bias, affecting external validity.
- **Late-look bias:** equals Neyman / prevalence–incidence bias.

A twin set or bestiary "aka" line for each would stop the learner losing marks on vocabulary they already understand.

### 14. Mortality rates and a worked direct standardisation (medium)
Definitions:
- **Crude mortality rate:** deaths / mid-year population.
- **Age-specific** and **cause-specific** rates restrict the numerator and denominator.
- **Infant mortality rate:** deaths under 1 year per 1,000 live births. **Neonatal:** under 28 days.
- **Maternal mortality ratio:** deaths during pregnancy or within 42 days per 100,000 live births.
- **Proportionate mortality:** deaths from one cause / all deaths.

Worked direct standardisation, using a standard population of 1,000 young and 1,000 old:
- Town A: young 2/1,000, old 20/1,000 → 2 + 20 = 22 expected deaths / 2,000 = **11 per 1,000**.
- Town B: young 3/1,000, old 25/1,000 → 28 / 2,000 = **14 per 1,000**.

Town A may still have more crude deaths if it is older. Standardisation removes the age structure. **Indirect** standardisation (SMR) applies the standard's rates to your population instead, and is used when your own age-specific rates are unstable.

### 15. Precision, accuracy, reliability and validity (high)
- **Precision (reliability):** results agree on repetition. It is reduced by **random error** and improved by more measurements or larger n.
- **Accuracy (validity):** results are close to the truth. It is reduced by **systematic error (bias)** and is **not** fixed by a larger n.
- On a dartboard: tight cluster off-centre = precise but inaccurate; scattered around the bullseye = accurate but imprecise.
- Reliability is measured as test–retest or inter-rater agreement (kappa for categories, Bland–Altman for continuous measures). Validity is measured against a reference standard (sensitivity and specificity).
- **Internal validity:** is the study's answer right for its own participants? **External validity (generalisability):** does it apply to other patients?
- A test can be reliable without being valid (a scale that always reads 2 kg heavy), but not valid without being reliable.
